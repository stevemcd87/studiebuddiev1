import React, { useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
// import Note from "./NoteForm";

function Notes(props) {
  let { categoryNotes } = useContext(CategoryContext);
  return (
    <div className="notes">
      {categoryNotes.map(note => {
        return  (  <Note
            key={note.pathName}
            note={note}

          />)
      })}
    </div>
  );
}
// return (

export default Notes;
