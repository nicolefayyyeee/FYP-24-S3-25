import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, redirectTo, role }) => {
  const isLoggedIn = localStorage.getItem('user_id') !== null;
  const userRole = localStorage.getItem('profile');

  if (redirectTo && isLoggedIn) {
    return <Navigate to={redirectTo} />;
  }

  if (!isLoggedIn && !redirectTo) {
    return <Navigate to="/login" />;
  }

  if (role) {
    const rolesArray = Array.isArray(role) ? role : [role];
    if (!rolesArray.includes(userRole)) {
      return <Navigate to="/unauthorized" />;
    }
  }

  return children;
};

export default ProtectedRoute;
