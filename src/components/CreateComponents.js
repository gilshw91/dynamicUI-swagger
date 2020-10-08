import React, { useState } from "react";
import PropTypes from "prop-types";
import GenerateView from "./GenerateView";
import { useFetch } from "../hooks/useFetch";
import { capitalize } from "../utils";
import useModal from "./shared/useModal";
import { Button } from "react-bootstrap";
import "./CreateComponents.css";

const CreateComponents = ({ specsJson }) => {
  // the index of the current definition which has seleceted in the tab
  const [selectedDefinitionIndex, setSelectedDefinitionIndex] = useState(0);
  // array of filters options exists in the api
  const [displayFilters, setDisplayFilters] = useState([]);
  // the data that is fetched from the given url
  const [fetchURL, setFetchRequest] = useState("");
  // using useFetch hook to get response from url
  const fetchResponse = useFetch(fetchURL);

  // contain the properties of the displayed definition that will be display as the coloumns of the table
  let tableColumns = [];
  // contain the samples data as the rows of the table
  let tableData = [];
  // contain the data of the filters type (name, type, (option), value etc..)
  let displayFiltersArray = [];

  const host = specsJson.host;
  const basePath = specsJson.basePath;
  const schema = specsJson.schemes
    ? specsJson.schemes.includes("https")
      ? "https://"
      : "http://"
    : "http://";
  const baseApiUrl = schema + host + basePath;
  // mapping over the paths and slice the first char which is "/" and capitalize them
  const services_raw = Object.keys(specsJson.paths).map((service) => {
    const serviceNameWithoutSlash = service.substring(1);
    const indx = serviceNameWithoutSlash.indexOf("/");

    let serviceName = serviceNameWithoutSlash;
    if (indx > 0) serviceName = serviceNameWithoutSlash.substring(0, indx);

    return capitalize(serviceName);
  });
  //TODO: this chuck returns 4 times. is it needed?
  // array that contains the unique paths which exists in the API
  const services = services_raw.filter(
    (value, index, array) => array.indexOf(value) === index
  );
  // the name of the selected path
  const currentService = services[selectedDefinitionIndex];

  // get definitions if exists
  const definitions = specsJson.definitions;
  const currentServiceDefinition = definitions[currentService];

  // if definitions exist- appending their name to the table as coloumns
  if (currentServiceDefinition) {
    const properties = currentServiceDefinition.properties;
    tableColumns = Object.keys(properties);
  }

  // get all endpoints
  const endpoints = Object.entries(specsJson.paths);

  // gets all endpoints of the current service
  const currentServiceEndpoints = endpoints.filter((ep) =>
    ep[0].startsWith("/" + currentService.toLowerCase())
  );

  // gets all endpoints with 'get' method
  const serviceEndpointsWithGetOption = currentServiceEndpoints.filter((ep) =>
    Object.keys(ep[1]).includes("get")
  );
  // gets all endpoints with 'post' method
  const serviceEndpointsWithPostOption = currentServiceEndpoints.filter((ep) =>
    Object.keys(ep[1]).includes("post")
  );
  // gets all endpoints with 'put' method
  const serviceEndpointsWithPutOption = currentServiceEndpoints.filter((ep) =>
    Object.keys(ep[1]).includes("put")
  );
  // gets all endpoints with 'delete' method
  const serviceEndpointsWithDeleteOption = currentServiceEndpoints.filter(
    (ep) => Object.keys(ep[1]).includes("delete")
  );

  const handleMenuItemClick = (index) => {
    setSelectedDefinitionIndex(index);
    setFetchRequest("");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const currentInputIndex = displayFilters.findIndex((d) => d.name === name);
    let newDisplayFilters = [...displayFilters];

    let i;
    for (i = 0; i < newDisplayFilters.length; i++) {
      if (i === currentInputIndex) {
        newDisplayFilters[currentInputIndex] = {
          ...newDisplayFilters[currentInputIndex],
          value,
        };
      } else {
        newDisplayFilters[i] = {
          ...newDisplayFilters[i],
          value: "",
        };
      }
    }
    setDisplayFilters(newDisplayFilters);
    if (!value) {
      setFetchRequest("");
      return;
    }
    const endpoint = serviceEndpointsWithGetOption[currentInputIndex];
    //TODO: deal with a sample that have not found (like if id doesnt exist)
    switch (endpoint[1].get.parameters[0].in) {
      case "query":
        setFetchRequest(`${baseApiUrl}${endpoint[0]}?${name}=${value}`);
        break;
      case "path":
        const inputVarName = endpoint[1].get.parameters[0].name;
        const reqUrl = endpoint[0]
          .replace(inputVarName, value)
          .replace("{", "")
          .replace("}", "");
        setFetchRequest(`${baseApiUrl}${reqUrl}`);
        break;
      //TODO: alert if the case is the default
      default:
        break;
    }
  };

  // build 'get' fields to the UI
  serviceEndpointsWithGetOption.forEach((ep) => {
    const epParamsArray = ep[1].get.parameters;

    epParamsArray.forEach((epParams) => {
      switch (epParams.type) {
        case "integer":
          displayFiltersArray = [
            ...displayFiltersArray,
            {
              name: epParams.name,
              type: "number",
              value: "",
              //TODO: epParams.maximum ? (maximum: epParams.maximum) : (maximum: ""),
              //TODO: epParams.minimum ? (minimum: epParams.minimum) : (minimum: ""),
            },
          ];
          break;

        case "array":
          const options = epParams.items.enum ? epParams.items.enum : [];
          displayFiltersArray = [
            ...displayFiltersArray,
            {
              name: epParams.name,
              type: "array",
              options,
              value: "",
              //TODO: epParams.items.default ? (value: epParams.items.default) : (value: ""),
            },
          ];
          break;

        default:
          displayFiltersArray = [
            ...displayFiltersArray,
            {
              name: epParams.name,
              value: "",
            },
          ];
          break;
      }
    });
  });
  let displayPostOptionsArray = [];

  serviceEndpointsWithPostOption.forEach((ep) => {
    displayPostOptionsArray = [
      ...displayPostOptionsArray,
      ep[1].post.operationId,
    ];
  });
  // setDisplayPostOptions(displayPostOptionsArray); infinit loop!

  if (fetchResponse?.response && !Array.isArray(fetchResponse.response)) {
    tableData = (
      <tr>
        {Object.entries(fetchResponse.response).map((entry, index) => {
          const keyName = entry[0];
          const keyValue = entry[1];

          return (
            <td key={`${keyName}_row_${index}`}>
              {Array.isArray(keyValue)
                ? keyValue.join()
                : typeof keyValue === "object"
                ? Object.entries(keyValue).join()
                : keyValue}
            </td>
          );
        })}
      </tr>
    );
  } else {
    tableData = fetchResponse?.response?.map((r, idx) => (
      <React.Fragment key={idx}>
        <tr>
          {tableColumns?.map((c) => {
            switch (typeof r[c]) {
              case "object":
                //TODO: needs to display subColoumns for the keys of the object? (id:, url:, name: ...)
                return (
                  <td key={`${c}_${idx}`}>{Object.entries(r[c]).join()}</td>
                );

              case "array":
                //TODO: check if the array contains data (to avoid `[object, object]`)
                return <td key={`${c}_${idx}`}>{r[c].join()}</td>;

              default:
                return <td key={`${c}_${idx}`}>{r[c]}</td>;
            }
          })}
          <td className="actions-buttons-wrapper">
            {serviceEndpointsWithPutOption ? (
              <Button variant="warning">Edit</Button>
            ) : null}
            {serviceEndpointsWithDeleteOption ? (
              <Button variant="danger">Delete</Button>
            ) : null}
          </td>
        </tr>
      </React.Fragment>
    ));
  }

  React.useEffect(
    () => setDisplayFilters(displayFiltersArray),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(displayFiltersArray)]
  );

  const uiObject = {
    displayFilters,
    tableColumns,
    tableData,
    displayPostOptionsArray,
  };

  const { isShowing, toggle } = useModal();
  return (
    <GenerateView
      appInfo={specsJson.info}
      menuItems={services}
      selectedMenuItemIndex={selectedDefinitionIndex}
      uiObject={uiObject}
      fetchResponse={fetchResponse}
      onUiInputChange={handleInputChange}
      onMenuItemClick={handleMenuItemClick}
      toggle={toggle}
      isShowing={isShowing}
    />
  );
};

CreateComponents.propTypes = {
  specsJson: PropTypes.object.isRequired,
};

export default CreateComponents;
