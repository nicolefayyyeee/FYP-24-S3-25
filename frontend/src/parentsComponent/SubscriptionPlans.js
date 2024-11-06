import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SubscriptionPlans.css";

const SubscriptionPlans = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Monthly");
  const [activeMonthlyPlan, setActiveMonthlyPlan] = useState("Basic");
  const [activeYearlyPlan, setActiveYearlyPlan] = useState("");
  const [currentPlan, setCurrentPlan] = useState(null);

  useEffect(() => { 
    const storedPlan = localStorage.getItem('currentPlan');
    if (!storedPlan) {
      localStorage.setItem('currentPlan', 'Free');
      setCurrentPlan('Free');
    } else {
      setCurrentPlan(storedPlan);
    }
  }, []);

  const monthlyPlans = [
    { name: "Free", price: "$0 per month", features: ["1 child profile", "Limited to 5 uploads/captures a day"], color: "red", maxProfiles: 1 },
    { name: "Basic", price: "$5 per month", features: ["2 child profiles", "Access to AI-generated avatars"], color: "pink", maxProfiles: 2 },
    { name: "Pro", price: "$10 per month", features: ["5 child profiles", "Full access to caption features"], color: "blue", maxProfiles: 5 },
    { name: "Premium", price: "$20 per month", features: ["Unlimited profiles", "Custom photo filters"], color: "green", maxProfiles: Infinity },
  ];

  const yearlyPlans = [
    { name: "Free", price: "$0 per year", features: ["1 child profile", "Limited to 5 uploads/captures a day"], color: "red", maxProfiles: 1 },
    { name: "Basic", price: "$50 per year", features: ["2 child profiles", "Access to AI-generated avatars"], color: "pink", maxProfiles: 2 },
    { name: "Pro", price: "$100 per year", features: ["5 child profiles", "Full access to caption features"], color: "blue", maxProfiles: 5 },
    { name: "Premium", price: "$200 per year", features: ["Unlimited profiles", "Custom photo filters"], color: "green", maxProfiles: Infinity },
  ];

  const plansToDisplay = activeTab === "Monthly" ? monthlyPlans : yearlyPlans;

  const handlePlanSelect = (plan) => {
    const createdProfilesFree = parseInt(localStorage.getItem('created_profiles_Free') || '0', 10);
    if (plan.name === "Free" && createdProfilesFree > 0) {
      alert("You cannot select the Free plan because you have already created a profile.");
      return;
    }

    localStorage.setItem('currentPlan', plan.name);
    setCurrentPlan(plan.name); 

    if (plan.name !== "Free") {
      const confirmPayment = window.confirm(`Do you want to proceed to payment for the ${plan.name} plan?`);
      if (confirmPayment) {
        navigate(`/paymentScreen?plan=${plan.name}&price=${plan.price}&maxProfiles=${plan.maxProfiles}`);
      }
    } else {
      navigate(`/createChild?plan=${plan.name}&maxProfiles=${plan.maxProfiles}`);
    }
  };

  return (
    <div className="subPlans">
      <div className="subPlans-header">
        <h2>Subscription Plans</h2>
        <p>View the best plan for your family.</p>
        <p>Your current plan: <strong>{currentPlan || "---"}</strong></p>

        <button 
          className={`month-year-btn ${activeTab === "Monthly" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Monthly");
            setActiveMonthlyPlan("Basic");
            setActiveYearlyPlan("");
          }}
        >
          Monthly
        </button>
        <button 
          className={`month-year-btn ${activeTab === "Yearly" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Yearly");
            setActiveYearlyPlan("Basic");
            setActiveMonthlyPlan("");
          }}
        >
          Yearly
        </button>
      </div>

      <div className="subPlans-grid">
        {plansToDisplay.map((plan, index) => (
          <div 
            key={index}
            className={`subPlans-card ${plan.color} ${activeTab === "Monthly" && activeMonthlyPlan === plan.name ? "active-plan" : ""} ${activeTab === "Yearly" && activeYearlyPlan === plan.name ? "active-plan" : ""}`} 
            onClick={() => handlePlanSelect(plan)}
          >
            <div className="subPlans-column">
              <h3>{plan.name}</h3>
              <p>{plan.price}</p>
            </div>
            <div className="subPlans-column">
              {plan.features.map((feature, i) => (
                <p key={i}>{feature}</p>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionPlans;
