import React from 'react';
import { Navigate } from 'react-router-dom';

export const Login = () => {
  return <Navigate to="/auth" replace />;
};
