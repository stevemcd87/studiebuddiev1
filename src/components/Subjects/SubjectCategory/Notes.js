import React  from "react";
//  { useState, useEffect, useContext }
import Note from "./Note";

function Notes(props) {
  let { subjectCategoryNotes, setSubjectCategoryNotes } = props;
  return (
    <div className="notes">
      {subjectCategoryNotes.map((note, noteIndex) => {
        return (
          <Note key={note.title + noteIndex} {...{note, noteIndex, subjectCategoryNotes, setSubjectCategoryNotes }}/>
        );
      })}
    </div>
  );

}

export default Notes;
