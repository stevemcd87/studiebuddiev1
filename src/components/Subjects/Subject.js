import React, { useState, useEffect } from "react";
import SubjectForm from "./SubjectForm";
function Subject(props) {
  let { subject, getSubjects, setSubjects, API } = props,
    [showUpdateForm, setShowUpdateForm] = useState(false);
  return (
    <div>
      <p>
        <span>
          <span>
            {subject.name} - {subject.category}
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
export default Subject;
