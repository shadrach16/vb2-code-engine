// src/components/auth/ProtectedRoute.js
import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { user, token, isLoading } = useAuth();

React.useEffect(()=>{
localStorage.setItem('last_route',rest.path )
},[])


  if (isLoading) {
    return <div>Loading...</div>; 
  }

  return (
    <Route
      {...rest}
      render={props => {
        if (!user && !token) {
          // not logged in so redirect to login page with the return url
          return <Redirect to={{ pathname: '/login', state: { from: props.location } }} />
        } else {
          // authorized so return component
          return <Component {...props} />
        }
      }}
    />
  );
};

export default ProtectedRoute;