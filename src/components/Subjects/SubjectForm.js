import React, { useState, useEffect } from "react";

function SubjectForm(props) {
  let { API, getSubjects, setSubjects, setShowForm, subject } = props,
    nameValue = subject ? subject.name : "",
    categoryValue = subject ? subject.category : "",
    [name, setName] = useState(nameValue),
    [category, setCategory] = useState(categoryValue);
  useEffect(() => {
    console.log(name + " - " + category);
  }, [category, name]);
  return (
    <div>
      <h3>Create Subject</h3>
      <form id="subject-form">
        <input
          type="text"
          onChange={e => setName(e.target.value)}
          defaultValue={name}
        />
        <input
          type="text"
          onChange={e => setCategory(e.target.value)}
          defaultValue={category}
        />
        <button type="button" onClick={submitForm}>
          submitForm
        </button>
      </form>
    </div>
  );
  function submitForm() {
    if (!subject) {
      API.post("StuddieBuddie", "/subjects", {
        body: JSON.stringify({ name: name, category: category })
      })
        .then(response => {
          console.log(response);
          getSubjects(API, setSubjects);
          setShowForm(false);
        })
        .catch(error => {
          console.log(error.response);
        });
    } else {
      API.put("StuddieBuddie", "/subjects", {
        body: JSON.stringify({
          name: nameValue,
          category: category,
          newName: name,
          newCategory: category
        })
      })
        .then(response => {
          console.log(response);
          getSubjects(API, setSubjects);
          setShowForm(false);
        })
        .catch(error => {
          console.log(error.response);
        });
    }
  }
}

export default SubjectForm;
