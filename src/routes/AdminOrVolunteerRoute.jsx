import { Navigate, useLocation } from "react-router-dom";
import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRole";
import Loading from "@/Pages/Loading/Loading";

const AdminOrVolunteerRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();
    const location = useLocation();

    if (loading || isLoading) {
        return <Loading />;
    }

    // 1️ Not logged in → login
    if (!user) {
        return (
            <Navigate
                to="/login"
                state={{ from: location.pathname }}
                replace
            />
        );
    }

    // 2️ Allowed roles
    if (role === "admin" || role === "volunteer") {
        return children;
    }

    // 3️ Logged in but wrong role
    return <Navigate to="/dashboard" replace />;
};

export default AdminOrVolunteerRoute;
