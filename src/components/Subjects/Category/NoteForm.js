import React, { useState, useEffect, useContext, useRef } from "react";
import AudioNote from "./AudioNote";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import CategoryContext from "../../../contexts/CategoryContext";

function NoteForm(props) {
  let { subjectName, categoryName } = useParams(),
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
    if (note && note.subnotes) {
      let sn = [];
      note.subnotes.forEach(v => {
        let key = sn[0] ? sn[sn.length - 1].key + 1 : 0;
        sn.push(<NoteInput note={v} {...{ key }} />);
      });
      setSubnotes(sn);
    }
  }, []);

  useEffect(() => {
    console.log(imageFile);
    // imageBlob = new Blob(imageFile),
    if (imageFile) {
      let imageUrl = URL.createObjectURL(imageFile);
      //   console.log('imageBlob');
      //   console.log(imageBlob);
      setImageUpdated(true);
      setImageSrc(imageUrl);
      console.log("imageUrl");
      console.log(imageUrl);
    }
  }, [imageFile]);

  useEffect(() => {
    console.log(imageSrc);
    if(note && note.image) getImage();

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


  return (
    <div className="note-form">
      <AudioNote {...{ note, audioBlob, setAudioBlob, setAudioNoteUpdated }} />
      <input
        type="file"
        onChange={e => setImageFile(e.target.files["0"])}
        ref={imageInput}
      />
      {imageSrc && <img src={imageSrc} />}
      <input
        className="note-mainNote"
        type="text"
        defaultValue={mainNote}
        onChange={e => setMainNote(e.target.value)}
        placeholder="Main Note"
      />
      <div className="note-array" ref={noteArray}>
        {subnotes.map(noteInputComponent => noteInputComponent)}
      </div>
      <button type="button" onClick={addNoteInput}>
        Add Subnote
      </button>
      <button type="button" onClick={prepNote}>
        {!note ? "Post Note" : "Update Note"}
      </button>
    </div>
  );

  function prepNote() {
    console.log("prepNote");
    let noteValues = {
      username: user.user.username,
      mainNote: mainNote ? mainNote.trim() : false,
      subnotes: [],
      audioNote: audioBlob ? true : false,
      image: imageFile ? true : false
    };
    if (note) noteValues.pathName = note.pathName;
    if (note && note.audioNote && !audioNoteUpdated)
      noteValues.audioNote = note.audioNote;

    if (note && note.image && !imageUpdated)
      noteValues.image = note.image;
    // for subNotes
    console.log("noteValues");
    console.log(noteValues);
    [...noteArray.current.querySelectorAll(".note")].forEach(noteElement => {
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
        console.log("update note response");
        console.log(response);
        // getCategoryNotes();
        // if (audioBlob) {
          if (audioBlob && audioNoteUpdated) {
            Storage.put(
              `${subjectName}/${categoryName}/AudioNotes/${user.user.username}/${n.pathName}`,
              audioBlob
            )
              .then(res => {
                console.log("audio  complete RES");
                console.log(res);
                setTimeout(function() {
                  getCategoryNotes();
                }, 1500);
              })
              .catch(err => {
                console.log("err");
                console.log(err);
              });
          }
          // else if (!audioBlob && audioNoteUpdated && note.audioNote) {
          //   console.log("audio");
          //   Storage.remove(
          //     `${subjectName}/${categoryName}/AudioNotes/${user.user.username}/${n.pathName}`
          //   )
          //     .then(res => {
          //       console.log("storage del  complete RES");
          //       console.log(res);
          //       getCategoryNotes();
          //     })
          //     .catch(err => {
          //       console.log("err");
          //       console.log(err);
          //     });
          // }
        // }
        if(imageFile && imageUpdated){
          console.log('image');
          Storage.put(
            `${subjectName}/${categoryName}/Image/${user.user.username}/${n.pathName}`,
            imageFile
          )
            .then(res => {
              console.log("storage PUT  complete RES");
              console.log(res);
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }
         if (!imageFile && !audioBlob){
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
        console.log("update note response");
        console.log(response);
        if (audioBlob) {
          Storage.put(
            `${subjectName}/${categoryName}/AudioNotes/${user.user.username}/${response.pathName}`,
            audioBlob
          )
            .then(res => {
              console.log("storage PUT  complete RES");
              console.log(res);
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if(imageFile){
          Storage.put(
            `${subjectName}/${categoryName}/Image/${user.user.username}/${response.pathName}`,
            imageFile
          )
            .then(res => {
              console.log("storage PUT  complete RES");
              console.log(res);
              setTimeout(function() {
                getCategoryNotes();
              }, 1500);
            })
            .catch(err => {
              console.log("err");
              console.log(err);
            });
        }

        if (!imageFile && !audioBlob){
         getCategoryNotes();
       }
      })
      .catch(error => {
        console.log("ERROR");
        console.log(error);
      });
  }

  function addNoteInput() {
    // Assigns a 'key' value for Component
    let key = subnotes[0] ? subnotes[subnotes.length - 1].key + 1 : 0;
    setSubnotes([...subnotes, <NoteInput {...{ key }} />]);
  }
} // End of component
function NoteInput(props) {
  let { note } = props;
  return (
    <div>
      <textarea className="note" defaultValue={note ? note : ""} />
    </div>
  );
}
// function displayNotes(subnotesArray, setSubnotes) {
//   setSubnotes(subnotesArray.map((n, i) => <NoteInput key={i} note={n} />));
// }

export default NoteForm;
