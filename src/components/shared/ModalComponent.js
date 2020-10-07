import React from "react";
import PropTypes from "prop-types";
import { Button, Modal } from "react-bootstrap";

const ModalComponent = ({ isShowing, hide }) => (
  <>
    <Modal show={isShowing} onHide={hide}>
      <Modal.Header closeButton>
        <Modal.Title>Modal heading</Modal.Title>
      </Modal.Header>
      <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hide}>
          Close
        </Button>
        <Button variant="primary" onClick={hide}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  </>
);

ModalComponent.propTypes = {
  isShowing: PropTypes.bool.isRequired,
  hide: PropTypes.func.isRequired,
};

export default ModalComponent;
