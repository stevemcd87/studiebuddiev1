import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import "./NoteForm.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faRecordVinyl,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
function NoteForm(props) {
  let { subjectName, categoryName } = useParams(),
    { note } = props,
    [image, setImage] = useState(),
    [mediaRecorder, setMediaRecorder] = useState(),
    [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [recording, setRecording] = useState(false),
    [mainNote, setMainNote] = useState(note ? note.mainNote : ""),
    // NoteInput Component list
    [subnotes, setSubnotes] = useState([]),
    noteArray = useRef(null),
    { API, Storage, user } = useContext(ApiContext);


// for Audio Note componentDidMount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mr = new MediaRecorder(stream);
      setMediaRecorder(mr);
    });
    return function cleanup() {
      mediaRecorder.removeEventListener("dataavailable", () => {});
      mediaRecorder.removeEventListener("stop", () => {});
    };
  }, []);

  useEffect(() => {
    if (audioBlob) {
      console.log(URL);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(new Audio(audioUrl));
    } else {
      setAudio(null);
    }
  }, [audioBlob]);

  useEffect(() => {
    console.log("note");
    console.log(note);
  }, [note]);

// for SubNotes if updating note
  useEffect(() => {
    if (note && note.subnotes){
      let sn = [];
      note.subnotes.forEach((v)=>{
        let key = sn[0] ? sn[sn.length - 1].key + 1 : 0;
        sn.push(<NoteInput note={v}{...{ key } } />);
      })
      setSubnotes(sn);
    }

  }, []);

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
  }, [recording]);

  function startRecord() {
    setRecording(true);
  }

  function playAudio() {
    audio.play();
  }

  function uploadFile(evt) {
    console.log("uploadFile");
    // Storage.put(
    //   `${subjectName}/${categoryName}/${note.id}/noteIndex`,
    //   audioBlob
    // )
    //   .then(res => console.log(res))
    //   .catch(err => {
    //     console.error(err);
    //   });
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

  // <button onClick={uploadFile}> Save</button>

  return (
    <div className="note-form">
      <div className="audio-note">
        <h3>Audio Note</h3>
        {note && note.audioNoteKey && <button onClick={getData}></button>}
        <button disabled={recording} onClick={startRecord}>
          <FontAwesomeIcon icon={faRecordVinyl} />
        </button>
        <button
          disabled={!recording}
          onClick={() => {
            mediaRecorder.stop();
            setRecording(false);
          }}
        >
          <FontAwesomeIcon icon={faStop} />
        </button>

        <button
          className="play-audio-button"
          onClick={playAudio}
          disabled={!audio}
        >
          <FontAwesomeIcon icon={faPlay} />
        </button>
        <button
          className="delete-audio-button"
          onClick={() => setAudioBlob(null)}
          disabled={!audio}
        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
      <input
        className="note-mainNote"
        type="text"
        defaultValue={mainNote}
        onChange={e => setMainNote(e.target.value)}
        placeholder="Main Note"
      />
      <div className="note-array" ref={noteArray}>
        {subnotes.map(noteInputComponent => noteInputComponent)}
      </div>
      <button type="button" onClick={addNoteInput}>
        Add Subnote
      </button>
      <button type="button" onClick={prepNote}>
        {!note ? "Post Note" : "Update Note"}
      </button>
    </div>
  );

  function updateNote(n) {
  }

  function addNoteInput() {
    // Assigns a 'key' value for Component
    let key = subnotes[0] ? subnotes[subnotes.length - 1].key + 1 : 0;
    setSubnotes([...subnotes, <NoteInput {...{ key }} />]);
  }

  function prepNote() {
    console.log("postNote");
    let noteValues = {
      username: user.user.username,
      mainNote: mainNote ? mainNote.trim() : false,
      subnotes: [],
      audioNote: audio ? true : false,
      image: image ? true : false
    };
    // for subNotes
    console.log("noteValues");
    console.log(noteValues);
    [...noteArray.current.querySelectorAll(".note")].forEach(noteElement => {
      noteValues.subnotes.push(noteElement.value);
    });
    console.log(note);
    !note ? postNote(noteValues) : updateNote(noteValues);
  }

  function postNote(n) {
    API.post("StuddieBuddie", `/subjects/${subjectName}/${categoryName}`, {
      body: JSON.stringify(n)
    })
      .then(response => {
        console.log("response posting note");
        console.log(response);
        setTimeout(function() {
          if (audio) {
            console.log("audio");
            // Storage.put(
            //   `${name}/${category}/${em.data.Attributes.subnotes.length -
            //     1}/${id}`,
            //   audioBlob
            // )
            //   .then(res => {
            //     console.log(res);
            //     console.log("storage PUT  complete");
            //     setSubjectCategoryNotes(em.data.Attributes.subnotes);
            //   })
            //   .catch(err => {
            //     console.log(err);
            //   });
          }
        }, 1000);
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }
} // End of component
function NoteInput(props) {
  let { note } = props;
  return (
    <div>
      <textarea className="note" defaultValue={note ? note : ""} />
    </div>
  );
}
// function displayNotes(subnotesArray, setSubnotes) {
//   setSubnotes(subnotesArray.map((n, i) => <NoteInput key={i} note={n} />));
// }


export default NoteForm;
