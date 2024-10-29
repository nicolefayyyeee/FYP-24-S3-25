import { useState } from "react";

const useModal = () => {
    const [modalOpen, setModalOpen] = useState(false);    // tracks whether the modal is open
    const [modalHeader, setModalHeader] = useState("");   // modal's header text
    const [modalMessage, setModalMessage] = useState(""); // modal's message text
    const [modalAction, setModalAction] = useState(null); // optional action to execute when modal closes

    const openModal = (header, message, action = null) => {
        setModalHeader(header);
        setModalMessage(message);
        setModalAction(() => action); // set the action if provided
        setModalOpen(true);           // open modal
    };

    const closeModal = () => {
        setModalOpen(false);    // close modal
        setModalHeader("");     // clear modal's header
        setModalMessage("");    // clear modal's message
    };
    
    const confirmModal = () => {
        if (modalAction) {
            modalAction(); // execute the action if it exists
        }
        closeModal(); // then close the modal
    };
    return {
        modalOpen,
        modalHeader,
        modalMessage,
        modalAction,
        openModal,
        closeModal,
        confirmModal,
    };
};

export default useModal;


/**
See Admin ViewAllAccounts.js/Parent EditAccount.js for reference, if cannot work lmk -kj
Example usage:

import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";
import { useNavigate } from "react-router-dom";

const Component = () => {
    const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal();
    const navigate = useNavigate();
    
    const handleSubmit = () => {
        // open a success modal after form submission
        openModal("Success", "Your form has been submitted!", () => {
            // action to execute after modal closes (navigating to home)
            navigate("/home");
        });
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
