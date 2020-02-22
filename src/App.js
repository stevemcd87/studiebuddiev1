import React, { useState, useEffect } from "react";
import "./App.css";
import AmpConfig from "./Amplify/AmpConfig";
import SubjectMain from "./components/Subjects/SubjectMain";
import ApiContext from "./contexts/ApiContext";
import Amplify, { Auth, API, Storage, Interactions } from "aws-amplify";
import { Authenticator, ChatBot, AmplifyTheme } from "aws-amplify-react";
// import awsconfig from "./aws-exports";
// Amplify.configure(AmpConfig);
Amplify.configure(AmpConfig);
Storage.configure({ level: "public" });
function App() {
  const handleComplete = (err, confirmation)=> {
    if (err) {
      alert("Bot conversation failed");
      return;
    }

    alert("Success: " + JSON.stringify(confirmation, null, 2));
    return "Trip booked. Thank you! what would you like to do next?";
  }
  let [user, setUser] = useState(Auth),
    [file, setFile] = useState();
  let userInput = "book a car";

  // Provide a bot name and user input
  // const response = Interactions.send("PizzaOrderingBot", userInput).then(res => {
  //   console.log(res);
  //   console.log(res.message);
  // });
  // Interactions.onComplete("PizzaOrderingBot", handleComplete);

  // Interactions.onComplete("PizzaOrderingBot", handleComplete );

  // // Log chatbot response
  // console.log(response.message);

  useEffect(() => {
    setUser(Auth);
  }, []);

  useEffect(() => {
    console.log(user);
    // Analytics.record("Amplify_CLI");
  }, [user]);

  function uploadFile(evt) {
    console.log('u');
    let file = evt.target.files[0],
      name = file.name;
    Storage.put(name, file)
      .then(res => console.log(res))
      .catch(err => {
        console.log(err);
      });
  }

  const customVoiceConfig = {
    silenceDetectionConfig: {
      time: 2000,
      amplitude: 0.2
    }
  };

  const myTheme = {
    ...AmplifyTheme,
    sectionHeader: {
      ...AmplifyTheme.sectionHeader,
      backgroundColor: "#ff6600"
    }
  };
// ERROR WHEN RUNNING BELOW
//     onComplete={handleComplete}

  return (
    <div className="App">
      <ChatBot
        title="My Bot"
        theme={myTheme}
        botName="PizzaOrderingBot"
        welcomeMessage="Welcome, how can I help you today?"
    clearOnComplete={true}
        conversationModeOn={false}
        voiceConfig={customVoiceConfig}

      />
      <div className="test">
        <p> Pick a file</p>
        <input type="file" onChange={uploadFile} />
      </div>
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
