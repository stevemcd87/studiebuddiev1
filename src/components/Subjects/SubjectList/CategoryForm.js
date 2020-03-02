import React, { useState, useContext } from "react";
import ApiContext from "../../../contexts/ApiContext";

export default function CategoryForm(props) {
  let { subject, getSubject } = props,
    { API, user } = useContext(ApiContext),
    [categoryName, setCategoryName] = useState(""),
    [categoryDesc, setCategoryDesc] = useState("");
  return (
    <form>
      <input
        type="text"
        onChange={e => setCategoryName(e.target.value)}
        defaultValue={categoryName}
      />
      <input
        type="text"
        onChange={e => setCategoryDesc(e.target.value)}
        defaultValue={categoryDesc}
      />
      <button type="button" onClick={postCategory}>
        Create
      </button>
    </form>
  );
  function postCategory() {
    API.post("StuddieBuddie", `/subjects/${subject.pathName}`, {
      body: JSON.stringify({
        categoryName: categoryName.trim(),
        categoryDesc: categoryDesc.trim(),
        username: user.user.username
        // pathName: subject.pathName
      })
    })
      .then(response => {
        console.log("response postCategory");
        console.log(response);
        getSubject();
      })
      .catch(error => {
        console.log("err postCategory");
        console.log(error.response);
      });
  }
}
