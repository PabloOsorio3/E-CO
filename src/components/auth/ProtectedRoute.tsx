import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getCurrentToken, getCurrentRole } from '../../core/current_user';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
  path: string;
  exact?: boolean;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  allowedRoles,
  ...rest
}) => {
  const token = getCurrentToken();
  const role = getCurrentRole();

  return (
    <Route
      {...rest}
      render={(props) => {
        if (!token) {
          return <Redirect to="/" />;
        }

        if (allowedRoles && !allowedRoles.includes(role)) {
          return <Redirect to="/" />;
        }

        return <Component {...props} />;
      }}
    />
  );
};

export default ProtectedRoute;
