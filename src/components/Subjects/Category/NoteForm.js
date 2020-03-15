import React, { useState, useEffect, useContext, useRef } from "react";
import AudioNote from "./AudioNote";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faTrash } from "@fortawesome/free-solid-svg-icons";
function NoteForm(props) {
  let { subjectName, categoryName, username } = useParams(),
    { note } = props,
    imageInput = useRef(null),
    [imageSrc, setImageSrc] = useState(),
    [imageFile, setImageFile] = useState(),
    [imageUpdated, setImageUpdated] = useState(false),
    [mainNote, setMainNote] = useState(note ? note.mainNote : ""),
    [audioBlob, setAudioBlob] = useState(),
    [audioNoteUpdated, setAudioNoteUpdated] = useState(false),
    [subnotes, setSubnotes] = useState([]),
    noteArray = useRef(null),
    { getCategoryNotes } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);

  useEffect(() => {
    console.log("image file");
    console.log(imageFile);
  }, [imageFile]);

  useEffect(() => {
    console.log("imageUpdated");
    console.log(imageUpdated);
  }, [imageUpdated]);

  // for SubNotes if updating note
  useEffect(() => {
    if (note && note.subnotes) {setSubnotes(note.subnotes);
    }
  }, []);

  useEffect(() => {
    console.log(imageFile);
    // imageBlob = new Blob(imageFile),
    if (imageFile) {
      let imageUrl = URL.createObjectURL(imageFile);
      setImageUpdated(true);
      setImageSrc(imageUrl);
      console.log("imageUrl");
      console.log(imageUrl);
    }
  }, [imageFile]);

  useEffect(() => {
    console.log(imageSrc);
    if (note && note.image) getImage();
  }, []);

  function getImage() {
    Storage.get(note.image.replace("public/", ""))
      .then(res => {
        console.log("image res");
        console.log(res);
        setImageSrc(res);
      })
      .catch(err => {
        console.log(err);
      });
  }

  return (
    <div className="note-form-component">
      <form>
        <AudioNote
          {...{ note, audioBlob, setAudioBlob, setAudioNoteUpdated }}
        />
        <div className="image-input">
          <input
            type="file"
            onChange={e => setImageFile(e.target.files["0"])}
            ref={imageInput}
          />
          {imageSrc && <img src={imageSrc} />}
        </div>
        <textarea
          className="note-mainNote form-textarea"
          defaultValue={mainNote}
          onChange={e => setMainNote(e.target.value)}
          placeholder="Title of Note or Note"
        />
      <div className="sub-note-array" ref={noteArray}>
          {subnotes.map(sn => <Subnote subnote={sn}/>)}
        </div>
        <button type="button" onClick={addSubnote}>
          Add Subnote
        </button>
        <button type="button" onClick={prepNote}>
          {!note ? "Post Note" : "Update Note"}
        </button>
      </form>
    </div>
  );

  function checkForUsername(){
    return user && user.username === username ? true : false;
  }

  function prepNote() {
    console.log("prepNote");
    let noteValues = {
      username: user.username,
      mainNote: mainNote ? mainNote.trim() : false,
      subnotes: [],
      audioNote: audioBlob ? true: false,
      image: imageFile ? true : false
    };
    if (note) noteValues.pathName = note.pathName;
    if (note && note.audioNote && !audioNoteUpdated)
      noteValues.audioNote = note.audioNote;

    if (note && note.image && !imageUpdated) noteValues.image = note.image;
    // for subNotes
    console.log("noteValues");
    console.log(noteValues);
    [...noteArray.current.querySelectorAll(".subnote")].forEach(noteElement => {
      noteValues.subnotes.push(noteElement.value);
    });
    console.log(note);
    !note ? postNote(noteValues) : updateNote(noteValues);
  }

  function updateNote(n) {
    API.put(
      "StuddieBuddie",
      `/subjects/${subjectName}/${categoryName}/notes/${n.pathName}`,
      {
        body: JSON.stringify(n)
      }
    )
      .then(response => {
        if (audioBlob && audioNoteUpdated) {
          Storage.put(
            `${subjectName}/${categoryName}/AudioNotes/${user.username}/${n.pathName}`,
            audioBlob
          )
            .then(res => {
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }
        if (imageFile && imageUpdated) {
          Storage.put(
            `${subjectName}/${categoryName}/Image/${user.username}/${n.pathName}`,
            imageFile
          )
            .then(res => {
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }
        if (!imageFile && !audioBlob) {
          getCategoryNotes();
        }
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function postNote(n) {
    API.post("StuddieBuddie", `/subjects/${subjectName}/${categoryName}`, {
      body: JSON.stringify(n)
    })
      .then(response => {
        if (audioBlob) {
          Storage.put(
            response.audioNote,
            audioBlob
          )
            .then(res => {
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if (imageFile) {
          Storage.put(
            response.image,
            imageFile
          )
            .then(res => {
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if (!imageFile && !audioBlob) {
          getCategoryNotes();
        }
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }

  function addSubnote() {
    let sn = subnotes.slice();
    sn.push('')
    setSubnotes(sn);
  }
} // End of component
function Subnote(props) {
  let { subnote } = props;
  return (
    <div>
      <textarea className="subnote form-textarea" placeholder="Subnote" defaultValue={subnote ? subnote : ""} />
    </div>
  );
}
// function displayNotes(subnotesArray, setSubnotes) {
//   setSubnotes(subnotesArray.map((n, i) => <Subnote key={i} note={n} />));
// }

export default NoteForm;
