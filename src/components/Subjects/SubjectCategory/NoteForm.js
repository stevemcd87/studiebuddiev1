import React, { useState, useEffect, useContext, useRef } from "react";
import "./NoteForm.css";
import ApiContext from "../../../contexts/ApiContext";
function NoteForm(props) {
  let { subjectCategory, setSubjectCategoryNotes } = props,
    [title, setTitle] = useState(""),
    // NoteInput Component list
    [notes, setNotes] = useState([]),
    noteArray = useRef(null),
    { API } = useContext(ApiContext);

  useEffect(() => {
    console.log("note inputs");
    console.log(notes);
    console.log([...noteArray.current.querySelectorAll(".note")]);
  }, [notes]);

  useEffect(() => {
    // console.log("subjectCategoryNotes");
    // console.log(subjectCategoryNotes);
  }, []);
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
      <button type="submit" onClick={postNote}>
        Create Note
      </button>
    </div>
  );
  function addNoteInput() {
    // Assigns a 'key' value for Component
    let key = notes[0] ? notes[notes.length - 1].key + 1 : 0;
    setNotes([...notes, <NoteInput {...{ key }} />]);
  }

  function postNote() {
    console.log("postNote");
    let note = {
      title,
      notes: []
    };

    [...noteArray.current.querySelectorAll(".note")].forEach(noteElement => {
      note.notes.push(noteElement.value);
    });
    console.log(note);
    submitForm(note);
  }

  function submitForm(note) {
    // if (!subject) {
    API.post(
      "StuddieBuddie",
      `/subjects/${subjectCategory.name}/${subjectCategory.category}`,
      {
        body: JSON.stringify(note)
      }
    )
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

function NoteInput() {
  return (
    <div>
      <textarea className="note" />
    </div>
  );
}

export default NoteForm;
