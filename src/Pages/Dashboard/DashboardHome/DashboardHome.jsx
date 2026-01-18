import useUserRole from "@/hooks/useUserRole";
import Loading from "@/Pages/Loading/Loading";
import DonorDashboard from "./DonorDashboard";
import AdminDashboard from "./AdminDashboard";
import Unauthorized from "@/Pages/Unauthorized/Unauthorized";


const DashboardHome = () => {
    const { role, isLoading } = useUserRole();

    if (isLoading) {
        return <Loading></Loading>
    }

    if (role === 'donor') {
        return <DonorDashboard />
    // } else if (role === 'volunteer') {
    //     return <VolunteerDashboard />
    } else if (role === 'admin') {
        return <AdminDashboard />
    } else {
        return <Unauthorized />
    }
};

export default DashboardHome;