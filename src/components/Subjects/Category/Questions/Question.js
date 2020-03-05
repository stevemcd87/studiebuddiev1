import React, { useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";

// import Note from "./NoteForm";

export default function Question(props) {
  let { categoryNotes } = useContext(CategoryContext);


  return (
    <div className="questions-component">
      <h2>Question</h2>
    </div>
  );
}
