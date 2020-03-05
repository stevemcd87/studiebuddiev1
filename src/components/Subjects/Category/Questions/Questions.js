import React, { useState, useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";
import Question from "./Question";
// import Note from "./NoteForm";

export default function Questions(props) {
  let [questionIndex, setQuestionIndex] = useState(),
    { categoryQuestions } = useContext(CategoryContext);

  return (
    <div className="questions-component">
      <h2>Questions</h2>
      {categoryQuestions.map((question, ind) => {
        return (
          <Question
            key={question.pathName}
            question={question}
            active={questionIndex === ind ? true : false}
            nextQuestion={nextQuestion}
          />
        );
      })}
    </div>
  );

  function nextQuestion() {
    console.log("nextQuestion");
    if (questionIndex < categoryQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      console.log("finished");
    }
  }
}
