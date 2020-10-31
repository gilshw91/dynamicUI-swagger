import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
// import MainComponent from "./components/MainComponent";
// import openApiJson from "./openApiJson.json";

import "bootstrap/dist/css/bootstrap.min.css";
import "./index.css";

ReactDOM.render(
  <App />,
  // <MainComponent serviceName="pet" methodName="" specsJson={openApiJson} />,
  document.getElementById("root")
);
