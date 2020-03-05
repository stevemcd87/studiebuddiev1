import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
// import Note from "./NoteForm";

function Notes(props) {
  let [autoPlay, setAutoPlay] = useState(false),
    [autoPlayIndex, setAutoPlayIndex] = useState(),
    { categoryNotes } = useContext(CategoryContext);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
    console.log(autoPlay);
  }, [autoPlay]);
  return (
    <div className="note-component">
      <button type="button" onClick={() => setAutoPlay(!autoPlay)}>
        Auto Play Notes
      </button>
      <div className="notes">
        {categoryNotes.map((note, ind) => {
          return (
            <Note
              key={note.pathName}
              note={note}
              active={autoPlayIndex === ind ? true : false}
              nextAutoPlayIndex={nextAutoPlayIndex}
            />
          );
        })}
      </div>
    </div>
  );

  function nextAutoPlayIndex() {
    console.log("nextautoPlay");
    if (autoPlayIndex < categoryNotes.length - 1){
      setAutoPlayIndex(autoPlayIndex + 1);
    } else {
      console.log('finished');
    }
  }
}


export default Notes;
