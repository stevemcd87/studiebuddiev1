import React from "react";

const ApiContext = React.createContext({
  API: {},
  Storage: {}
  // addToApi: () => {},
  // removeFromApi: () => {},
  // clearApi: () => {},
  // cartTotal: 0
});

export default ApiContext;
