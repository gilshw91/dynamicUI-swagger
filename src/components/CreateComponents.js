import React, { useState } from 'react';
import PropTypes from 'prop-types';
import GenerateView from './GenerateView';
import { useFetch } from '../hooks/useFetch';
import { capitalize } from '../utils';

const CreateComponents = ({ specsJson }) => {
  const [selectedDefinitionIndex, setselectedDefinitionIndex] = useState(0);
  const [displayFilters, setDisplayFilters] = useState([]);
  const [fetchURL, setFetchRequest] = useState('');
  const fetchResponse = useFetch(fetchURL);

  let tableColumns = [];
  let tableData = [];
  let displayFiltersArray = [];

  const host = specsJson.host;
  const basePath = specsJson.basePath;
  const schema = specsJson.schemes
    ? specsJson.schemes.includes('https')
      ? 'https://'
      : 'http://'
    : 'http://';
  const baseApiUrl = schema + host + basePath;

  const services_raw = Object.keys(specsJson.paths).map(service => {
    const serviceNameWithoutSlash = service.substring(1);
    const indx = serviceNameWithoutSlash.indexOf('/');

    let serviceName = serviceNameWithoutSlash;
    if (indx > 0) serviceName = serviceNameWithoutSlash.substring(0, indx);

    return capitalize(serviceName);
  });
  const services = services_raw.filter(
    (value, index, array) => array.indexOf(value) === index
  );

  const currentService = services[selectedDefinitionIndex];

  // get definitions if exists
  const definitions = specsJson.definitions;
  const currentServiceDefinition = definitions[currentService];

  if (currentServiceDefinition) {
    const properties = currentServiceDefinition.properties;
    tableColumns = Object.keys(properties);
  }

  // get all endpoints
  const endpoints = Object.entries(specsJson.paths);

  // filter to current service endpoints
  const currentServiceEndpoints = endpoints.filter(ep =>
    ep[0].startsWith('/' + currentService.toLowerCase())
  );

  // filter to current service endpoints
  const serviceEndpoitsWithGetOption = currentServiceEndpoints.filter(ep =>
    Object.keys(ep[1]).includes('get')
  );

  const handleInputChange = e => {
    const { name, value } = e.target;
    const currentInputIndex = displayFilters.findIndex(d => d.name === name);

    let newDisplayFilters = [...displayFilters];
    newDisplayFilters[currentInputIndex] = {
      ...newDisplayFilters[currentInputIndex],
      value,
    };
    setDisplayFilters(newDisplayFilters);
    const endpoint = serviceEndpoitsWithGetOption[currentInputIndex];
    switch (endpoint[1].get.parameters[0].in) {
      case 'query':
        setFetchRequest(`${baseApiUrl}${endpoint[0]}?${name}=${value}`);
        break;

      default:
        break;
    }
  };

  // build 'get' fields to the UI
  serviceEndpoitsWithGetOption.forEach(ep => {
    const epParamsArray = ep[1].get.parameters;

    epParamsArray.forEach(epParams => {
      switch (epParams.type) {
        case 'integer':
          displayFiltersArray = [
            ...displayFiltersArray,
            {
              name: epParams.name,
              type: 'number',
              value: '',
            },
          ];
          break;

        case 'array':
          const options = epParams.items.enum ? epParams.items.enum : [];
          displayFiltersArray = [
            ...displayFiltersArray,
            {
              name: epParams.name,
              type: 'array',
              options,
              value: '',
            },
          ];
          break;

        default:
          displayFiltersArray = [
            ...displayFiltersArray,
            {
              name: epParams.name,
              value: '',
            },
          ];
          break;
      }
    });
  });

  tableData = fetchResponse?.response?.map((r, idx) => (
    <tr key={idx}>
      {tableColumns?.map(c => {
        switch (typeof r[c]) {
          case 'object':
            return <td key={`${c}_${idx}`}>{Object.entries(r[c]).join()}</td>;

          case 'array':
            return <td key={`${c}_${idx}`}>{r[c].join()}</td>;

          default:
            return <td key={`${c}_${idx}`}>{r[c]}</td>;
        }
      })}
    </tr>
  ));

  React.useEffect(
    () => setDisplayFilters(displayFiltersArray),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(displayFiltersArray)]
  );

  const uiObject = { displayFilters, tableColumns, tableData };

  return (
    <GenerateView
      inputOpenApiJson={specsJson}
      appInfo={specsJson.info}
      menuItems={services}
      selectedMenuItemIndex={selectedDefinitionIndex}
      uiObject={uiObject}
      fetchResponse={fetchResponse}
      onUiInputChange={handleInputChange}
      onMenuItemClick={index => setselectedDefinitionIndex(index)}
    />
  );
};

CreateComponents.propTypes = {
  specsJson: PropTypes.object.isRequired,
};

export default CreateComponents;
