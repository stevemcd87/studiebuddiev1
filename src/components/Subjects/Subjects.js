import React, { useState, useEffect } from "react";
import SubjectForm from "./SubjectForm";
function Subjects(props) {
  let { API } = props,
    [subjects, setSubjects] = useState([]),
    [showForm, setShowForm] = useState(false);
  console.log(props);
  useEffect(() => {
    getSubjects(API, setSubjects);
  }, [API]);
  return (
    <div>
      {subjects.map(s => {
        return (
          <p key={s.name + "" + s.category}>
            {s.name} - {s.category}
          </p>
        );
      })}
      <button type="button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Create Subject"}
      </button>
      {showForm && (
        <SubjectForm {...{ API, getSubjects, setSubjects, setShowForm }} />
      )}
    </div>
  );
}
function getSubjects(API, setSubjects) {
  console.log("get");
  API.get("StuddieBuddie", "/subjects", { response: true })
    .then(response => {
      console.log(response);
      setSubjects(response.data);
    })
    .catch(error => {
      console.log(error.response);
    });
}

export default Subjects;
