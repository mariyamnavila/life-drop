import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRole";
import Loading from "@/Pages/Loading/Loading";
import { Navigate, useLocation } from "react-router-dom";


const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();
    const location = useLocation();

    if (loading || isLoading) {
        return <Loading />;
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/unauthorized" />;
    }

    return children
};

export default AdminRoute;