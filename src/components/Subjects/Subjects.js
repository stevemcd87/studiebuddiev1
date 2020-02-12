import React, { useState, useEffect } from "react";
import SubjectForm from "./SubjectForm";
function Subjects(props) {
  let { API } = props;
  console.log(props);
  useEffect(() => {});
  return (
    <div>
      <SubjectForm {...{ API }} />
    </div>
  );
}

export default Subjects;
