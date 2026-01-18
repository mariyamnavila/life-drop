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
import SearchPage from "@/Pages/SearchPage/SearchPage";
import MyDonationRequests from "@/Pages/Dashboard/MyDonationRequests/MyDonationRequests";
import Profile from "@/Pages/Profile/Profile";
import Unauthorized from "@/Pages/Unauthorized/Unauthorized";
import AllUsers from "@/Pages/Dashboard/AllUsers/AllUsers";

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
        path: 'search-requests',
        Component: SearchPage,
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
      {
        path: 'unauthorized',
        Component: Unauthorized,
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
        path: 'all-users',
        Component: AllUsers,
      },
      {
        path: 'my-donation-requests',
        Component: MyDonationRequests,
      },
      {
        path: 'edit-donation/:donationId',
        Component: UpdateDonation,
      },
      {
        path: 'profile',
        Component: Profile,
      },
    ]
  }
]);

export default router;