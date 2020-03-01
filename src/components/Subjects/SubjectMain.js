import React, { useEffect } from "react";
import Subjects from "./SubjectList/Subjects";
import SubjectDetail from "./SubjectList/SubjectDetail";
import SubjectCategory from "./SubjectCategory/SubjectCategory";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function SubjectMain() {
  useEffect(() => {
    console.log("subjectMain");
  }, []);
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/subjects/:pathName/:category">
            <SubjectCategory />
          </Route>
          <Route path="/subjects/:pathName">
            <SubjectDetail />
          </Route>
          <Route exact path="/">
            <Subjects />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// <nav>
//   <ul>
//     <li>
//       <Link to="/">Home</Link>
//     </li>
//     <li>
//       <Link to="/about">About</Link>
//     </li>
//     <li>
//       <Link to="/users">Users</Link>
//     </li>
//   </ul>
// </nav>

export default SubjectMain;
