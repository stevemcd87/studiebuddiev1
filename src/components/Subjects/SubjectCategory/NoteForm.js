import React, { useState, useEffect, useContext, useRef } from "react";
import "./NoteForm.css";
import ApiContext from "../../../contexts/ApiContext";
function NoteForm() {
  let [title, setTitle] = useState(""),
    [notes, setNotes] = useState([]),
    noteArray = useRef(null),
    { API } = useContext(ApiContext);
  useEffect(() => {
    console.log(title);
  }, [title]);

  useEffect(() => {
    console.log(notes);
    console.log(noteArray.current.querySelectorAll(".note"));
  }, [notes]);
  return (
    <div className="note-form">
      <input
        className="note-title"
        type="text"
        defaultValue={title}
        onChange={e => setTitle(e.target.value)}
        placeholcer="optional"
      />
      <div className="note-array" ref={noteArray}>
        {notes.map(v => v)}
      </div>

      <button type="button" onClick={addNoteInput}>
        Add Note
      </button>
    </div>
  );
  function addNoteInput() {
    let key = notes[0] ? notes[notes.length - 1].key + 1 : 0;
    setNotes([...notes, <NoteInput {...{ key }} />]);
  }
}

function NoteInput() {
  // let [note, setNote] = useState("");
  // useEffect(() => {
  //   console.log(note);
  // }, [note]);
  return (
    <div>
      <textarea className="note" />
      <button type="button"></button>
    </div>
  );
}

export default NoteForm;
