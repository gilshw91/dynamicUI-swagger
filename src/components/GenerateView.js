import React, { Fragment } from "react";
import PropTypes from "prop-types";
import { Button, Form, Table, Badge } from "react-bootstrap";

import NavBar from "./shared/NavBar";
import TextField from "./shared/TextField";
import DropDownField from "./shared/DropDownField";
import PopupDialog from "./shared/PopupDialog";
import { ToastContainer } from "react-toastify";

import { capitalize, getObjectType } from "../utils";

import "./GenerateView.css";

const GenerateView = ({
  appInfo,
  menuItems,
  selectedMenuItemIndex,
  uiObject,
  fetchResponse,
  onUiInputChange,
  editDeleteButtons,
  onMenuItemClick,
  onPostOptionClicked,
  onSubmit,
  onEditClicked,
  onDeleteClicked,
  onTogglePopupDialog,
  openPopupDialog,
}) => {
  const { data, loading, error } = fetchResponse;
  const {
    displayFilters,
    tableColumns,
    tableDataArray,
    displayPostOptionsArray,
    formInModal,
  } = uiObject;

  const { isPutInService, isDeleteInService } = editDeleteButtons;
  const currentService = menuItems[selectedMenuItemIndex];

  const displayPostButtons = displayPostOptionsArray?.map((opt, index) => (
    <Button
      key={opt}
      onClick={() => {
        onPostOptionClicked(index);
      }}
    >
      {capitalize(opt)}
    </Button>
  ));

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

  const tableData = tableDataArray?.map((r, idx) => (
    <Fragment key={idx}>
      <tr>
        {tableColumns?.map((c) => {
          switch (getObjectType(r[c])) {
            case "object":
              //TODO: needs to display subColoumns for the keys of the object? (id:, url:, name: ...)
              return <td key={`${c}_${idx}`}>{Object.entries(r[c]).join()}</td>;

            case "array":
              //TODO: check if the array contains data (to avoid `[object, object]`)
              return <td key={`${c}_${idx}`}>{r[c].join()}</td>;

            default:
              return <td key={`${c}_${idx}`}>{r[c]}</td>;
          }
        })}
        <td className="actions-buttons-wrapper">
          {isPutInService ? (
            <Button variant="warning" onClick={() => onEditClicked(idx)}>
              Edit
            </Button>
          ) : null}
          {isDeleteInService ? (
            <Button variant="danger" onClick={() => onDeleteClicked(idx)}>
              Delete
            </Button>
          ) : null}
        </td>
      </tr>
    </Fragment>
  ));
  return (
    <Fragment>
      <PopupDialog
        open={openPopupDialog}
        onClose={onTogglePopupDialog}
        onSaveClicked={onSubmit}
      >
        <Form>{formInModal}</Form>
      </PopupDialog>
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
        <div className="post-buttons-wrapper">{displayPostButtons}</div>
        <ToastContainer autoClose={3000} />
        <Form className="row">{displayFiltersInputs}</Form>
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div>Error: {error}</div>
        ) : tableData && tableData.length > 0 ? (
          <Fragment>
            <br />
            <h4>
              {currentService} <Badge variant="secondary">{data.length}</Badge>
            </h4>
            <Table striped bordered hover variant="dark">
              <thead>
                <tr>
                  {tableColumns.map((column) => (
                    <th key={column}>{capitalize(column)}</th>
                  ))}
                  <th key="action">Actions</th>
                </tr>
              </thead>
              <tbody>{tableData}</tbody>
            </Table>
          </Fragment>
        ) : (
          <p>
            <i>No records to show</i>
          </p>
        )}
      </div>
    </Fragment>
  );
};

GenerateView.propTypes = {
  appInfo: PropTypes.object.isRequired,
  menuItems: PropTypes.array.isRequired,
  selectedMenuItemIndex: PropTypes.number.isRequired,
  openPopupDialog: PropTypes.bool.isRequired,
  uiObject: PropTypes.object.isRequired,
  editDeleteButtons: PropTypes.object.isRequired,
  fetchResponse: PropTypes.object.isRequired,
  onUiInputChange: PropTypes.func.isRequired,
  onMenuItemClick: PropTypes.func.isRequired,
  onPostOptionClicked: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onEditClicked: PropTypes.func.isRequired,
  onDeleteClicked: PropTypes.func.isRequired,
  onTogglePopupDialog: PropTypes.func.isRequired,
};

export default GenerateView;
