import React, { useState, useEffect, useContext } from "react";

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
    // console.log('subjectCategoryNotes');
    // console.log(subjectCategoryNotes);
  }, [subjectCategory]);

  useEffect(() => {
    console.log("subjectCategoryNotes");
    console.log(subjectCategoryNotes);
  }, [subjectCategoryNotes]);
  return (
    <div>
      {subjectCategoryNotes && (
        <div className="notes">
          {subjectCategoryNotes.map((note, ind) => {
            return (
              <div key={note.title + ind} className="note">
                <span className="delete-note" onClick={() => deleteNote(ind)}>
                  x
                </span>
                <p>{note.title}</p>
                {note.notes.map((n, i) => (
                  <p key={n + i}>{n}</p>
                ))}
              </div>
            );
          })}
        </div>
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
  function deleteNote(index) {
    console.log("deleteNote");
    API.del("StuddieBuddie", `/subjects/${name}/${category}/notes/${index}`, {})
      .then(response => {
        console.log("response");
        console.log(JSON.parse(response.errorMessage));
        setSubjectCategoryNotes(
          JSON.parse(response.errorMessage).data.Attributes.notes
        );
      })
      .catch(error => {
        console.log("error");
        console.log(error.response);
      });
  }
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
      console.log(error.response);
    });
}

export default SubjectCategory;
