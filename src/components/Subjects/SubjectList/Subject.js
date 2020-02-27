import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";

import ApiContext from "../../../contexts/ApiContext";
import SubjectForm from "./SubjectForm";
function Subject(props) {
  let { API } = useContext(ApiContext),
    { subject, getSubjects, setSubjects } = props,
    [showUpdateForm, setShowUpdateForm] = useState(false);

  return (
    <div>
      <p>
        <span>
          <Link to={`subjects/${subject.name}/${subject.category}`}>
            {subject.name} - {subject.category}{" "}
          </Link>
        </span>
        <button
          type="button"
          onClick={() =>
            deleteSubject(API, getSubjects, setSubjects, {
              name: subject.name,
              category: subject.category
            })
          }
        >
          Delete
        </button>
      </p>
      {showUpdateForm && (
        <SubjectForm
          {...{
            API,
            getSubjects,
            setSubjects,
            setShowForm: setShowUpdateForm,
            subject
          }}
        />
      )}
    </div>
  );
}

function deleteSubject(API, getSubjects, setSubjects, subjectKey) {
  let { name, category } = subjectKey;
  console.log("deleteSubject");
  API.del("StuddieBuddie", "/subjects", {
    body: JSON.stringify({
      name: name,
      category: category
    })
  })
    .then(response => {
      console.log(response);
      getSubjects(API, setSubjects);
    })
    .catch(error => {
      console.log(error.response);
    });
}

export default Subject;
