import React from 'react';
import PropTypes from 'prop-types';

const NavBar = ({ menuItems, selectedIndex, onItemClick }) => {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <button
        className="navbar-toggler"
        type="button"
        data-toggle="collapse"
        data-target="#navbarSupportedContent"
        aria-controls="navbarSupportedContent"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          {menuItems.map((menuItem, idx) => (
            <li
              key={menuItem}
              onClick={() => onItemClick(idx)}
              className={idx === selectedIndex ? 'nav-item active' : 'nav-item'}
            >
              <button className="btn btn-link nav-link">
                {menuItem} <span className="sr-only">(current)</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
};

NavBar.propTypes = {
  menuItems: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  onItemClick: PropTypes.func.isRequired,
};

export default NavBar;
