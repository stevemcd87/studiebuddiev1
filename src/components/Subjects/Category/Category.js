import React, { useState, useEffect, useContext } from "react";
import Notes from "./Notes";
import { useParams } from "react-router-dom";

import ApiContext from "../../../contexts/ApiContext";
import NoteForm from "./NoteForm";

export default function Category() {
  let { subjectName, categoryName } = useParams(),
    [category, setCategory] = useState({}),
    [categoryNotes, setCategoryNotes] = useState([]),
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    { API, user } = useContext(ApiContext);
  useEffect(() => {
    getCategory();
  }, []);

  useEffect(() => {
    console.log("category");
    console.log(category);
    // setCategoryNotes(category.notes);
  }, [category]);

  // {categoryNotes && (
  // //  <Notes {...{ categoryNotes, setCategoryNotes }} />
  // )}

  return (
    <div>
      <h2>{categoryName.replace("-", " ")}</h2>
      <button
        type="button "
        onClick={() => setDisplayNoteForm(!displayNoteForm)}
      >
        Create Note
      </button>
      {!displayNoteForm && <NoteForm {...{ category }} />}
    </div>
  );
  function getCategory() {
    console.log("GET Subjectcategory");
    API.get("StuddieBuddie", `/subjects/${subjectName}/${categoryName}`, {
      queryStringParameters: {
        username: user.user.username
      }
    })
      .then(response => {
        console.log("GET Category response");
        console.log(response);
        // setCategory(response.data.data.Item);
      })
      .catch(error => {
        console.error(error);
      });
  }
} // end of component
