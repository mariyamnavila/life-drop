import useAuth from '@/hooks/useAuth';
import Loading from '@/Pages/Loading/Loading';
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth()
    const location = useLocation()

    if (loading) {
        return <Loading />
    }

    if (!user) {
        return <Navigate state={{ from: location.pathname }} to={'/login'}></Navigate>
    }

    return children
};

export default PrivateRoute;