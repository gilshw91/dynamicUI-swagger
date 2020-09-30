import React from 'react';
import PropTypes from 'prop-types';
import GenerateView from './GenerateView';

const CreateComponents = ({ specsJson }) => {
  let fieldsObject = {};

  // extract tags
  const tags = specsJson.tags.map(tag => tag.name);

  // loop each definition
  Object.keys(specsJson.definitions).forEach(definition => {
    // check the current definition is exist in the 'tags' attribute
    const taggedDefinition = tags.find(tag => tag === definition.toLowerCase());
    if (taggedDefinition) {
      fieldsObject = {
        ...fieldsObject,
        [taggedDefinition]: [],
      };
      // definition is exist in the 'tags' attribute

      // extract definition properties
      const propertiesObject = specsJson.definitions[definition]['properties'];

      // loop each definition property and return input fields
      Object.keys(propertiesObject).forEach(propKey => {
        const propType = propertiesObject[propKey].type;
        const propDescription = propertiesObject[propKey].description;
        const propEnum = propertiesObject[propKey].enum;

        let fieldType = 'text';
        switch (propType) {
          case 'integer': {
            fieldType = 'number';
            break;
          }

          default: {
            fieldType = 'text';
            break;
          }
        }

        fieldsObject[taggedDefinition] = [
          ...fieldsObject[taggedDefinition],
          {
            name: propKey,
            type: fieldType,
            description: propDescription,
            enum: propEnum,
            value: '',
          },
        ];
      });
    }
  });

  return <GenerateView inputFieldsObject={fieldsObject} />;
};

CreateComponents.propTypes = {
  specsJson: PropTypes.object.isRequired,
};

export default CreateComponents;
