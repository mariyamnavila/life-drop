import { NavLink } from "react-router-dom";
import logo from '@/assets/logo-with-bg.PNG';

const Footer = () => {
    return (
        <footer className="bg-primary text-white mt-12">
            {/* Top Section: Logo + Description */}
            <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 flex flex-col md:flex-row md:justify-center gap-6">
                <div className="flex items-center gap-3 flex-col md:flex-row">
                    <img src={logo} alt="LifeDrop Logo" className="w-24 rounded-lg" />
                    <p className="text-sm text-white/80">
                        LifeDrop is a community-driven blood donation platform connecting donors and those in need.
                    </p>
                </div>
            </div>

            {/* Middle Section: 3 Columns */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/20 pt-8">

                {/* Column 1: Quick Links */}
                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-white mb-2">Quick Links</h4>
                    <NavLink to="/about" className="hover:text-soft-red-card text-sm">About Us</NavLink>
                    <NavLink to="/charity" className="hover:text-soft-red-card text-sm">Charity</NavLink>
                    <NavLink to="/faq" className="hover:text-soft-red-card text-sm">FAQ</NavLink>
                    <NavLink to="/terms" className="hover:text-soft-red-card text-sm">Terms & Conditions</NavLink>
                </div>

                {/* Column 2: Useful Links */}
                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-white mb-2">Useful Links</h4>
                    <NavLink to="/" className="hover:text-soft-red-card text-sm">Home</NavLink>
                    <NavLink to="/donors" className="hover:text-soft-red-card text-sm">Donors</NavLink>
                    <NavLink to="/requests" className="hover:text-soft-red-card text-sm">Requests</NavLink>
                    <NavLink to="/funding" className="hover:text-soft-red-card text-sm">Funding</NavLink>
                </div>

                {/* Column 3: Subscribe Form */}
                <div className="flex flex-col gap-2">
                    <h4 className="font-semibold text-white mb-2">Subscribe Us</h4>
                    <p className="text-sm text-white/80 mb-2">
                        Signup for regular newsletter and stay up to date with our latest news.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-2">
                        <input
                            type="email"
                            placeholder="Enter Your Email"
                            className="px-3 py-2 rounded-md flex-1 text-black bg-white/90 focus:outline-none focus:ring-2 focus:ring-white transition"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-white text-primary font-semibold rounded-md hover:bg-white hover:text-primary"
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>

            {/* Bottom Section: Copyright */}
            <div className="border-t border-white/20 mt-4 py-4 text-center text-sm text-white/60">
                © {new Date().getFullYear()} LifeDrop. All rights reserved.
            </div>
        </footer>
    );
}

export default Footer;