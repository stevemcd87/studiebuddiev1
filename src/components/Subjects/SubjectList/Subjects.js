import React, { useState, useEffect, useContext } from "react";
import SubjectForm from "./SubjectForm";
import Subject from "./Subject";
import ApiContext from "../../../contexts/ApiContext";

function Subjects(props) {
  let { API } = useContext(ApiContext),
    [subjects, setSubjects] = useState([]),
    [showForm, setShowForm] = useState(false);

  console.log(props);
  useEffect(() => {
    getSubjects(API, setSubjects);
  }, []);
  return (
    <div>
      {subjects.map(s => {
        return (
          <Subject
            {...{
              key: s.name + s.category,
              subject: s,
              getSubjects,
              setSubjects
            }}
          />
        );
      })}
      <button type="button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Create Subject"}
      </button>
      {showForm && <SubjectForm />}
    </div>
  );
} // end of component
function getSubjects(API, setSubjects) {
  console.log("GET subjects");
  API.get("StuddieBuddie", "/subjects", { response: true })
    .then(response => {
      console.log(response);
      // setSubjects(response.data);
    })
    .catch(error => {
      console.log(error);
    });
}

export default Subjects;
