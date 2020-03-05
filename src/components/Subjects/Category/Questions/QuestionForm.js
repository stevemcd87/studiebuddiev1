import React, { useState, useEffect, useContext, useRef } from "react";

import { useParams } from "react-router-dom";
// import "./NoteForm.css";
import ApiContext from "../../../../contexts/ApiContext";
import CategoryContext from "../../../../contexts/CategoryContext";

export default function QuestionForm(props) {
  let { subjectName, categoryName } = useParams(),
    { questionObject } = props,
    imageInput = useRef(null),
    [imageSrc, setImageSrc] = useState(),
    [imageFile, setImageFile] = useState(),
    [imageUpdated, setImageUpdated] = useState(false),
    [question, setQuestion] = useState(questionObject ? questionObject.question : ""),
    [answerOptions, setAnswerOptions] = useState([]),
    answerOptionsRef = useRef(null),
    { getCategoryQuestions } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);


useEffect(() => {
  if(questionObject && questionObject.image) getImage();
}, []);
  // for answerOptions if updating questionObject
  useEffect(() => {
    if (questionObject && questionObject.answerOptions) {
      let ao = [];
      questionObject.answerOptions.forEach(q => {
        let key = ao[0] ? ao[ao.length - 1].key + 1 : 0;
        ao.push(<AnswerOptionsInput questionObject={q} {...{ key }} />);
      });
      setAnswerOptions(ao);
    }
  }, []);

  useEffect(() => {
    if (imageFile) {
      let imageUrl = URL.createObjectURL(imageFile);
      setImageSrc(imageUrl);
    }
  }, [imageFile]);

  useEffect(() => {
    if (imageSrc)  setImageUpdated(true);
  }, [imageSrc]);




//
  function getImage(){
    console.log('get Image question');
    // Storage.get(questionObject.image.replace('public/',''))
    //   .then(res => {
    //     console.log("image res");
    //     console.log(res);
    //     setImageSrc(res);
    //   })
    //   .catch(err => {
    //     console.log(err);
    //   });
  }

  return (
    <div className="question-form">
      <input
        type="file"
        onChange={e => setImageFile(e.target.files["0"])}
        ref={imageInput}
      />
      {imageSrc && <img src={imageSrc} />}
      <input
        className="question-input"
        type="text"
        defaultValue={question}
        onChange={e => setQuestion(e.target.value)}
        placeholder="Question"
      />
      <div className="note-array" ref={answerOptionsRef}>
        {answerOptions.map(questionInputComponent => questionInputComponent)}
      </div>
      <button type="button" onClick={addAnswerOptionInput}>
        Add Answer Option
      </button>
      <button type="button" onClick={prepQuestion}>
        {!questionObject ? "Post Question" : "Update Question"}
      </button>
    </div>
  );

  function prepQuestion() {
    console.log("prepQuestion");
    let questionValues = {
      username: user.user.username,
      question: question ? question.trim() : false,
      answerOptions: [],
      image: imageFile ? true : false
    };
    // adds pathName to questionVAlues if there is one
    if (questionObject) questionValues.pathName = question.pathName;

    if (questionObject && question.image && !imageUpdated)
      questionValues.image = question.image;

      // pushes all answerOptions into the questionValues.answerOptions
    [...answerOptionsRef.current.querySelectorAll(".question")].forEach(questionElement => {
      questionValues.answerOptions.push(questionElement.value);
    });
    !questionObject ? postQuestion(questionValues) : updateQuestion(questionValues);
  }

    function postQuestion(n) {
      API.post("StuddieBuddie", `/subjects/${subjectName}/${categoryName}/questions`, {
        body: JSON.stringify(n)
      })
        .then(response => {
          console.log("update question response");
          console.log(response);

          if(imageFile){
            Storage.put(
              `${subjectName}/${categoryName}/QuestionImage/${user.user.username}/${response.pathName}`,
              imageFile
            )
              .then(res => {
                console.log("storage PUT  complete RES");
                console.log(res);
                setTimeout(function() {
                  // getCategoryQuestions();
                }, 1500);
              })
              .catch(err => {
                console.log("err");
                console.log(err);
              });
          }

          if (!imageFile ){
           // getCategoryQuestions();
         }
        })
        .catch(error => {
          console.log("ERROR");
          console.log(error);
        });
    }

    function updateQuestion(q){
      console.log('updateQuestion');
    }
//
//   function updateNote(n) {
//     API.put(
//       "StuddieBuddie",
//       `/subjects/${subjectName}/${categoryName}/notes/${n.pathName}`,
//       {
//         body: JSON.stringify(n)
//       }
//     )
//       .then(response => {
//         console.log("update note response");
//         console.log(response);
//         // getCategoryNotes();
//         // if (audioBlob) {
//           if (audioBlob && audioNoteUpdated) {
//             Storage.put(
//               `${subjectName}/${categoryName}/AudioNotes/${user.user.username}/${n.pathName}`,
//               audioBlob
//             )
//               .then(res => {
//                 console.log("audio  complete RES");
//                 console.log(res);
//                 setTimeout(function() {
//                   getCategoryNotes();
//                 }, 1500);
//               })
//               .catch(err => {
//                 console.log("err");
//                 console.log(err);
//               });
//           }
//           // else if (!audioBlob && audioNoteUpdated && note.audioNote) {
//           //   console.log("audio");
//           //   Storage.remove(
//           //     `${subjectName}/${categoryName}/AudioNotes/${user.user.username}/${n.pathName}`
//           //   )
//           //     .then(res => {
//           //       console.log("storage del  complete RES");
//           //       console.log(res);
//           //       getCategoryNotes();
//           //     })
//           //     .catch(err => {
//           //       console.log("err");
//           //       console.log(err);
//           //     });
//           // }
//         // }
//         if(imageFile && imageUpdated){
//           console.log('image');
//           Storage.put(
//             `${subjectName}/${categoryName}/Image/${user.user.username}/${n.pathName}`,
//             imageFile
//           )
//             .then(res => {
//               console.log("storage PUT  complete RES");
//               console.log(res);
//               setTimeout(function() {
//                 getCategoryNotes();
//               }, 1500);
//             })
//             .catch(err => {
//               console.log("err");
//               console.log(err);
//             });
//         }
//          if (!imageFile && !audioBlob){
//           getCategoryNotes();
//         }
//       })
//       .catch(error => {
//         console.log(error.response);
//       });
//   }
//

//
  function addAnswerOptionInput() {
    // Assigns a 'key' value for Component
    let key = answerOptions[0] ? answerOptions[answerOptions.length - 1].key + 1 : 0;
    setAnswerOptions([...answerOptions, <AnswerOptionsInput {...{ key }} />]);
  }
} // End of component

function AnswerOptionsInput(props) {
  let { question } = props;
  return (
    <div>
      <textarea className="question" defaultValue={question ? question : ""} />
    </div>
  );
}
