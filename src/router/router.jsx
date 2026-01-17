import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../Pages/Home/Home/Home";
import Register from "@/Pages/Register/Register";
import Login from "@/Pages/Login/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import PrivateRoute from "@/routes/PrivateRoute";
import DashboardHome from "@/Pages/Dashboard/DashboardHome/DashboardHome";
import CreateDonation from "@/Pages/Dashboard/CreateDonation/CreateDonation";
import DonationDetails from "@/Pages/DonationDetails/DonationDetails";
import UpdateDonation from "@/Pages/Dashboard/UpdateDonation/UpdateDonation";
import DonationRequests from "@/Pages/DonationRequests/DonationRequests";

const router = createBrowserRouter([
  {
    path: "/",
    Component: HomeLayout,
    children: [
      {
        index: true,
        Component: Home
      },
      {
        path: 'donation-requests',
        Component: DonationRequests,
      },
      {
        path: 'donations/:donationId',
        element: <PrivateRoute><DonationDetails /></PrivateRoute>,
      },
      {
        path: 'register',
        Component: Register
      },
      {
        path: 'login',
        Component: Login
      },
    ]
  },
  {
    path: '/dashboard',
    element: <PrivateRoute><DashboardLayout /></PrivateRoute>,
    children: [
      {
        index: true,
        Component: DashboardHome,
      },
      {
        path: 'create-donation-request',
        Component: CreateDonation,
      },
      {
        path: 'edit-donation/:donationId',
        Component: UpdateDonation,
      },
    ]
  }
]);

export default router;