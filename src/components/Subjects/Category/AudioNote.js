import React, { useState, useEffect, useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faRecordVinyl,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
export default function AudioNote(props) {
  let {audioBlob, setAudioBlob, setAudioNoteUpdated, note } = props,
    [mediaRecorder, setMediaRecorder] = useState(),
    // [audioBlob, setAudioBlob] = useState(),
    [audio, setAudio] = useState(),
    [recording, setRecording] = useState(false),
    { Storage } = useContext(ApiContext);
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
        {note && note.audioNote && (
          <button onClick={() => playAudio(note.audioNote)}>
            Play Audio Note
          </button>
        )}
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

  function startRecord() {
    setRecording(true);
    setAudioNoteUpdated(true);
  }

  // function playAudio() {
  //   audio.play();
  // }
} // end of component
