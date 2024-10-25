import React, { useState } from "react";
import "./ViewData.css"; // Custom styles for the home page

const ViewData = () => {
  // Sample user data
  const [userData] = useState({
    free: 120,
    basic: 75,
    pro: 50,
    premium: 25,
  });

  return (
    <>
      <div className="viewData">
        <div className="viewData-welcome-header">
          <h2>View Data Metrics</h2>
          <p>Effortlessly manage, oversee and optimize your system.</p>
        </div>
        <div className="viewData-metrics">
          <h3>User Types Count</h3>
          <div className="viewData-metrics-grid">
            <div className="viewData-metric-card">
              <h4>Free Users</h4>
              <p>{userData.free}</p>
            </div>
            <div className="viewData-metric-card">
              <h4>Basic Users</h4>
              <p>{userData.basic}</p>
            </div>
            <div className="viewData-metric-card">
              <h4>Pro Users</h4>
              <p>{userData.pro}</p>
            </div>
            <div className="viewData-metric-card">
              <h4>Premium Users</h4>
              <p>{userData.premium}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ViewData;
