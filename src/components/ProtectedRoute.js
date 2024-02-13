// src/components/ProtectedRoute.js
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
  const isAuth = Boolean(localStorage.getItem('token'));

  return isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoute;
