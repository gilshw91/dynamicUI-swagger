import React, { useState } from "react";
import PropTypes from "prop-types";
import GenerateView from "./GenerateView";
import { useFetch } from "../hooks/useFetch";
import { capitalize, getObjectType } from "../utils";
import { Form, FormLabel, Row, Col } from "react-bootstrap";
import "./CreateComponents.css";
import { notifySubmit, notifyDelete, notifyError } from "../toastify";
import { useForm } from "react-hook-form";

const CreateComponents = ({ specsJson }) => {
  // the index of the current definition which has seleceted in the tab
  const [selectedDefinitionIndex, setSelectedDefinitionIndex] = useState(0);
  // array of filters options exists in the api
  const [displayFilters, setDisplayFilters] = useState([]);
  // using useFetch hook to get the data from url
  const [{ data, error, loading }, callApi] = useFetch();
  //displays fields in modal due to the option which has clicked to post
  const [formInModal, setFormInModal] = useState();
  // handle forms values using react-hook-form
  const { register, errors, handleSubmit } = useForm();
  // control the Modal to be displayed
  const [openPopupDialog, setOpenPopupDialog] = useState(false);
  // control to popup of the delete confirmation
  const [openDeletePopupDialog, setOpenDeletePopupDialog] = useState(false);
  // save the index of the item to delete
  const [deleteObjectId, setDeleteObjectId] = useState(-1);
  // store the current post action button the user has clicked on
  const [currentActionClicked, setCurrentActionClicked] = useState("");

  // contain the properties of the displayed definition that will be display as the coloumns of the table
  let tableColumns = [];
  // contain the samples data as the rows of the table
  let tableDataArray = [];
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
  // true if there is "put" methods in the current servuce endpoint (gets all endpoints with 'put' methods if exists)
  const isPutInService = currentServiceEndpoints.filter((ep) =>
    Object.keys(ep[1]).includes("put")
  );
  // true if there is "delete" methods in the current service endpoint (gets all endpoints with 'delete' methods if exists)
  const isDeleteInService = currentServiceEndpoints.filter(
    (ep) => Object.keys(ep[1]).includes("delete") // Assuming that each service has only oine "delete" method
  )[0];

  serviceEndpointsWithGetOption &&
    serviceEndpointsWithGetOption.forEach((ep) => {
      //TODO: improve this 'if'
      // this if is to handle the case of the definitions of the endpoint is in a $ref of a service
      if (
        specsJson.paths[ep[0]].get.responses &&
        specsJson.paths[ep[0]].get.responses[200] &&
        specsJson.paths[ep[0]].get.responses[200].schema &&
        specsJson.paths[ep[0]].get.responses[200].schema.$ref
      ) {
        const refOfDefintion = specsJson.paths[
          ep[0]
        ].get.responses[200].schema.$ref.replace("#/definitions/", "");
        tableColumns = Object.keys(definitions[refOfDefintion].properties);
      }
    });

  // this function analyzing each field type to dispaly in UI
  const extractFieldsFromDefinitions = (
    optionData,
    initialValues = {},
    method = "post" //default method
  ) => {
    if (!optionData) {
      console.log("optionData is null");
      notifyError();
      return;
    }
    setOpenPopupDialog(true); // open the popup dialog
    let arrayOfFiledsElements = [];
    if (Object.keys(optionData[1][method].parameters[0]).includes("schema")) {
      let refInSwagger;
      // if the body is an array, 'schema' will be placed within "items"
      if (
        Object.keys(optionData[1][method].parameters[0].schema).includes(
          "items"
        )
      ) {
        refInSwagger = optionData[1][method].parameters[0].schema.items.$ref;
      } else {
        refInSwagger = optionData[1][method].parameters[0].schema.$ref;
      }
      const ref = refInSwagger
        .replace("#/definitions", "") //TODO: need to fix this hadle with the definition?
        .replace("/", "");

      const fullRef = specsJson.definitions[ref];
      const refProperties = Object.keys(fullRef.properties);

      let inputUiInModal;
      let tempRef;
      arrayOfFiledsElements = [
        ...arrayOfFiledsElements,
        refProperties.map((field, indx) => {
          switch (fullRef.properties[field].type) {
            case "array": {
              if (fullRef.properties[field].items.type) {
                inputUiInModal = (
                  <Form.Control
                    type={
                      fullRef.properties[field].items.type === "integer"
                        ? "number"
                        : "text"
                    } // TODO: another switch
                    name={field + "[0]"} // This cast the value to "array"
                    placeholder={"Please separate by comma"}
                    ref={register({
                      required: "Required",
                    })}
                    defaultValue={initialValues[field]}
                  />
                );
              } else {
                tempRef = fullRef.properties[field].items.$ref
                  .replace("#/definitions", "")
                  .replace("/", "");
                inputUiInModal = (
                  <Form.Group
                    key={field}
                    as={Col}
                    controlId={`${field}_${indx}`}
                    ref={register({
                      required: "Required",
                    })}
                    name={field}
                  >
                    {Object.keys(specsJson.definitions[tempRef].properties).map(
                      (subField) => {
                        return (
                          <Form.Control
                            key={`${subField}_${indx}`}
                            type={
                              specsJson.definitions[tempRef].properties[
                                subField
                              ].type === "integer"
                                ? "number"
                                : "text"
                            }
                            name={[field + "[0]" + subField]} // This cast the value to object inside an array
                            placeholder={
                              capitalize(field) + "-" + capitalize(subField)
                            }
                            ref={register({
                              required: "Required",
                            })}
                            // separete between the post and put methods - handle with empty field
                            defaultValue={
                              Object.keys(initialValues).length > 0
                                ? initialValues[field][0]
                                  ? initialValues[field][0][subField]
                                  : null
                                : null
                            }
                          />
                        );
                      }
                    )}
                  </Form.Group>
                );
              }
              break;
            }

            case "string":
              // if there is a list of options:
              //TODO: handle with string, date-time like in store/order endpoint
              if (fullRef.properties[field].enum) {
                inputUiInModal = [];
                fullRef.properties[field].enum.forEach((item) => {
                  inputUiInModal = [
                    ...inputUiInModal,
                    <option key={item} name={item}>
                      {item}
                    </option>,
                  ];
                });
              } else {
                inputUiInModal = (
                  <Form.Control
                    type="text"
                    name={field}
                    placeholder={"Please enter " + capitalize(field)}
                    ref={register({
                      required: "Required",
                    })}
                    defaultValue={initialValues[field]}
                  />
                );
              }

              break;
            case "integer":
              inputUiInModal = (
                <Form.Control
                  type="number"
                  name={field}
                  placeholder={"Please enter " + capitalize(field)}
                  defaultValue={initialValues[field]}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
            case "file":
              inputUiInModal = (
                <Form.Control
                  type="file"
                  name={field}
                  placeholder={"Please enter " + capitalize(field)}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
            case "boolean":
              inputUiInModal = [
                <option key={`${field}_false`} value={Boolean(false)}>
                  False
                </option>,
                <option key={`${field}_true`} value={Boolean(true)}>
                  True
                </option>,
              ];
              break;
            // type undefined due to field has $ref
            default:
              let fieldsOfObject;
              if (fullRef.properties[field]["$ref"]) {
                const tempRef = fullRef.properties[field].$ref
                  .replace("#/definitions", "")
                  .replace("/", "");
                fieldsOfObject = specsJson.definitions[tempRef];

                //TODO: map all keys
                inputUiInModal = (
                  <Form.Group
                    key={field}
                    as={Col}
                    controlId={`${field}_${indx}`}
                    ref={register({
                      required: "Required",
                    })}
                    name={field}
                  >
                    {Object.keys(fieldsOfObject.properties).map((subField) => {
                      return (
                        <Form.Control
                          key={`${subField}_${indx}`}
                          type={
                            fieldsOfObject.properties[subField].type ===
                            "string"
                              ? "text"
                              : "number"
                          }
                          name={field + "." + subField} // This cast the value to "object"
                          placeholder={
                            capitalize(field) + "-" + capitalize(subField)
                          }
                          ref={register({
                            required: "Required",
                          })}
                          // separate betwwen the post and the put methods.
                          defaultValue={
                            Object.keys(initialValues).length > 0
                              ? initialValues[field]
                                ? initialValues[field][subField]
                                : null
                              : null
                          }
                        />
                      );
                    })}
                  </Form.Group>
                );
              } else {
                //TODO: doesnt work for all cases
                inputUiInModal = (
                  <Form.Control
                    type="text"
                    name={field}
                    placeholder={"Please enter " + capitalize(field)}
                    ref={register({
                      required: "Required",
                    })}
                  />
                );
              }
          }
          return (
            <Form.Group
              key={`${field}_${indx}`}
              as={Row}
              controlId={`${field}_${indx}`}
            >
              <Col>
                <FormLabel> {capitalize(field)}</FormLabel>
              </Col>
              <Col>
                {Array.isArray(inputUiInModal) ? (
                  <Form.Control
                    as="select"
                    name={field}
                    ref={register({
                      required: "Required",
                    })}
                    defaultValue={initialValues[field]}
                  >
                    {inputUiInModal}
                  </Form.Control>
                ) : (
                  inputUiInModal
                )}
              </Col>
            </Form.Group>
          );
        }),
      ];
      setFormInModal(arrayOfFiledsElements);
    } else {
      arrayOfFiledsElements = [
        ...arrayOfFiledsElements,
        optionData[1][method].parameters.map((field, indx) => {
          let inputUiInModal;
          switch (field.type) {
            case "array":
              inputUiInModal = (
                <Form.Control
                  type={field.type === "string" ? "text" : "number"} // TODO: another switch
                  name={field.name + "[0]"} // This cast the value to "array"
                  placeholder={"Please separate by comma"}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
            case "string":
              inputUiInModal = (
                <Form.Control
                  type="text"
                  name={field.name}
                  placeholder={"Please enter " + capitalize(field.name)}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
            case "integer":
              inputUiInModal = (
                <Form.Control
                  type="number"
                  name={field.name}
                  placeholder={"Please enter " + capitalize(field.name)}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
            case "file":
              inputUiInModal = (
                <Form.Control
                  type="file"
                  name={field.name}
                  placeholder={"Please enter " + capitalize(field.name)}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
            default:
              inputUiInModal = (
                <Form.Control
                  type="text"
                  name={field.name + "." + field.name} // This cast the value to "object"
                  placeholder={"Please enter " + capitalize(field.name)}
                  ref={register({
                    required: "Required",
                  })}
                />
              );
              break;
          }
          return (
            <Form.Group
              key={`${field.name}_${indx}`}
              as={Row}
              controlId={`${field.name}_${indx}`}
            >
              <Col>
                <FormLabel> {capitalize(field.name)}</FormLabel>
              </Col>
              <Col>{inputUiInModal}</Col>
            </Form.Group>
          );
        }),
      ];
      setFormInModal(arrayOfFiledsElements);
    }
  };

  const handleEditClicked = (index) => {
    // extract the current row where the button "edit" has clicked
    const row = tableDataArray[index];
    // extract the current endpoint
    const optionData = isPutInService[0];
    // function that display the fileds and analyze its type
    extractFieldsFromDefinitions(optionData, row, "put");
  };

  const handleDeleteClicked = (index) => {
    const row = tableDataArray[index];
    const identifier = Object.keys(row)[0];
    const reqPath = isDeleteInService[0];
    const idValue = row[identifier];
    const startIndex = reqPath.indexOf("{");
    const endIndex = reqPath.indexOf("}");
    const identifierTerm = reqPath.substring(startIndex + 1, endIndex);

    setOpenDeletePopupDialog(false);

    const reqPathToSend = reqPath.replace("{" + identifierTerm + "}", idValue);
    callApi(`${baseApiUrl}${reqPathToSend}`, { method: "DELETE" }).then(() => {
      notifyDelete();

      // reset the table
      callApi(null);

      // reset all filters value
      let newDisplayFilters = [...displayFilters];
      let i;
      for (i = 0; i < newDisplayFilters.length; i++) {
        newDisplayFilters[i] = {
          ...newDisplayFilters[i],
          value: "",
        };
      }

      setDisplayFilters(newDisplayFilters);
    });
  };

  const handleSubmitInModal = (data) => {
    let reqVal = currentActionClicked.substring(1);
    if (reqVal.includes("{") && reqVal.includes("}")) {
      const startIndex = reqVal.indexOf("{") + 1;
      const endIndex = reqVal.indexOf("}");
      const parameterName = reqVal.substring(startIndex, endIndex);
      reqVal = reqVal
        .replace("{", "")
        .replace("}", "")
        .replace(parameterName, data[parameterName]);
    }

    const currentEndpointIndex = serviceEndpointsWithPostOption.findIndex(
      (path) => path[0] === currentActionClicked
    );

    const endpoint = serviceEndpointsWithPostOption[currentEndpointIndex];

    let contentType = "";
    let reqBody = "";

    switch (endpoint[1].post.consumes[0]) {
      case "application/x-www-form-urlencoded":
        contentType = "application/x-www-form-urlencoded";

        const params = [];
        Object.keys(data).forEach((property) => {
          var encodedKey = encodeURIComponent(property);
          var encodedValue = encodeURIComponent(data[property]);
          params.push(encodedKey + "=" + encodedValue);
        });

        reqBody = params.join("&");
        break;

      default:
        contentType = "application/json";
        reqBody = JSON.stringify(data);
    }

    callApi(`${baseApiUrl}/${reqVal.toLowerCase()}`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": contentType,
      },
      body: reqBody,
    }).then(() => {
      setOpenPopupDialog((prevState) => !prevState);
      notifySubmit();
    });
  };

  const handlePostOptionClicked = (indexOfOption, path) => {
    const optionData = serviceEndpointsWithPostOption[indexOfOption];
    setCurrentActionClicked(path);
    extractFieldsFromDefinitions(optionData);
  };

  // to inizialize the index of the item in navbar and reset the response
  const handleMenuItemClick = (index) => {
    setSelectedDefinitionIndex(index);
    callApi(null);
  };
  // handle on changing input in the filters
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const currentInputIndex = displayFilters.findIndex((d) => d.name === name);
    let newDisplayFilters = [...displayFilters];

    // reset previous value of another filter
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
    // handle the case which has no value inserted- reset response
    if (!value) {
      callApi(null);
      return;
    }
    // handle and get the data by the inserted value
    const endpoint = serviceEndpointsWithGetOption[currentInputIndex];
    //TODO: problem when typing id in "store"
    switch (endpoint[1].get.parameters[0].in) {
      case "query":
        callApi(`${baseApiUrl}${endpoint[0]}?${name}=${value}`);
        break;
      case "path":
        const inputVarName = endpoint[1].get.parameters[0].name;
        const reqUrl = endpoint[0]
          .replace(inputVarName, value)
          .replace("{", "")
          .replace("}", "");
        callApi(`${baseApiUrl}${reqUrl}`);
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
    const postDetails = { path: ep[0], operation: ep[1].post.operationId };
    displayPostOptionsArray = [...displayPostOptionsArray, postDetails];
  });

  // assigning items into array
  if (data) {
    switch (getObjectType(data)) {
      case "array":
        tableDataArray.push(...data);
        break;

      case "object":
        tableDataArray.push(data);
        break;

      default:
        throw new Error("unsupported object type");
    }
  }
  //end here

  React.useEffect(
    () => setDisplayFilters(displayFiltersArray),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(displayFiltersArray)]
  );

  const uiObject = {
    displayFilters,
    tableColumns,
    tableDataArray,
    displayPostOptionsArray,
    formInModal,
    errors,
  };

  const editDeleteButtons = {
    isPutInService,
    isDeleteInService,
  };

  return (
    <GenerateView
      appInfo={specsJson.info}
      menuItems={services}
      selectedMenuItemIndex={selectedDefinitionIndex}
      uiObject={uiObject}
      editDeleteButtons={editDeleteButtons}
      fetchResponse={{ data, error, loading }}
      onUiInputChange={handleInputChange}
      onMenuItemClick={handleMenuItemClick}
      onPostOptionClicked={handlePostOptionClicked}
      onSubmit={handleSubmit(handleSubmitInModal)}
      onEditClicked={handleEditClicked}
      onDeleteClicked={(id) => {
        setDeleteObjectId(id);
        setOpenDeletePopupDialog(true);
      }}
      closeOpenDeletePopUpDialog={() =>
        setOpenDeletePopupDialog((prevState) => !prevState)
      }
      openDeletePopupDialog={openDeletePopupDialog}
      onDeleteConfirmed={() => handleDeleteClicked(deleteObjectId)}
      onTogglePopupDialog={() => setOpenPopupDialog((prevState) => !prevState)}
      openPopupDialog={openPopupDialog}
    />
  );
};

CreateComponents.propTypes = {
  specsJson: PropTypes.object.isRequired,
};

export default CreateComponents;
