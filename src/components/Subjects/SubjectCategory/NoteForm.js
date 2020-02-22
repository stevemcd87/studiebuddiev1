import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import "./NoteForm.css";
import ApiContext from "../../../contexts/ApiContext";
function NoteForm(props) {
  let {
      subjectCategoryNotes,
      setSubjectCategoryNotes,
      note,
      noteIndex
    } = props,
    { name, category } = useParams(),
    [title, setTitle] = useState(note ? note.title : ""),
    // NoteInput Component list
    [notes, setNotes] = useState([]),
    noteArray = useRef(null),
    { API } = useContext(ApiContext);

  useEffect(() => {
    if (note) displayNotes(note.notes, setNotes);
  }, [note]);

  useEffect(() => {
    // console.log("subjectCategoryNotes");
    // console.log(subjectCategoryNotes);
    console.log(noteIndex);
  }, [noteIndex]);

  function audioStreamInitialize() {
    var self = this;

    /*
 	Feature detecting is a simple check for the existence of "navigator.mediaDevices.getUserMedia"

 	To use the microphone. we need to request permission.
 	The parameter to getUserMedia() is an object specifying the details and requirements for each type of media you want to access.
 	To use microphone it shud be {audio: true}

 	*/
    navigator.mediaDevices
      .getUserMedia(self.audioConstraints)
      .then(function(stream) {
        /*
 	Creates a new MediaRecorder object, given a MediaStream to record.
 	*/
        self.recorder = new MediaRecorder(stream);

        /*
 	Called to handle the dataavailable event, which is periodically triggered each time timeslice milliseconds of media have been recorded
 	(or when the entire media has been recorded, if timeslice wasn't specified).
 	The event, of type BlobEvent, contains the recorded media in its data property.
 	You can then collect and act upon that recorded media data using self event handler.
 	*/
        self.recorder.addEventListener("dataavailable", function(e) {
          var normalArr = [];
          /*
 	Here we push the stream data to an array for future use.
 	*/
          self.recordedChunks.push(e.data);
          normalArr.push(e.data);

          /*
 	here we create a blob from the stream data that we have received.
 	*/
          var blob = new Blob(normalArr, {
            type: "audio/webm"
          });

          /*
 	if the length of recordedChunks is 1 then it means its the 1st part of our data.
 	So we createMultipartUpload which will return an upload id.
 	Upload id is used to upload the other parts of the stream

 	else.
 	It Uploads a part in a multipart upload.
 	*/
          if (self.recordedChunks.length == 1) {
            self.startMultiUpload(blob, self.filename);
          } else {
            /*
 	self.incr is basically a part number.
 	Part number of part being uploaded. This is a positive integer between 1 and 10,000.
 	*/
            self.incr = self.incr + 1;
            self.continueMultiUpload(
              blob,
              self.incr,
              self.uploadId,
              self.filename,
              self.bucketName
            );
          }
        });
      });
  }

  /*
 	The MediaRecorder method start(), which is part of the MediaStream Recording API,
 	begins recording media into one or more Blob objects.
 	You can record the entire duration of the media into a single Blob (or until you call requestData()),
 	or you can specify the number of milliseconds to record at a time.
 	Then, each time that amount of media has been recorded, an event will be delivered to let you act upon the recorded media,
 	while a new Blob is created to record the next slice of the media
 	*/
  function startRecording(id) {
    var self = this;

    /*
 	1800000 is the number of milliseconds to record into each Blob.
 	If this parameter isn't included, the entire media duration is recorded into a single Blob unless the requestData()
 	method is called to obtain the Blob and trigger the creation of a new Blob into which the media continues to be recorded.
 	*/
    /*
 	PLEASE NOTE YOU CAN CHANGE THIS PARAM OF 1800000 but the size should be greater then or equal to 5MB.
 	As for multipart upload the minimum breakdown of the file should be 5MB
 	*/
    this.recorder.start(1800000);
  }

  /*
 	When the stop() method is invoked, the UA queues a task that runs the following steps:
 	1 - If MediaRecorder.state is "inactive", raise a DOM InvalidState error and terminate these steps.
 	If the MediaRecorder.state is not "inactive", continue on to the next step.
 	2 - Set the MediaRecorder.state to "inactive" and stop capturing media.
 	3 - Raise a dataavailable event containing the Blob of data that has been gathered.
 	4 - Raise a stop event.
 	*/
  function stopRecording(id) {
    var self = this;
    self.recorder.stop();
  }

  /*
 	Initiates a multipart upload and returns an upload ID.
 	Upload id is used to upload the other parts of the stream
 	*/
  function startMultiUpload(blob, filename) {
    var self = this;
    var audioBlob = blob;
    var params = {
      Bucket: self.bucketName,
      Key: filename,
      ContentType: "audio/webm",
      ACL: "private"
    };
    self.s3.createMultipartUpload(params, function(err, data) {
      if (err) {
        console.log(err, err.stack); // an error occurred
      } else {
        self.uploadId = data.UploadId;
        self.incr = 1;
        self.continueMultiUpload(
          audioBlob,
          self.incr,
          self.uploadId,
          self.filename,
          self.bucketName
        );
      }
    });
  }
  /*
 	Uploads a part in a multipart upload.
 	The following code uploads part of a multipart upload.
 	it specifies a file name for the part data. The Upload ID is same that is returned by the initiate multipart upload.
 	*/
  function continueMultiUpload(
    audioBlob,
    PartNumber,
    uploadId,
    key,
    bucketName
  ) {
    var self = this;
    var params = {
      Body: audioBlob,
      Bucket: bucketName,
      Key: key,
      PartNumber: PartNumber,
      UploadId: uploadId
    };
    console.log(params);
    self.s3.uploadPart(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } // an error occurred
      else {
        /*
 	Once the part of data is uploaded we get an Entity tag for the uploaded object(ETag).
 	which is used later when we complete our multipart upload.
 	*/
        self.etag.push(data.ETag);
        if (self.booleanStop == true) {
          self.completeMultiUpload();
        }
      }
    });
  }
  /*


Completes a multipart upload by assembling previously uploaded parts.


*/

  function completeMultiUpload() {
    var self = this;

    var outputTag = [];

    /*


here we are constructing the Etag data in the required format.


*/

    self.etag.forEach((data, index) => {
      const obj = {
        ETag: data,

        PartNumber: ++index
      };

      outputTag.push(obj);
    });

    var params = {
      Bucket: self.bucketName, // required

      Key: self.filename, // required

      UploadId: self.uploadId, // required

      MultipartUpload: {
        Parts: outputTag
      }
    };

    self.s3.completeMultipartUpload(params, function(err, data) {
      if (err) {
        console.log(err, err.stack);
      } // an error occurred
      else {
        // initialize variable back to normal

        self.etag = [];
        self.recordedChunks = [];

        self.uploadId = "";

        self.booleanStop = false;

        self.disableAllButton();

        self.removeLoader();

        alert("we have successfully saved the questionaire..");
      }
    });
  }

  return (
    <div className="note-form">
      <input
        className="note-title"
        type="text"
        defaultValue={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title (Optional)"
      />

      <button
        type="button"
        className="btn kc record"
        id="record_q1"
        disabled="disabled"
        onClick={(e)=>startRecording(e.target.id)}
      >
        Record
      </button>

      <button
        type="button"
        className="btn kc stop"
        id="stop_q1"
        disabled="disabled"
        onClick={(e)=>stopRecording(e.target.id)}
      >
        Stop
      </button>
      <div className="note-array" ref={noteArray}>
        {notes.map(noteInputComponent => noteInputComponent)}
      </div>

      <button type="button" onClick={addNoteInput}>
        Add Note
      </button>
      {!note && (
        <button type="submit" onClick={postNote}>
          Create Note
        </button>
      )}
      {note && (
        <button type="submit" onClick={postNote}>
          Update Note
        </button>
      )}
    </div>
  );

  function updateNote(n) {
    console.log("het");
    console.log(n);
    API.put(
      "StuddieBuddie",
      `/subjects/${name}/${category}/notes/${noteIndex}`,
      {
        body: JSON.stringify(n)
      }
    )
      .then(response => {
        let em = JSON.parse(response.errorMessage);
        console.log("notes");
        console.log(em);
        let scn = subjectCategoryNotes.slice();
        scn[noteIndex] = em.data.Attributes.notes[0];
        setSubjectCategoryNotes(scn);
        console.log("response");
        console.log(response);
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }

  function addNoteInput() {
    // Assigns a 'key' value for Component
    let key = notes[0] ? notes[notes.length - 1].key + 1 : 0;
    setNotes([...notes, <NoteInput {...{ key }} />]);
  }

  function postNote() {
    console.log("postNote");
    let noteValues = {
      title,
      notes: []
    };

    [...noteArray.current.querySelectorAll(".note")].forEach(noteElement => {
      noteValues.notes.push(noteElement.value);
    });
    console.log(note);
    !note ? submitForm(noteValues) : updateNote(noteValues);
  }

  function submitForm(n) {
    // if (!subject) {
    API.post("StuddieBuddie", `/subjects/${name}/${category}`, {
      body: JSON.stringify(n)
    })
      .then(response => {
        let em = JSON.parse(response.errorMessage);
        console.log("parse error");
        console.log(em.data.Attributes.notes);
        setSubjectCategoryNotes(em.data.Attributes.notes);
        console.log("response");
        console.log(response);
      })
      .catch(error => {
        console.log("ERROR");
        console.log(JSON.parse(error));
      });
    // } else {
    //   API.put("StuddieBuddie", "/subjects", {
    //     body: JSON.stringify({
    //       name: nameValue,
    //       category: category,
    //       newName: name,
    //       newCategory: category
    //     })
    //   })
    //     .then(response => {
    //       console.log(response);
    //       getSubjects(API, setSubjects);
    //       setShowForm(false);
    //     })
    //     .catch(error => {
    //       console.log(error.response);
    //     });
    // }
  }
} // End of component

function displayNotes(notesArray, setNotes) {
  setNotes(notesArray.map((n, i) => <NoteInput key={i} note={n} />));
}
function NoteInput(props) {
  let { note } = props;
  return (
    <div>
      <textarea className="note" defaultValue={note ? note : ""} />
    </div>
  );
}

export default NoteForm;
