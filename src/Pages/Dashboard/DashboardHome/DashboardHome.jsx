import useUserRole from "@/hooks/useUserRole";
import Loading from "@/Pages/Loading/Loading";
import DonorDashboard from "./DonorDashboard";
import AdminOrVolunteerDashboard from "./AdminOrVolunteerDashboard";
import Unauthorized from "@/Pages/Unauthorized/Unauthorized";


const DashboardHome = () => {
    const { role, isLoading } = useUserRole();

    if (isLoading) {
        return <Loading></Loading>
    }

    if (role === 'admin' || role === 'volunteer') {
        return <AdminOrVolunteerDashboard />
    }

    return <DonorDashboard />
};

export default DashboardHome;