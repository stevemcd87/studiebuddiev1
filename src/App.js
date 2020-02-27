import React, { useState, useEffect } from "react";
import "./App.css";
import AmpConfig from "./Amplify/AmpConfig";
import SubjectMain from "./components/Subjects/SubjectMain";
import ApiContext from "./contexts/ApiContext";
import Amplify, { Auth, API, Storage } from "aws-amplify";
import { Authenticator} from "aws-amplify-react";
// import awsconfig from "./aws-exports";
// Amplify.configure(awsconfig);
// , ChatBot, AmplifyTheme
Amplify.configure(AmpConfig);
Storage.configure({ level: "public" });
function App() {
  let [user, setUser] = useState(Auth);
  // let userInput = "book a car";

  useEffect(() => {
    setUser(Auth);
  }, [user]);

  useEffect(() => {
    console.log(user);
  }, [user]);



  return (
    <div className="App">
      <Authenticator>
        <ApiContext.Provider value={{ API, Storage, user }}>
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
