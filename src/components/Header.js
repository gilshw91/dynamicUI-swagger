import React from "react";
import PropTypes from "prop-types";
import "./Header.css";
import { Form, Button, InputGroup, FormControl } from "react-bootstrap";

const Header = ({
  title,
  label,
  inputApiUrlValue,
  onFormSubmit,
  onInputApiUrlChange,
}) => {
  return (
    <div className="app-header">
      <div className="container">
        <h2>{title}</h2>
        <Form className="form-inline" onSubmit={onFormSubmit}>
          <label htmlFor="api-url">{label}</label>
          <InputGroup style={{ width: "65%" }}>
            <FormControl
              id="api-utl-input"
              name="api-url"
              className="ml-3"
              placeholder="Example: https://petstore.swagger.io/v2/swagger.json"
              value={inputApiUrlValue}
              onChange={onInputApiUrlChange}
            />
          </InputGroup>
          <Button type="submit" className="ml-3">
            Update
          </Button>
        </Form>
      </div>
    </div>
  );
};

Header.propTypes = {
  title: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  inputApiUrlValue: PropTypes.string.isRequired,
  onFormSubmit: PropTypes.func.isRequired,
  onInputApiUrlChange: PropTypes.func.isRequired,
};

export default Header;
