import React, { useState, useEffect, useContext } from "react";
import CategoryContext from "../../../../contexts/CategoryContext";
import Question from "./Question";
import QuestionForm from "./QuestionForm";

import "./Questions.css";

export default function Questions(props) {
  let [questionIndex, setQuestionIndex] = useState(),
      [displayForm, setDisplayForm] = useState(false),
    { categoryQuestions, getCategoryQuestions } = useContext(CategoryContext);

useEffect(()=>{
  // if (categoryQuestions.length === 0) getCategoryQuestions();
},[])

useEffect(()=>{
  console.log(categoryQuestions);
},[categoryQuestions])

  return (
    <div className="questions-component">
      <h2>Questions</h2>
      {!displayForm && (
        <button
          type="button "
          onClick={() => setDisplayForm(!displayForm)}
        >
          Create Question
        </button>
      )}

       {displayForm && <QuestionForm />}

      <div>
        {categoryQuestions.map((question, ind) => {
          return (
            <Question
              key={question.pathName}
              question={question}
              nextQuestion={nextQuestion}
            />
          );
        })}
      </div>
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
