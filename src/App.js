import React, { useState } from "react";
import GetJsonApi from "./components/GetJsonApi";
import Header from "./components/Header";
import "./App.css";

const App = () => {
  const [intputApiValue, setInputApiValue] = useState(
    "https://petstore.swagger.io/v2/swagger.json"
  );

  const [swaggerApi, setSwaggerApi] = useState(intputApiValue);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setSwaggerApi(intputApiValue);
  };

  return (
    <div className="app">
      <Header
        title="Dynamic UI"
        label="OpenApi 2.0 source URL:"
        inputApiUrlValue={intputApiValue}
        onInputApiUrlChange={(e) => setInputApiValue(e.target.value)}
        onFormSubmit={handleFormSubmit}
      />
      <div className="container p-0 content-container">
        <GetJsonApi specsApiUrl={swaggerApi} />
      </div>
    </div>
  );
};

export default App;
