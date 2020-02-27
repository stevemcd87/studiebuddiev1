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
    [mediaRecorder, setMediaRecorder] = useState(),
    [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [recording, setRecording] = useState(false),
    { name, category } = useParams(),
    [title, setTitle] = useState(note ? note.title : ""),
    // NoteInput Component list
    [notes, setNotes] = useState([]),
    noteArray = useRef(null),
    { API , Storage} = useContext(ApiContext);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      console.log("stream");
      console.log(stream);
      const mr = new MediaRecorder(stream);
      console.log("mediaRecorder");
      console.log(mr);
      setMediaRecorder(mr);
      console.log("note");
      console.log(note);

      return function cleanup() {
        mediaRecorder.removeEventListener("dataavailable", () => {});
        mediaRecorder.removeEventListener("stop", () => {});
        // ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
      };
    });
  }, []);
  useEffect(() => {
    if (audioBlob) {
      console.log(URL);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(new Audio(audioUrl));
    }
  }, [audioBlob]);

  useEffect(() => {
    if (note) displayNotes(note.notes, setNotes);
  }, [note]);

  useEffect(() => {
    if (recording) {
      mediaRecorder.start();
      let audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        console.log(event);
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        setAudioBlob(new Blob(audioChunks));
      });
      console.log("recording");
    }
  }, [ recording]);

  useEffect(() => {
    // console.log("subjectCategoryNotes");
    // console.log(subjectCategoryNotes);
    console.log(noteIndex);
  }, [noteIndex]);

  function startRecord() {
    setRecording(true);
    // mediaRecorder.start();
    // let audioChunks = [];
    // mediaRecorder.addEventListener("dataavailable", event => {
    //   console.log(event);
    //   audioChunks.push(event.data);
    // });
    //
    // mediaRecorder.addEventListener("stop", () => {
    //   setAudioBlob(new Blob(audioChunks));
    // });
  }

  function playAudio() {
    audio.play();
  }

  function uploadFile(evt) {
    console.log("u");
    // let file = evt.target.files[0],
    //   name = file.name;
    Storage.put(`${name}/${category}/${note.id}/noteIndex`, audioBlob)
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
      });
  }

  function getData() {
    Storage.get(note.audioNoteKey)
      .then(res => {
        console.log("res");
        console.log(res);
        // setAudioBlob(res);
        new Audio(res).play();
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="note-form">
      <div className="audio-note">
        {note && note.audioNoteKey && <button onClick={getData}>Play Audio Note</button>}
        <button onClick={startRecord}>{recording ? 'Recording..' :'start recording'}</button>
        <button onClick={() => {mediaRecorder.stop(); setRecording(false)}}>stop</button>
        <button onClick={uploadFile}> Save</button>
        {audio && <button onClick={playAudio}>Play Audio Note</button>}
      </div>
      <input
        className="note-title"
        type="text"
        defaultValue={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title (Optional)"
      />
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
        console.log("em");
        console.log(em);
        let em = JSON.parse(response.errorMessage),
         scn = subjectCategoryNotes.slice();
        // scn[noteIndex] = em.data.Attributes.notes[0];
        if (audioBlob){
          Storage.put(`${name}/${category}/${note.id}`, audioBlob)
            .then(res => {
              console.log(res);
              console.log('storage PUT  complete');
              setSubjectCategoryNotes(scn);})
            .catch(err => {
              console.log(err);
            });
        } else {
          setSubjectCategoryNotes(scn);
        }


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
      notes: [],

    };

    [...noteArray.current.querySelectorAll(".note")].forEach(noteElement => {
      noteValues.notes.push(noteElement.value);
    });
    console.log(note);
    !note ? submitForm(noteValues) : updateNote(noteValues);
  }

  function submitForm(n) {
    API.post("StuddieBuddie", `/subjects/${name}/${category}`, {
      body: JSON.stringify(n)
    })
      .then(response => {
        console.log('posting note');
        console.log(response);
        let em = JSON.parse(response.errorMessage),
          id = em.data.Attributes.notes[notes.length].id;
          // console.log("parse error");
          // console.log(em.data.Attributes.notes);
          // setSubjectCategoryNotes();
          // console.log("response");
          // console.log(response);
        console.log(em);
        setTimeout(function () {
          if (audioBlob){
            Storage.put(`${name}/${category}/${em.data.Attributes.notes.length - 1}/${id}`, audioBlob)
              .then(res => {
                console.log(res);
                console.log('storage PUT  complete');
                setSubjectCategoryNotes(em.data.Attributes.notes);
              })
              .catch(err => {
                console.log(err);
              });
          }
}, 5000);



      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
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
