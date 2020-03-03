import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faRecordVinyl,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
export default function AudioNote(props) {
  let {audioBlob, setAudioBlob,note} = props,
    [mediaRecorder, setMediaRecorder] = useState(),
    // [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [recording, setRecording] = useState(false);
  // for Audio Note componentDidMount
  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true }).then(stream => {
      const mr = new MediaRecorder(stream);
      setMediaRecorder(mr);
      return function cleanup() {
        mediaRecorder.removeEventListener("dataavailable", () => {});
        mediaRecorder.removeEventListener("stop", () => {});
      };
    });

  }, []);

  useEffect(() => {
    if (audioBlob) {
      console.log(URL);
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudio(new Audio(audioUrl));
    } else {
      setAudio(null);
    }
  }, [audioBlob]);

  useEffect(() => {
    if (recording) {
      mediaRecorder.start();
      let audioChunks = [];
      mediaRecorder.addEventListener("dataavailable", event => {
        console.log(event);
        audioChunks.push(event.data);
      });

      mediaRecorder.addEventListener("stop", () => {
        setAudioBlob(new Blob(audioChunks));
      });
      console.log("recording");
    }
  }, [recording]);

  return (
    <div className="audio-note-component">
      <h3>Audio Note</h3>
      {note && note.audioNoteKey && <button onClick={getData}></button>}
      <button disabled={recording} onClick={startRecord}>
        <FontAwesomeIcon icon={faRecordVinyl} />
      </button>
      <button
        disabled={!recording}
        onClick={() => {
          mediaRecorder.stop();
          setRecording(false);
        }}
      >
        <FontAwesomeIcon icon={faStop} />
      </button>

      <button
        className="play-audio-button"
        onClick={playAudio}
        disabled={!audio}
      >
        <FontAwesomeIcon icon={faPlay} />
      </button>
      <button
        className="delete-audio-button"
        onClick={() => setAudioBlob(null)}
        disabled={!audio}
      >
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );

  function getData() {
    Storage.get(note.audioNoteKey)
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

  function startRecord() {
    setRecording(true);
  }

  function playAudio() {
    audio.play();
  }
} // end of component
