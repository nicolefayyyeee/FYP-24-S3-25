import React from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, onConfirm, header, message }) => {
    if (!isOpen) return null; // dont render the modal if its not open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
            <a
                    href=" "
                    className="close"
                    onClick={(e) => {
                        e.preventDefault();
                        if (header.startsWith("Confirm")) {
                            onClose();
                        } else {
                            // if its not a confirmation modal
                            onConfirm(); 
                        }
                    }}
                >
                    &times;
                </a>
                <h3>{header}</h3>
                <p>{message}</p>
                {header.startsWith("Confirm") && (
                    <button
                        className="modal-btn"
                        onClick={onConfirm} 
                    >
                        Confirm
                    </button>
                )}
            </div>
        </div>
    );
};

export default Modal;

/**
See Admin ViewAllAccounts.js/CreateProfile.js/Parent EditAccount.js for reference, if cannot work lmk -kj
Example usage:

import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import { useNavigate } from "react-router-dom";

const Component = () => {
    const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal();
    const navigate = useNavigate();
    
    const handleSubmit = () => {
        try {
            // open a success modal after form submission (with navigation action)
            openModal("Success", data.message, () => {
                // action to execute after modal closes (navigating to home)
                navigate("/home");
            });
        } catch (error) {
            // else open an error modal (with no action)
            openModal("Error", error.message, closeModal);
        }
    };

    const handleDelete = () => {
        // open a confirmation modal for deletion, must include "Confirm" in the header
        openModal("Confirm Deletion", "Are you sure you want to delete this item?", () => {
            // action to execute if confirmed (eg. delete an item)
            deleteItem();
        });
    };

    return (
        <div>
            <button onClick={handleSubmit}>Submit</button>
            <button onClick={handleDelete}>Delete Item</button>
            
            <Modal 
                isOpen={modalOpen} 
                onClose={closeModal} 
                onConfirm={modalAction}  // pass the action to perform on confirm
                header={modalHeader} 
                message={modalMessage} 
            />
        </div>
    );
};
 */
