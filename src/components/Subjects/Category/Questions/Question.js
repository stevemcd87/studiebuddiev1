import React, { useState, useEffect, useContext, useRef } from "react";
import QuestionForm from "./QuestionForm";
import { useParams } from "react-router-dom";
import ApiContext from "../../../../contexts/ApiContext";
import CategoryContext from "../../../../contexts/CategoryContext";


export default function Question(props) {
    let { question, nextQuestion } = props,
      { subjectName, categoryName } = useParams(),
      questionDiv = useRef(),
      [imageSrc, setImageSrc] = useState(),
      [displayForm, setDisplayForm] = useState(false),
      { categoryQuestions, getCategoryQuestions } = useContext(CategoryContext),
      { API, Storage, user } = useContext(ApiContext);


    useEffect(() => {
      setDisplayForm(false);
    }, [categoryQuestions]);

      // for Question Image
      useEffect(() => {
        if (question.image) getImage();
      }, []);



  return (
    <div className="questions-component">
          <span className="delete-question" onClick={() => deleteQuestion(question)}>
            X
          </span>
          {displayForm && <QuestionForm  questionObject={question} />}
          {!displayForm && (
            <div className="question-detail">
              {question.image && <img src={imageSrc} />}
              <p>{question.question}</p>
              {question.answerOptions.map((v, i) => <p key={v + i}>{v}</p>)}
              <span
                className="edit-question"
                onClick={() => setDisplayForm(!displayForm)}
              >
                Edit Question
              </span>
            </div>
          )}
    </div>
  );

    function getImage() {
      Storage.get(question.image.replace("public/", ""))
        .then(res => {
          console.log("image res");
          console.log(res);
          setImageSrc(res);
        })
        .catch(err => {
          console.log(err);
        });
    }

      function deleteQuestion(q) {
        console.log("deleteQuestion");
        API.del(
          "StuddieBuddie",
          `/subjects/${subjectName}/${categoryName}/questions/`,
          {
            body: JSON.stringify({
              username: user.user.username,
              pathName: q.pathName
            })
          }
        )
          .then(response => {
            console.log("delete note response");
            console.log(response);
            getCategoryQuestions();
          })
          .catch(error => {
            console.log(error.response);
          });
      }

}
