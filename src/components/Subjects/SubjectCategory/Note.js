import React,{useState, useEffect, useContext} from "react";
import NoteForm from "./NoteForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
function Note(props) {
  let { note, subjectCategoryNotes, setSubjectCategoryNotes, noteIndex } = props,
    [displayEdit, setDisplayEdit] = useState(false),
    { name, category } = useParams(),
    { API } = useContext(ApiContext);

    useEffect(()=>{
      setDisplayEdit(false)
    },[subjectCategoryNotes])
  return (
    <div className="note">
      <span className="delete-note" onClick={() => deleteNote(noteIndex)}>
        X
      </span>
      {displayEdit && (
        <NoteForm
          {...{ note, subjectCategoryNotes, setSubjectCategoryNotes, noteIndex }}
        />
      )}
      {!displayEdit && (
        <div className="note-detail">
          <p>{note.title}</p>
          {note.notes && note.notes.map((n, i) => (
            <p key={n + i}>{n}</p>
          ))}
          <span
            className="edit-note"
            onClick={() => setDisplayEdit(!displayEdit)}
          >
            Edit Note
          </span>
        </div>
      )}
    </div>
  );
  function deleteNote(index) {
    console.log("deleteNote");
    API.del("StuddieBuddie", `/subjects/${name}/${category}/notes/${index}`, {})
      .then(response => {
        let em = JSON.parse(response.errorMessage);
        console.log("response");
        console.log(em);
        setSubjectCategoryNotes(em.data.Attributes.notes);
      })
      .catch(error => {
        console.log("error");
        console.log(error.response);
      });
  }

  function editNote() {
    console.log("edit note");
  }
}

export default Note;
