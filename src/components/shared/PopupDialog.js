import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";

const PopupDialog = ({ open, onClose, onSaveClicked, children }) => (
  <Modal show={open} onHide={onClose}>
    <Modal.Header closeButton>
      <Modal.Title>Add/Update</Modal.Title>
    </Modal.Header>
    <Modal.Body>{children}</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={onClose}>
        Close
      </Button>
      <Button onClick={onSaveClicked}>Save Changes</Button>
    </Modal.Footer>
  </Modal>
);

PopupDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSaveClicked: PropTypes.func.isRequired,
  children: PropTypes.object,
};

export default PopupDialog;
