import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import SubjectForm from "./SubjectForm";
function Subject(props) {
  let { subject, getSubjects, setSubjects, API } = props,
    [showUpdateForm, setShowUpdateForm] = useState(false);
  return (
    <div>
      <p>
        <span>
          <span
            onClick={() =>
              getSubjectCategory(API, subject.name, subject.category)
            }
          >
            <Link to={`subjects/${subject.name}/${subject.category}`}>
              {subject.name} - {subject.category}{" "}
            </Link>
          </span>
          <button
            type="button"
            onClick={() => setShowUpdateForm(!showUpdateForm)}
          >
            Update
          </button>
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
  console.log("get");
  API.del("StuddieBuddie", "/subjects", {
    body: JSON.stringify({ name: name, category: category })
  })
    .then(response => {
      console.log(response);
      getSubjects(API, setSubjects);
    })
    .catch(error => {
      console.log(error.response);
    });
}

function getSubjectCategory(API, name, category) {
  API.get("StuddieBuddie", `/subjects/${name}/${category}`, { response: true })
    .then(response => {
      console.log(response);
      // setSubjects(response.data);
    })
    .catch(error => {
      console.log(error.response);
    });
}
export default Subject;
