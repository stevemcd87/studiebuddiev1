import React, { useEffect } from "react";
import Subjects from "./SubjectList/Subjects";
import SubjectCategory from "./SubjectCategory/SubjectCategory";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

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
          <Route exact path="/">
            <Subjects />
          </Route>
          <Route path="/subjects/:subjectName/:subjectCategory">
            <SubjectCategory />
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
