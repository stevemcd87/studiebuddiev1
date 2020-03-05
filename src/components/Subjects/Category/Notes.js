import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../contexts/CategoryContext";
import Note from "./Note";
import NoteForm from "./NoteForm";

function Notes(props) {
  let [autoPlay, setAutoPlay] = useState(false),
    [autoPlayIndex, setAutoPlayIndex] = useState(),
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    { categoryNotes } = useContext(CategoryContext);

  useEffect(() => {
    setAutoPlayIndex(autoPlay ? 0 : null);
    console.log(autoPlay);
  }, [autoPlay]);

  useEffect(() => {
    setDisplayNoteForm(false);
  }, [categoryNotes]);
  return (
    <div className="notes-component">
      <button type="button" onClick={() => setAutoPlay(!autoPlay)}>
        {autoPlay ? "Stop AutoPlay" : "Auto Play Notes"}
      </button>
      <div className="notes">
        {!displayNoteForm && (
          <button
            type="button "
            onClick={() => setDisplayNoteForm(!displayNoteForm)}
          >
            Create Note
          </button>
        )}
        {displayNoteForm && <NoteForm />}
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
    </div>
  );

  function nextAutoPlayIndex() {
    console.log("nextautoPlay");
    if (autoPlayIndex < categoryNotes.length - 1) {
      setAutoPlayIndex(autoPlayIndex + 1);
    } else {
      setAutoPlayIndex(null);
      console.log("finished");
    }
  }
}

export default Notes;
