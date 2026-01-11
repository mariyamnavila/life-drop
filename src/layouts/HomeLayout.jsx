import Footer from "@/Pages/shared/Footer/Footer";
import Navbar from "@/Pages/shared/Navbar/Navbar";
import { Outlet } from "react-router-dom";

const HomeLayout = () => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default HomeLayout;