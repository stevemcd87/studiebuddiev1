import React, { useState, useEffect, useContext, useRef } from "react";
import AudioNote from "./AudioNote";
import { useParams } from "react-router-dom";
import "./NoteForm.css";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";

function NoteForm(props) {
  let { subjectName, categoryName } = useParams(),
    { note } = props,
    [image, setImage] = useState(),
    [mainNote, setMainNote] = useState(note ? note.mainNote : ""),
    [audioBlob, setAudioBlob] = useState(),
    [subnotes, setSubnotes] = useState([]),
    noteArray = useRef(null),
    { getCategoryNotes } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {
    console.log("note");
    console.log(note);
  }, [note]);

  // for SubNotes if updating note
  useEffect(() => {
    if (note && note.subnotes) {
      let sn = [];
      note.subnotes.forEach(v => {
        let key = sn[0] ? sn[sn.length - 1].key + 1 : 0;
        sn.push(<NoteInput note={v} {...{ key }} />);
      });
      setSubnotes(sn);
    }
  }, []);

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

  return (
    <div className="note-form">
      <AudioNote {...{ note, audioBlob, setAudioBlob }} />
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

  function prepNote() {
    console.log("prepNote");
    let noteValues = {
      username: user.user.username,
      mainNote: mainNote ? mainNote.trim() : false,
      subnotes: [],
      audioNote: audioBlob ? true : false,
      image: image ? true : false
    };
    if (note) noteValues.pathName = note.pathName;
    // for subNotes
    console.log("noteValues");
    console.log(noteValues);
    [...noteArray.current.querySelectorAll(".note")].forEach(noteElement => {
      noteValues.subnotes.push(noteElement.value);
    });
    console.log(note);
    !note ? postNote(noteValues) : updateNote(noteValues);
  }

  function updateNote(n) {
    API.put(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/notes/${n.pathName}`,
      {
        body: JSON.stringify(n)
      }
    )
      .then(response => {
        console.log("update note response");
        console.log(response);
        // getCategoryNotes();
        if (audioBlob) {
          console.log("audioBlob");
          // setTimeout(function() {
          if (audioBlob) {
            console.log("audio");
            Storage.put(
              `${subjectName}/${categoryName}/notes/${user.user.username}/${n.pathName}`,
              audioBlob
            )
              .then(res => {
                console.log("storage PUT  complete RES");
                console.log(res);
                getCategoryNotes();
              })
              .catch(err => {
                console.log('err');
                console.log(err);
              });
          }
          // }, 1000);
        } else {
          getCategoryNotes();
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function postNote(n) {
    API.post("StuddieBuddie", `/subjects/${subjectName}/${categoryName}`, {
      body: JSON.stringify(n)
    })
      .then(response => {
        console.log("response posting note");
        console.log(response);
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }

  function addNoteInput() {
    // Assigns a 'key' value for Component
    let key = subnotes[0] ? subnotes[subnotes.length - 1].key + 1 : 0;
    setSubnotes([...subnotes, <NoteInput {...{ key }} />]);
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
