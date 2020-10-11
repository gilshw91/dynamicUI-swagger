import React from "react";
import PropTypes from "prop-types";
import { Button, Modal as PopUp } from "react-bootstrap";

const Modal = ({ isShowing, hide, onSubmit, children }) => (
  <>
    <PopUp show={isShowing} onHide={hide}>
      <PopUp.Header closeButton>
        <PopUp.Title>Add/Update</PopUp.Title>
      </PopUp.Header>
      <PopUp.Body>{children}</PopUp.Body>
      <PopUp.Footer>
        <Button variant="secondary" onClick={hide}>
          Close
        </Button>
        <Button onClick={onSubmit}>Save Changes</Button>
      </PopUp.Footer>
    </PopUp>
  </>
);

Modal.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

export default Modal;
