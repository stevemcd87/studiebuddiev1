import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import ApiContext from "../../../contexts/ApiContext";
import SubjectContext from "../../../contexts/SubjectContext";
import CategoryForm from "./CategoryForm";
import { Link } from "react-router-dom";

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

  useEffect(() => {
    console.log(subject);
    setDisplayCategoryForm(false);
  }, [subject]);
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
            <div key={category.pathName} className="category">
              <p>
                <Link to={`/subjects/${subject.pathName}/${category.urlName}`}>
                  {category.name}
                </Link>
                - {category.desc}
                <button type="button" onClick={() => deleteCategory(category)}>
                  Delete
                </button>
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
      {displayCategoryForm && <CategoryForm {...{ subject, getSubject }} />}
    </div>
  );

  function deleteCategory(c) {
    console.log("deleteCategory");
    API.del("StuddieBuddie", `/subjects/${subject.pathName}`, {
      body: JSON.stringify({
        username: user.user.username,
        pathName: c.pathName
      })
    })
      .then(response => {
        console.log("response");
        console.log(response);
        getSubject();
      })
      .catch(error => {
        console.error(error.response);
      });
  }

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
          let urlName = v.pathName.split("#")[1].split("_")[1];
          return {
            name: urlName.replace("-", " "),
            desc: v.categoryDesc,
            pathName: v.pathName,
            urlName: urlName
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
