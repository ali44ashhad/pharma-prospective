// frontend/src/components/common/ProtectedRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext.jsx';
import Loader from './Loader';

const ProtectedRoute = ({ children, requireAdmin = false }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;