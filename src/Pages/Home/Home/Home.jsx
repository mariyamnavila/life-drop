import AboutUs from "../AboutUs/AboutUs";
import Banner from "../Banner/Banner";
import BestService from "../BestService/BestService";
import ContactUs from "../ContactUs/ContactUs";
import Quote from "../Quote/Quote";
import Testimonials from "../Testimonials/Testimonials";
import WeHelp from "../WeHelp/WeHelp";
const Home = () => {
    return (
        <div>
            <Banner></Banner>
            <Quote></Quote>
            <AboutUs></AboutUs>
            <BestService></BestService>
            <WeHelp></WeHelp>
            <Testimonials></Testimonials>
            <ContactUs></ContactUs>
        </div>
    );
};

export default Home;
