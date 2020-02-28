import React, { useState, useEffect, useContext } from "react";
import SubjectForm from "./SubjectForm";
import Subject from "./Subject";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";

function Subjects(props) {
  let { API } = useContext(ApiContext),
    [subjects, setSubjects] = useState([]),
    [showForm, setShowForm] = useState(false);

  console.log(props);
  useEffect(() => {
    getSubjects();
  }, []);

  useEffect(() => {
    setShowForm(false);
  }, [subjects]);
  return (
    <div>
      {subjects.map(s => {
        return (
          <SubjectContext.Provider
            key={s.sk}
            value={{ subject: s, getSubjects }}
          >
            <Subject />
          </SubjectContext.Provider>
        );
      })}
      <button type="button" onClick={() => setShowForm(!showForm)}>
        {showForm ? "Hide Form" : "Create Subject"}
      </button>
      {showForm && (
        <SubjectContext.Provider value={{ getSubjects }}>
          <SubjectForm />
        </SubjectContext.Provider>
      )}
    </div>
  );
  function getSubjects() {
    console.log("GET subjects");
    API.get("StuddieBuddie", "/subjects", { response: true })
      .then(response => {
        console.log("res");
        console.log(response);
        setSubjects(response.data);
      })
      .catch(error => {
        console.log("er");
        console.log(error);
      });
  }
} // end of component

export default Subjects;
