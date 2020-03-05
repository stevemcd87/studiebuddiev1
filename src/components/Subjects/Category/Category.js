import React, { useState, useEffect, useContext } from "react";
import Notes from "./Notes";
import CategoryContext from "../../../contexts/CategoryContext";
import ApiContext from "../../../contexts/ApiContext";
import NoteForm from "./NoteForm";
import Questions from "./Questions/Questions";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useParams,
  useRouteMatch
} from "react-router-dom";

export default function Category() {
  let { path, url } = useRouteMatch(),
    { subjectName, categoryName } = useParams(),
    [categoryNotes, setCategoryNotes] = useState([]),
    [displayNoteForm, setDisplayNoteForm] = useState(false),
    { API, user } = useContext(ApiContext);
  useEffect(() => {
    getCategoryNotes();
  }, []);

  useEffect(() => {
    console.log("category");
    console.log(categoryNotes);
    setDisplayNoteForm(false);
    // setCategoryNotes(categoryNotes.notes);
  }, [categoryNotes]);


  return (
    <div>
      <h2>{categoryName.replace("-", " ")}</h2>
      <ul>
        <li>
          <Link to={`${url}`}>Review Notes</Link>
        </li>
        <li>
          <Link to={`${url}/test`}>Test</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path={path}>
          <CategoryContext.Provider value={{ categoryNotes, getCategoryNotes }}>
            <Notes />
          </CategoryContext.Provider>
          <button
            type="button "
            onClick={() => setDisplayNoteForm(!displayNoteForm)}
          >
            Create Note
          </button>
          {!displayNoteForm && (
            <CategoryContext.Provider value={{ getCategoryNotes }}>
              <NoteForm {...{getCategoryNotes}}/>
            </CategoryContext.Provider>

          )}
        </Route>
        <Route path={`${path}/test`}>
          <CategoryContext.Provider value={{ getCategoryNotes }}>
            <Questions />
          </CategoryContext.Provider>
        </Route>
      </Switch>
    </div>
  );
  function getCategoryNotes() {
    console.log("GET Subjectcategory");
    API.get("StuddieBuddie", `/subjects/${subjectName}/${categoryName}`, {
      queryStringParameters: {
        username: user.user.username
      }
    })
      .then(response => {
        console.log("GET Category response");
        console.log(response);
        setCategoryNotes(response);
      })
      .catch(error => {
        console.error(error);
      });
  }
} // end of component
