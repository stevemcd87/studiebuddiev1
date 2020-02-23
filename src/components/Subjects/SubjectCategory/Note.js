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
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      console.log("stream");
      console.log(stream);
      const mr = new MediaRecorder(stream);
      console.log("mediaRecorder");
      console.log(mr);
      setMediaRecorder(mr);
      console.log();

      return function cleanup() {
        mediaRecorder.removeEventListener("dataavailable", () => {});
        mediaRecorder.removeEventListener("stop", () => {});
        // ChatAPI.unsubscribeFromFriendStatus(props.friend.id, handleStatusChange);
      };
    });
  }, []);
  useEffect(() => {
    setDisplayEdit(false);
  }, [subjectCategoryNotes]);

  useEffect(() => {
    if (audioBlob) {
      console.log(URL);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(new Audio(audioUrl));
    }

  }, [audioBlob]);



  useEffect(() => {
    console.log(mediaRecorder);
  }, [mediaRecorder]);

  function startRecord() {
    mediaRecorder.start();
    let audioChunks = [];
    mediaRecorder.addEventListener("dataavailable", event => {
      console.log(event);
      audioChunks.push(event.data);
    });

    mediaRecorder.addEventListener("stop", () => {
      setAudioBlob(new Blob(audioChunks));
    });
  }

  function playAudio() {
    audio.play();
  }

  function uploadFile(evt) {
    console.log("u");
    // let file = evt.target.files[0],
    //   name = file.name;
    Storage.put("name.data", audioBlob)
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
      });
  }

function getData(){
  Storage.get("name.data")
    .then(res =>{ console.log('res'); console.log(res);
    // setAudioBlob(res);
    new Audio(res).play()
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
    <button onClick={getData}>get</button>
      <button onClick={startRecord}>start</button>
      <button onClick={() => mediaRecorder.stop()}>stop</button>
      {audio && <button onClick={playAudio}>Play</button>}
      <button onClick={uploadFile}> Save</button>

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
