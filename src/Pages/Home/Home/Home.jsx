import { Helmet } from "react-helmet-async";
import AboutUs from "../AboutUs/AboutUs";
import Banner from "../Banner/Banner";
import BestService from "../BestService/BestService";
import ContactUs from "../ContactUs/ContactUs";
import Quote from "../Quote/Quote";
import Testimonials from "../Testimonials/Testimonials";
import WeHelp from "../WeHelp/WeHelp";
import FAQ from "../FAQ/FAQ";

const Home = () => {
    return (
        <div>
            <Helmet>
                <title>Life Drop | Blood Donation & Life Saving Platform</title>
                <meta name="description" content="Connect with blood donors near you and save lives with Life Drop." />
            </Helmet>
            <Banner />
            <Quote />
            <AboutUs />
            <BestService />
            <WeHelp />
            <Testimonials />
            <FAQ />
            <ContactUs />
        </div>
    );
};

export default Home;
