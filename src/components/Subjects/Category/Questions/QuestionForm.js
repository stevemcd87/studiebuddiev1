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
    [answerOptions, setAnswerOptions] = useState(questionObject ? questionObject.answerOptions : []),
    [answer, setAnswer] = useState(questionObject ? questionObject.answer : ""),
    answerOptionsRef = useRef(null),
    { getCategoryQuestions } = useContext(CategoryContext),
    { API, Storage, user } = useContext(ApiContext);


// get image for updates
useEffect(() => {
  if(questionObject && questionObject.image) getImage();
}, []);

  // get answerOptions for updates
  useEffect(() => {
    if (questionObject && questionObject.answerOptions) {
      let ao = [];
      questionObject.answerOptions.forEach(o => {
        let key = ao[0] ? ao[ao.length - 1].key + 1 : 0;
        ao.push(<AnswerOptionsInput answerOption={o} {...{ key }} />);
      });
      setAnswerOptions(ao);
    }
  }, []);


// when user uploads file
  useEffect(() => {
    if (imageFile) {
      let imageUrl = URL.createObjectURL(imageFile);
      setImageSrc(imageUrl);
      setImageUpdated(true)
    }
  }, [imageFile]);


  function getImage() {
    console.log('get Image question');
    Storage.get(questionObject.image.replace('public/',''))
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
      <input
        className="answer-input"
        type="text"
        defaultValue={answer}
        onChange={e => setAnswer(e.target.value)}
        placeholder="Answer"
      />
    <div className="question-array" ref={answerOptionsRef}>
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

  function formValidation (qv){
    if (
      qv.question.length < 1 ||
      qv.answer.length < 1 ||
      !answerOptionsValid()
    ) {
      return false
    } else {
      return true
    }
  }

  function answerOptionsValid(){
    return [...answerOptionsRef.current.querySelectorAll(".question")].every(questionElement => {
      return questionElement.value.trim().length > 0
    });
  }

  function prepQuestion() {
    console.log("prepQuestion");
    let questionValues = {
      username: user.user.username,
      question: question.trim(),
      answerOptions: [],
      image: imageFile ? true : false,
      answer: answer.trim()
    };
    // adds pathName to questionVAlues if there is one
    console.log('imageUpdated');
    console.log(imageUpdated);

    if (questionObject) questionValues.pathName = questionObject.pathName;
    if (questionObject && questionObject.image && !imageUpdated)
      questionValues.image = questionObject.image;
      console.log('questionValues');
      console.log(questionValues);
      // pushes all answerOptions into the questionValues.answerOptions
    [...answerOptionsRef.current.querySelectorAll(".question")].forEach(questionElement => {
      questionValues.answerOptions.push(questionElement.value.trim());
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
      API.put(
        "StuddieBuddie",
        `/subjects/${subjectName}/${categoryName}/questions/`,
        {
          body: JSON.stringify(q)
        }
      )
        .then(response => {
          console.log("update note response");
          console.log(response);
          if(imageFile && imageUpdated){
            console.log('image');
            Storage.put(
              `${subjectName}/${categoryName}/QuestionImage/${user.user.username}/${q.pathName}`,
              imageFile
            )
              .then(res => {
                console.log("storage PUT  complete RES");
                console.log(res);
                setTimeout(function() {
                  getCategoryQuestions();
                }, 1500);
              })
              .catch(err => {
                console.log("err");
                console.log(err);
              });
          }
           if (!imageFile){
            getCategoryQuestions();
          }
        })
        .catch(error => {
          console.log(error.response);
        });
    }
//
//   function updateNote(q) {

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
  let { answerOption } = props;
  return (
    <div>
      <textarea className="question" defaultValue={answerOption ? answerOption : ""} />
    </div>
  );
}
