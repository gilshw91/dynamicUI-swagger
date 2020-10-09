import React from "react";
import PropTypes from "prop-types";
import { Nav, Navbar } from "react-bootstrap";

const NavBar = ({ menuItems, selectedIndex, onItemClick }) => {
  return (
    <Navbar bg="dark" variant="dark">
      <Nav className="mr-auto">
        {menuItems.map((menuItem, idx) => (
          <Nav.Link key={menuItem} onClick={() => onItemClick(idx)}>
            {menuItem}
          </Nav.Link>
        ))}
      </Nav>
    </Navbar>
  );
};

NavBar.propTypes = {
  menuItems: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number,
  onItemClick: PropTypes.func.isRequired,
};

export default NavBar;
