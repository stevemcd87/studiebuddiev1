import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";

function SubjectForm(props) {
  let { API, user } = useContext(ApiContext),
    { getSubjects } = useContext(SubjectContext),
    { subject } = props,
    nameValue = subject ? subject.navName : "",
    descValue = subject ? subject.subjectDesc : "",
    [name, setName] = useState(nameValue),
    [desc, setDesc] = useState(descValue);
  return (
    <div>
      <h3>Create Subject</h3>
      <form id="subject-form">
        <label>
          Name
          <input
            type="text"
            onChange={e => setName(e.target.value)}
            value={name}
            disabled={true}
          />
        </label>
        <label>
          Description
          <input
            type="text"
            onChange={e => setDesc(e.target.value)}
            defaultValue={desc}
          />
        </label>
        <button type="button" onClick={!subject ? submitForm : updateForm}>
          {!subject ? "submitForm" : "updateForm"}
        </button>
      </form>
    </div>
  );
  function submitForm() {
    API.post("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        subjectName: name.trim(),
        subjectDesc: desc.trim(),
        username: user.user.username
      })
    })
      .then(response => {
        console.log(response);
        getSubjects();
      })
      .catch(error => {
        console.log(error.response);
      });
  }

  function updateForm() {
    API.put("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        username: user.user.username,
        pathName: subject.pathName,
        subjectDesc: desc
      })
    })
      .then(response => {
        console.log(response);
        getSubjects();
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

export default SubjectForm;
