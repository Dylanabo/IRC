import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { getToken } from './Common';
 
// handle the private routes

const PrivateRoute = ({ component}) => {
  return getToken() ? component : <Navigate to="/login" />;
};

export default PrivateRoute;