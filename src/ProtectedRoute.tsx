import React, { useContext, useEffect } from 'react';
import { Route, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(AuthContext);

  useEffect(() => {
    setIsAuthenticated(isAuthenticated)
  }, [isAuthenticated])

  return (
    isAuthenticated ? <Outlet /> : <Navigate to="/login" />
  );
};

export default ProtectedRoute;
