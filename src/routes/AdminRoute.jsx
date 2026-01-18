import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRole";
import { Navigate } from "react-router-dom";


const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    const { role, isLoading } = useUserRole();

    if (loading || isLoading) {
        return <Loading />;
    }

    if (!user || role !== 'admin') {
        return <Navigate state={{ from: location.pathname }} to="/unauthorized" />;
    }

    return children
};

export default AdminRoute;