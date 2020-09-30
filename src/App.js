import React, { useState } from 'react';
import GetJsonApi from './components/GetJsonApi';
import TextField from './components/shared/TextField';

const App = () => {
  const [intputApiValue, setInputApiValue] = useState(
    'https://petstore.swagger.io/v2/swagger.json'
  );
  const [swaggerApi, setSwaggerApi] = useState(intputApiValue);

  const handleFormSubmit = e => {
    e.preventDefault();
    setSwaggerApi(intputApiValue);
  };

  return (
    <>
      <div className="jumbotron">
        <div className="container">
          <h2>Dynamic UI</h2>
          <p className="lead">Enter a swagger.json url to render UI</p>
          <form onSubmit={handleFormSubmit}>
            <TextField
              name="inputApi"
              label="Api URL"
              value={intputApiValue}
              onChange={e => setInputApiValue(e.target.value)}
            />
            <button type="submit" className="btn btn-primary">
              Update
            </button>
          </form>
        </div>
      </div>
      <div className="container p-3 my-3 border">
        <GetJsonApi specsApiUrl={swaggerApi} />
      </div>
    </>
  );
};

export default App;
