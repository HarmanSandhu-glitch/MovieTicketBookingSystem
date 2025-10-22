import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';
import { selectUser } from '../features/auth/authSlice';

const ProtectedRoute = () => {
    const user = useSelector(selectUser);

    // If there is no user, redirect to the sign-in page
    // The `replace` prop is used to replace the current entry in the history stack
    // so the user can't go back to the protected route by clicking the back button.
    if (!user) {
        return <Navigate to="/signin" replace />;
    }

    // If the user is logged in, render the child routes
    return <Outlet />;
};

export default ProtectedRoute;
