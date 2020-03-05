import React, { useState, useEffect, useContext } from "react";
import NoteForm from "./NoteForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlay} from "@fortawesome/free-solid-svg-icons";

function Note(props) {
  let { note , active, nextAutoPlayIndex} = props,
    { subjectName, categoryName } = useParams(),
    [imageSrc, setImageSrc] = useState(),
    [mediaRecorder, setMediaRecorder] = useState(),
    [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [finishedPlayingAudio, setFinishedPlayingAudio] = useState(),
    [displayForm, setDisplayForm] = useState(false),
    { categoryNotes, getCategoryNotes } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {
    setDisplayForm(false);
  }, [categoryNotes]);


// for Note Image
  useEffect(() => {
    console.log(imageSrc);
    if(note.image) getImage();
  }, []);

  // for active prop
    useEffect(() => {
      if (active) playAudio();
    }, [active]);



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


  function playAudio() {
    if (note && note.audioNote) {
      Storage.get(note.audioNote.replace('public/',''))
        .then(res => {
          console.log("play audio res");
          let a = new Audio(res)
          console.log(a);
          a.play();
          a.addEventListener("ended", function(){
            setTimeout(()=>{
              nextAutoPlayIndex();
            },1500)
             console.log("ended");
             a.removeEventListener("ended",()=>{})
          });
        })
        .catch(err => {
          console.log(err);
        });
    } else {
      if(active) {
        setTimeout(()=>{
          nextAutoPlayIndex();
        },1500)
      } else {
        alert('no Audio Note');
      }

    }

  }

  return (
    <div className="note">
      <span className="delete-note" onClick={() => deleteNote(note)}>
        X
      </span>
      {displayForm && <NoteForm {...{ note }} />}
      {!displayForm && (
        <div className="note-detail">

          {note.audioNote && (
            <button onClick={() => playAudio()}>
              <FontAwesomeIcon icon={faPlay} />
            </button>
          )}
          {note.image && (
            <img src={imageSrc} />
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
