import React, { useState, useEffect } from "react";
import "./ViewData.css";

const ViewData = () => {
  const [subscriptionCounts, setSubscriptionCounts] = useState({
    Free: 0,
    Basic: 0,
    Pro: 0,
    Premium: 0,
  });

  useEffect(() => {
    if (!localStorage.getItem("freeUserCount")) localStorage.setItem("freeUserCount", "150");
    if (!localStorage.getItem("basicUserCount")) localStorage.setItem("basicUserCount", "77");
    if (!localStorage.getItem("proUserCount")) localStorage.setItem("proUserCount", "55");
    if (!localStorage.getItem("premiumUserCount")) localStorage.setItem("premiumUserCount", "20");

    const freeCount = parseInt(localStorage.getItem("freeUserCount"), 10);
    const basicCount = parseInt(localStorage.getItem("basicUserCount"), 10);
    const proCount = parseInt(localStorage.getItem("proUserCount"), 10);
    const premiumCount = parseInt(localStorage.getItem("premiumUserCount"), 10);

    setSubscriptionCounts({
      Free: freeCount,
      Basic: basicCount,
      Pro: proCount,
      Premium: premiumCount,
    });
  }, []);

  return (
    <div className="viewData">
      <div className="viewData-welcome-header">
        <h2>View Data Metrics</h2>
        <p>Effortlessly manage, oversee, and optimize your system.</p>
      </div>

      <div className="viewData-metrics">
        <h3>User Types Count</h3>
        <div className="viewData-metrics-grid">
          <div className="viewData-metric-card">
            <h4>Free Users</h4>
            <p>{subscriptionCounts.Free}</p>
          </div>
          <div className="viewData-metric-card">
            <h4>Basic Users</h4>
            <p>{subscriptionCounts.Basic}</p>
          </div>
          <div className="viewData-metric-card">
            <h4>Pro Users</h4>
            <p>{subscriptionCounts.Pro}</p>
          </div>
          <div className="viewData-metric-card">
            <h4>Premium Users</h4>
            <p>{subscriptionCounts.Premium}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewData;
