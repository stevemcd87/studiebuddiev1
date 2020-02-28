import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";

function SubjectForm(props) {
  let { API, user } = useContext(ApiContext),
    { getSubjects } = useContext(SubjectContext),
    { subject } = props,
    nameValue = subject ? subject.name : "",
    descValue = subject ? subject.desc : "",
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
            defaultValue={name}
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
        name: name.trim().replace(" ", "-"),
        desc: desc.trim().replace(" ", "-"),
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
        pk: subject.pk,
        sk: subject.sk,
        name: name,
        desc: desc,
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
}

export default SubjectForm;
