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

    if (role === 'donor') {
        return <DonorDashboard />
    } else if (role === 'admin' || role === 'volunteer') {
        return <AdminOrVolunteerDashboard />
    } else {
        return <Unauthorized />
    }
};

export default DashboardHome;