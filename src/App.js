import React, { useState, useEffect } from "react";
import "./App.css";
import AmpConfig from "./Amplify/AmpConfig";
import SubjectMain from "./components/Subjects/SubjectMain";
import ApiContext from "./contexts/ApiContext";
import Amplify, { Auth, API } from "aws-amplify";
import { Authenticator } from "aws-amplify-react";

Amplify.configure(AmpConfig);

function App() {
  let [user, setUser] = useState(Auth);

  useEffect(() => {
    setUser(Auth);
  }, []);

  useEffect(() => {
    console.log(user);
    // Analytics.record("Amplify_CLI");
  }, [user]);
  return (
    <div className="App">
      <Authenticator>
        <ApiContext.Provider value={{ API }}>
          <SubjectMain />
        </ApiContext.Provider>
      </Authenticator>
    </div>
  );
}
// export default withAuthenticator(App, {
//   // Render a sign out button once logged in
//   includeGreetings: true
//   // // Show only certain components
//   // authenticatorComponents: [MyComponents],
//   // // display federation/social provider buttons
//   // federated: { myFederatedConfig },
//   // // customize the UI/styling
//   // theme: { myCustomTheme }
// });
export default App;
