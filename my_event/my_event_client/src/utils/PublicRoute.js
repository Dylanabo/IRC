import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getToken } from './Common';

// handle the private routes
const PublicRoute = ({ component}) => {
  return !getToken() ? component : <Navigate to="/dashboard" />;
};

export default PublicRoute;