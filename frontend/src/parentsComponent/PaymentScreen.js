import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Modal from "../containers/modal/Modal";
import useModal from "../containers/hooks/useModal";

const PaymentScreen = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const params = new URLSearchParams(location.search);
  const planName = params.get("plan");
  const price = params.get("price");
  const maxProfiles = params.get("maxProfiles");

  const handlePaymentRedirect = async () => {
    try {
      const response = await fetch("http://localhost:5000/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          amount: parseInt(price.replace(/\D/g, "")) * 100, 
          planName, 
          maxProfiles 
        })
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;  // Redirect to Stripe Checkout
      } else {
        console.error("Failed to create Checkout session:", data.error);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    handlePaymentRedirect();  // Initiate payment redirect on mount
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2 style={{ color: "white" }}>Redirecting to payment for {planName} Plan...</h2>
    </div>
  );
};

// PaymentSuccess component for successful payment
export const PaymentSuccess = () => {
  const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal();
  const navigate = useNavigate();
  const location = useLocation();

  const params = new URLSearchParams(location.search);
  const planName = params.get("planName");
  const maxProfiles = params.get("maxProfiles");

  useEffect(() => {
    openModal("Success", 'Payment Confirmed!', () => {
      localStorage.setItem('currentPlan', planName);
      navigate(`/createChild?plan=${planName}&maxProfiles=${maxProfiles}`);
    });
  }, [navigate, planName, maxProfiles]);

  return (
    
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        header={modalHeader}
        message={modalMessage}
        onConfirm={modalAction}
      />
      <h2 style={{ color: "white" }}>Payment successful! Redirecting...</h2>
    </div>
  );
};

// PaymentCancel component for canceled payment
export const PaymentCancel = () => {
  const { modalOpen, modalHeader, modalMessage, modalAction, openModal, closeModal } = useModal();
  const navigate = useNavigate();

  useEffect(() => {
    openModal("Error", 'Payment failed', () => {
      navigate("/subscriptionPlans");  
    });
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <Modal
        isOpen={modalOpen}
        onClose={closeModal}
        header={modalHeader}
        message={modalMessage}
        onConfirm={modalAction}
      />
      <h2 style={{ color: "white" }}>Payment cancelled. Redirecting...</h2>
    </div>
  );
};

export default PaymentScreen;
