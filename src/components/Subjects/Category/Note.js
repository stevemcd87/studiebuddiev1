import React, { useState, useEffect, useContext } from "react";
import NoteForm from "./NoteForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
function Note(props) {
  let {
      note,
      subjectCategoryNotes,
      setSubjectCategoryNotes,
      noteIndex
    } = props,
    [mediaRecorder, setMediaRecorder] = useState(),
    [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [displayEdit, setDisplayEdit] = useState(false),
    { name, category } = useParams(),
    { API, Storage } = useContext(ApiContext);


  useEffect(() => {
    setDisplayEdit(false);
  }, [subjectCategoryNotes]);



  // useEffect(() => {
  //   console.log(mediaRecorder);
  // }, [mediaRecorder]);



  function playAudio(s3Key) {
    // audio.play();
    console.log(s3Key);
    Storage.get(s3Key.replace('public/',''))
      .then(res => {
        console.log("res");
        console.log(res);
        // setAudioBlob(res);
        new Audio(res).play();
      })
      .catch(err => {
        console.log(err);
      });
  }



  // <div className="test">
  //   <p> Pick a file(AUDIO)</p>
  //   <input type="file" onChange={uploadFile} />
  // </div>

  return (
    <div className="note">
      <span className="delete-note" onClick={() => deleteNote(noteIndex)}>
        X
      </span>
      {displayEdit && (
        <NoteForm
          {...{
            note,
            subjectCategoryNotes,
            setSubjectCategoryNotes,
            noteIndex
          }}
        />
      )}
      {!displayEdit && (
        <div className="note-detail">
          {note.audioNoteKey && <button onClick={()=>playAudio(note.audioNoteKey)}>Play Audio Note</button>}
          <p>{note.title}</p>
          {note.notes && note.notes.map((n, i) => <p key={n + i}>{n}</p>)}
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
}

export default Note;
