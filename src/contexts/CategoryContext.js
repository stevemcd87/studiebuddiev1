import React from "react";

const CategoryContext = React.createContext({
  categoryNotes: [],
  getCategortNotes: () => {}
});

export default CategoryContext;
