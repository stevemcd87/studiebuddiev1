import React, { useState, useEffect, useContext } from "react";
import Notes from "./Notes";
import { useParams } from "react-router-dom";

import ApiContext from "../../../contexts/ApiContext";
import NoteForm from "./NoteForm";

function SubjectCategory() {
  let { name, category } = useParams(),
    [subjectCategory, setSubjectCategory] = useState({}),
    [subjectCategoryNotes, setSubjectCategoryNotes] = useState([]),
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    { API } = useContext(ApiContext);
  useEffect(() => {
    console.log("API, category, name");

    // console.log(name + "/" + category);
    getSubjectCategory(
      API,
      setSubjectCategory,
      name,
      category,
      setSubjectCategoryNotes
    );
  }, [API, category, name]);

  useEffect(() => {
    console.log("subjectCategory");
    console.log(subjectCategory);
    setSubjectCategoryNotes(subjectCategory.notes);
  }, [subjectCategory]);

  return (
    <div>
      {subjectCategoryNotes && (
        <Notes {...{ subjectCategoryNotes, setSubjectCategoryNotes }} />
      )}
      <button
        type="button "
        onClick={() => setDisplayNoteForm(!displayNoteForm)}
      >
        Create Note
      </button>
      {displayNoteForm && (
        <NoteForm {...{ subjectCategory, setSubjectCategoryNotes }} />
      )}
      <p>SubjectCategory</p>
    </div>
  );
}

function getSubjectCategory(API, setSubjectCategory, name, category) {
  console.log("GET Subjectcategory");
  API.get("StuddieBuddie", `/subjects/${name}/${category}`, { response: true })
    .then(response => {
      console.log("GET SubjectCategory response");
      console.log(response);
      setSubjectCategory(response.data.data.Item);
    })
    .catch(error => {
      console.log(error);
    });
}

export default SubjectCategory;
