import React, { useState, useEffect, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";

function SubjectForm(props) {
  let { API, user } = useContext(ApiContext),
    { getSubjects, setSubjects, setShowForm, subject } = props,
    nameValue = subject ? subject.name : "",
    descValue = subject ? subject.category : "",
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
        <button type="button" onClick={submitForm}>
          submitForm
        </button>
      </form>
    </div>
  );
  function submitForm() {
    // if (!subject) {
    API.post("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        name: name.trim().replace(" ", "-"),
        desc: desc.trim().replace(" ", "-"),
        username: user.user.username
      })
    })
      .then(response => {
        console.log(response);
        // getSubjects(API, setSubjects);
        // setShowForm(false);
      })
      .catch(error => {
        console.log(error.response);
      });
    // }
    // else {
    //   API.put("StuddieBuddie", "/subjects", {
    //     body: JSON.stringify({
    //       name: nameValue,
    //       category: category,
    //       newName: name,
    //       newCategory: category
    //     })
    //   })
    //     .then(response => {
    //       console.log(response);
    //       getSubjects(API, setSubjects);
    //       setShowForm(false);
    //     })
    //     .catch(error => {
    //       console.log(error.response);
    //     });
    // }
  }
}

export default SubjectForm;
