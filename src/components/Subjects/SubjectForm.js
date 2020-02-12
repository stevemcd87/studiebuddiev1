import React, { useState, useEffect } from "react";

function SubjectForm(props) {
  let { API } = props,
    [name, setName] = useState(""),
    [category, setCategory] = useState("");
  console.log(props);
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
    API.post("StuddieBuddie", "/subjects", {
      body: JSON.stringify({ name: name, category: category })
    })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.log(error.response);
      });
  }
}

export default SubjectForm;
