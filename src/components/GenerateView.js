import React from "react";
import PropTypes from "prop-types";

import NavBar from "./shared/NavBar";
import TextField from "./shared/TextField";
import DropDownField from "./shared/DropDownField";

import { capitalize } from "../utils";
import "./GenerateView.css";

const GenerateView = ({
  appInfo,
  menuItems,
  selectedMenuItemIndex,
  uiObject,
  fetchResponse,
  onUiInputChange,
  onMenuItemClick,
}) => {
  const { response, loading, error } = fetchResponse;
  const {
    displayFilters,
    tableColumns,
    tableData,
    displayPostOptionsArray,
  } = uiObject;
  const currentService = menuItems[selectedMenuItemIndex];

  const displayPostButtons = displayPostOptionsArray?.map((opt, index) => {
    return (
      <button key={opt} type="submit" className="button btn-primary ml-3">
        {opt}
      </button>
    );
  });

  const displayFiltersInputs = displayFilters?.map((f, index) => {
    const name = f.name;
    const type = f.type ? f.type : "text";
    const options = f.options ? f.options : [];
    const value = f.value;

    if (type === "array") {
      return (
        <div key={`${name}_${index}`} className="col">
          <DropDownField
            name={name}
            label={capitalize(name)}
            options={options}
            value={value}
            onChange={(e) => onUiInputChange(e)}
          />
        </div>
      );
    } else {
      return (
        <div key={`${name}_${index}`} className="col">
          <TextField
            name={name}
            label={capitalize(name)}
            type={type}
            value={value}
            onChange={(e) => onUiInputChange(e)}
          />
        </div>
      );
    }
  });

  return (
    <div>
      <div className="generated-app-header">
        <h3>{appInfo.title}</h3>
        <p>Version {appInfo.version}</p>
      </div>
      <NavBar
        menuItems={menuItems}
        selectedIndex={selectedMenuItemIndex}
        onItemClick={(selectedIndex) => onMenuItemClick(selectedIndex)}
      />
      <div className="container p-4">
        <div>{displayPostButtons}</div>
        <form className="row">{displayFiltersInputs}</form>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : response ? (
          <>
            <br />
            <h4>
              {currentService} ({response.length})
            </h4>
            <table className="table table-striped table-bordered">
              <thead>
                <tr>
                  {tableColumns.map((column) => (
                    <th key={column}>{capitalize(column)}</th>
                  ))}
                  <th key="action">Actions</th>
                </tr>
              </thead>
              <tbody>{tableData}</tbody>
            </table>
          </>
        ) : (
          <p>
            <i>No records to show</i>
          </p>
        )}
      </div>
    </div>
  );
};

GenerateView.propTypes = {
  appInfo: PropTypes.object.isRequired,
  menuItems: PropTypes.array.isRequired,
  selectedMenuItemIndex: PropTypes.number.isRequired,
  uiObject: PropTypes.object.isRequired,
  fetchResponse: PropTypes.object.isRequired,
  onUiInputChange: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
};

export default GenerateView;
