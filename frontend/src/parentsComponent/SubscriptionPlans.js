import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./SubscriptionPlans.css"; // Custom styles for the home page

const SubscriptionPlans = () => {
  const [activeTab, setActiveTab] = useState("Monthly"); // Track active tab
  const [activeMonthlyPlan, setActiveMonthlyPlan] = useState("Basic"); // Default active monthly plan
  const [activeYearlyPlan, setActiveYearlyPlan] = useState(""); // Default active yearly plan

  const monthlyPlans = [
    { name: "Free", price: "$0 per month", features: ["1 child profile", "Limited to 5 uploads/captures a day"], color: "red" },
    { name: "Basic", price: "$5 per month", features: ["2 child profiles", "Access to AI-generated avatars"], color: "pink" },
    { name: "Pro", price: "$10 per month", features: ["5 child profiles", "Full access to caption features"], color: "blue" },
    { name: "Premium", price: "$20 per month", features: ["Unlimited profiles", "Custom photo filters"], color: "green" },
  ];

  const yearlyPlans = [
    { name: "Free", price: "$0 per year", features: ["1 child profile", "Limited to 5 uploads/captures a day"], color: "red" },
    { name: "Basic", price: "$50 per year", features: ["2 child profiles", "Access to AI-generated avatars"], color: "pink" },
    { name: "Pro", price: "$100 per year", features: ["5 child profiles", "Full access to caption features"], color: "blue" },
    { name: "Premium", price: "$200 per year", features: ["Unlimited profiles", "Custom photo filters"], color: "green" },
  ];

  const plansToDisplay = activeTab === "Monthly" ? monthlyPlans : yearlyPlans;

  // Determine the current plan name based on the active tab
  const currentPlan = activeTab === "Monthly" ? activeMonthlyPlan : activeYearlyPlan;

  return (
    <div className="subPlans">
      <div className="subPlans-header">
        <h2>Subscriptions</h2>
        <p>View the best plan for your family.</p>
        <button 
          className={`month-year-btn ${activeTab === "Monthly" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Monthly");
            setActiveMonthlyPlan("Basic"); // Reset active plan to Basic for monthly
            setActiveYearlyPlan(""); // Reset active plan for yearly
          }}
        >
          Monthly
        </button>
        <button 
          className={`month-year-btn ${activeTab === "Yearly" ? "active" : ""}`}
          onClick={() => {
            setActiveTab("Yearly");
            setActiveYearlyPlan("Basic"); // Set default active plan for yearly
            setActiveMonthlyPlan(""); // Reset active plan for monthly
          }}
        >
          Yearly
        </button>
      </div>

      <div className="subPlans-grid">
        {plansToDisplay.map((plan, index) => (
          <Link to="/gallery" key={index}>
            <div 
              className={`subPlans-card ${plan.color} ${activeTab === "Monthly" && activeMonthlyPlan === plan.name ? "active-plan" : ""} ${activeTab === "Yearly" && activeYearlyPlan === plan.name ? "active-plan" : ""}`} 
              onClick={() => {
                if (activeTab === "Monthly") {
                  setActiveMonthlyPlan(plan.name);
                } else {
                  setActiveYearlyPlan(plan.name);
                }
                console.log(`Active Tab: ${activeTab}, Active Plan: ${plan.name}`); // Debug log
              }}
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
          </Link>
        ))}
      </div>

      {/* Unclickable button for current plan */}
      <div className="current-plan-wrapper">
        <button className="current-plan-btn" disabled>
          Your Current Plan: {currentPlan || "None"}
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPlans;
