import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowDown, faArrowUp } from "@fortawesome/free-solid-svg-icons";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import SubjectForm from "./SubjectForm";
function Subject(props) {
  let { API, user } = useContext(ApiContext),
    { subject, getSubjects } = useContext(SubjectContext),
    // { subject, getSubjects, setSubjects } = props,
    [displayUpdateForm, setDisplayUpdateForm] = useState(false),
    [displayDesc, setDisplayDesc] = useState(false);
  // <span>
  //   <Link to={`subjects/${subject.name}/${subject.category}`}>
  //     {subject.name} - {subject.category}{" "}
  //   </Link>
  // </span>
  useEffect(() => {
    setDisplayUpdateForm(false);
  }, [subject]);
  return (
    <div>
      <div>
        <p>
          {subject.name}
          <button type="button" onClick={() => setDisplayDesc(!displayDesc)}>
            {!displayDesc && <FontAwesomeIcon icon={faArrowDown} />}
            {displayDesc && <FontAwesomeIcon icon={faArrowUp} />}
          </button>
          <button
            type="button"
            onClick={() => setDisplayUpdateForm(!displayUpdateForm)}
          >
            Update
          </button>
          <button type="button" onClick={deleteSubject}>
            Delete
          </button>
        </p>
        {displayDesc && <p>{subject.desc}</p>}
      </div>
      {displayUpdateForm && <SubjectForm {...{ subject }} />}
    </div>
  );

  function deleteSubject() {
    console.log("deleteSubject");
    API.del("StuddieBuddie", "/subjects", {
      body: JSON.stringify({
        pk: subject.pk,
        sk: subject.sk
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
} // End of Component

export default Subject;
