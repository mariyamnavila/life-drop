import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../Pages/Home/Home/Home";
import Register from "@/Pages/Register/Register";
import Login from "@/Pages/Login/Login";
import DashboardLayout from "@/layouts/DashboardLayout";
import PrivateRoute from "@/routes/PrivateRoute";
import DashboardHome from "@/Pages/Dashboard/DashboardHome/DashboardHome";

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
    ]
  }
]);

export default router;