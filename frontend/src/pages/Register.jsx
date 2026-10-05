import React from 'react';
import { Navigate } from 'react-router-dom';

export const Register = () => {
  return <Navigate to="/auth?tab=register" replace />;
};
