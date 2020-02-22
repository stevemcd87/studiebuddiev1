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

  return (
    <div className="note-form">
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
