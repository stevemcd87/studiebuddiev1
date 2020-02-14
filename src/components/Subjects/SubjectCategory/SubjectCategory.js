import React, { useState, useEffect } from "react";
import ApiContext from "../../../contexts/ApiContext";

function SubjectCategory() {
  useEffect(() => {
    console.log("subjectCategory");
  }, []);
  return <p>SubjectCategory</p>;
}
function getSubjectCategory(API, name, category) {
  console.log("getSubjectCategory");
  API.get("StuddieBuddie", `/subjects/${name}/${category}`, { response: true })
    .then(response => {
      console.log(response);
      // setSubjects(response.data);
    })
    .catch(error => {
      console.log(error.response);
    });
}

export default SubjectCategory;
