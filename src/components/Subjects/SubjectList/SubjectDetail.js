import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import CategoryForm from "./CategoryForm";

function SubjectDetail() {
  let { pathName } = useParams(),
    { API, user } = useContext(ApiContext),
    [subject, setSubject] = useState({}),
    [categories, setCategories] = useState([]),
    [displayCategoryForm, setDisplayCategoryForm] = useState(false);
  // { subject } = useContext(SubjectContext);
  useEffect(() => {
    getSubject();
  }, []);
  return (
    <div className="subject-detail-component">
      <div className="subject-detail">
        <p>Creator: {subject.username}</p>
        <p>{subject.navName}</p>
        <p>{subject.subjectDesc}</p>
      </div>
      <div>
        {categories.map(category => {
          return (
            <div key={category.desc} className="category">
              <p>
                {category.name} - {category.desc}
              </p>
            </div>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setDisplayCategoryForm(!displayCategoryForm)}
      >
        Create Category
      </button>
      {displayCategoryForm && <CategoryForm {...{ subject }} />}
    </div>
  );
  function getSubject() {
    console.log("GET subject");
    API.get("StuddieBuddie", `/subjects/${pathName}`, {
      queryStringParameters: {
        username: user.user.username
      }
    })
      .then(response => {
        console.log("res getSubject");
        console.log(response);
        setSubject(response[0]);
        let c = response.slice(1).map(v => {
          return {
            name: v.pathName
              .split("#")[1]
              .split("_")[0]
              .replace("-", " "),
            desc: v.categoryDesc
          };
        });
        console.log(c);
        setCategories(c);
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
