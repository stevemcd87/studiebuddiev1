import React, { useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";
import Question from "./Question";
// import Note from "./NoteForm";

export default function Questions(props) {
  let { categoryNotes } = useContext(CategoryContext);


  return (
    <div className="questions-component">
      <h2>Questions</h2>
      <Question />
    </div>
  );

}
