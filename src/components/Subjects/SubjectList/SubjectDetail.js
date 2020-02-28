import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
function SubjectDetail() {
  let { name } = useParams(),
    { API, user } = useContext(ApiContext),
    [subject, setSubject] = useState();
  // { subject } = useContext(SubjectContext);
  useEffect(() => {
    getSubject();
  }, []);
  return (
    <div className="subject-detail">
      {subject && (
        <>
          <p>Creator: {subject.username}</p>
          <p>{subject.name}</p>
          <p>{subject.desc}</p>
          <button type="button" onClick={createCategory}>
            Create Category
          </button>
        </>
      )}
    </div>
  );
  function getSubject() {
    console.log("GET subject");
    API.get("StuddieBuddie", `/subjects/${name}`)
      .then(response => {
        console.log("res");
        console.log(response);
        setSubject(response[0]);
        // return response.data[0];
      })
      .catch(error => {
        console.log("er");
        console.log(error);
      });
  }

  function createCategory() {
    console.log("create category");
  }
}

export default SubjectDetail;
