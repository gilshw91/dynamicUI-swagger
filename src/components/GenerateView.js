import React, { useState } from 'react';
import PropTypes from 'prop-types';
import TabControl from './TabControl';
import TextField from './shared/TextField';
import DropDownField from './shared/DropDownField';

const GenerateView = ({ inputFieldsObject }) => {
  const [inputFieldsObj, setInputFieldsObj] = useState(inputFieldsObject);
  const [selectedDefinition, setSelectedDefinition] = useState(
    Object.keys(inputFieldsObj)[0]
  );

  const handleInputChange = e => {
    const { name, value } = e.target;
    const elementsIndex = inputFieldsObj[selectedDefinition].findIndex(
      o => o.name === name
    );

    let newArray = [...inputFieldsObj[selectedDefinition]];
    newArray[elementsIndex] = {
      ...newArray[elementsIndex],
      value,
    };

    setInputFieldsObj(prevState => ({
      ...prevState,
      [selectedDefinition]: newArray,
    }));
  };

  const handleFormSubmit = e => {
    e.preventDefault();
    console.log(inputFieldsObj[selectedDefinition]);
  };

  const definitionFields = inputFieldsObj[selectedDefinition].map(field =>
    field.enum ? (
      <DropDownField
        key={field.name}
        name={field.name}
        label={field.description ? field.description : field.name}
        value={field.value}
        onChange={handleInputChange}
        options={field.enum}
      />
    ) : (
      <TextField
        key={field.name}
        name={field.name}
        type={field.type}
        label={field.description ? field.description : field.name}
        value={field.value}
        onChange={handleInputChange}
      />
    )
  );

  return (
    <TabControl
      headers={Object.keys(inputFieldsObj)}
      activeHeader={selectedDefinition}
      onHeaderClick={header => setSelectedDefinition(header)}
    >
      <form onSubmit={handleFormSubmit}>
        {definitionFields}
        <button type="submit" className="btn btn-primary">
          Submit
        </button>
      </form>
    </TabControl>
  );
};

GenerateView.propTypes = {
  inputFieldsObject: PropTypes.object.isRequired,
};

export default GenerateView;
