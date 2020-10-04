import React from 'react';
import PropTypes from 'prop-types';
import './Header.css';

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
        <form className="form-inline" onSubmit={onFormSubmit}>
          <label htmlFor="api-url">{label}</label>
          <input
            id="api-utl-input"
            name="api-url"
            className="form-control ml-3"
            placeholder="Example: https://petstore.swagger.io/v2/swagger.json"
            value={inputApiUrlValue}
            onChange={onInputApiUrlChange}
          />
          <button type="submit" className="btn btn-primary ml-3">
            Update
          </button>
        </form>
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
