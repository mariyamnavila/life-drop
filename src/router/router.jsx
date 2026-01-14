import { createBrowserRouter } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";
import Home from "../Pages/Home/Home/Home";
import Register from "@/Pages/Register/Register";
import Login from "@/Pages/Login/Login";

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
]);

export default router;