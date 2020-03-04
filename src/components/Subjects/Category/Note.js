import React, { useState, useEffect, useContext } from "react";
import NoteForm from "./NoteForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
function Note(props) {
  let { note } = props,
    { subjectName, categoryName } = useParams(),
    [imageSrc, setImageSrc] = useState(),
    [mediaRecorder, setMediaRecorder] = useState(),
    [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [displayForm, setDisplayForm] = useState(false),
    { categoryNotes, getCategoryNotes } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {
    setDisplayForm(false);
  }, [categoryNotes]);

  useEffect(() => {
    console.log(imageSrc);
    if(note.image) getImage();

  }, []);

  function getImage(){
    Storage.get(note.image.replace('public/',''))
      .then(res => {
        console.log("image res");
        console.log(res);
        setImageSrc(res);
      })
      .catch(err => {
        console.log(err);
      });
  }


  function playAudio(s3Key) {
    // audio.play();
    console.log(s3Key);
    Storage.get(s3Key.replace('public/',''))
      .then(res => {
        console.log("play audio res");
        console.log(typeof res);
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
      <span className="delete-note" onClick={() => deleteNote(note)}>
        X
      </span>
      {displayForm && <NoteForm {...{ note }} />}
      {!displayForm && (
        <div className="note-detail">
          {note.image && (
            <img src={imageSrc} />
          )}
          {note.audioNote && (
            <button onClick={() => playAudio(note.audioNote)}>
              Play Audio Note
            </button>
          )}
          {note.mainNote && <p>{note.mainNote}</p>}
          {note.subnotes && note.subnotes.map((n, i) => <p key={n + i}>{n}</p>)}
          <span
            className="edit-note"
            onClick={() => setDisplayForm(!displayForm)}
          >
            Edit Note
          </span>
        </div>
      )}
    </div>
  );


  function deleteNote(n) {
    console.log("deleteNote");
    API.del("StuddieBuddie", `/subjects/${subjectName}/${categoryName}/notes/${n.pathName}`, {
      body: JSON.stringify({
        username: user.user.username,
        pathName: n.pathName
      })
    })
      .then(response => {
        console.log('delete note response');
        console.log(response);
        getCategoryNotes();
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

export default Note;
