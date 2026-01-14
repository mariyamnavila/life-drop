import { useState } from "react";
import { NavLink } from "react-router-dom";
import LifeDrop from '../../../assets/lifedrop-logo.png';
import avatar from '../../../assets/avatar.png';

const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const user = null; // Replace with actual user authentication logic

    const links = [
        { name: "Home", path: "/", },
        { name: "Donors", path: "/donors", },
        { name: "Requests", path: "/requests", },
    ];

    if (user) {
        links.push({ name: "Funding", path: "/funding", });
    }

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                onClick={() => setMenuOpen(!menuOpen)}
                                className="text-primary focus:outline-none"
                            >
                                {/* Hamburger icon */}
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2"
                                    viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                                    {menuOpen ? (
                                        <path d="M6 18L18 6M6 6l12 12" /> // X icon when open
                                    ) : (
                                        <path d="M4 6h16M4 12h16M4 18h16" /> // Hamburger icon when closed
                                    )}
                                </svg>
                            </button>
                        </div>

                        <img src={LifeDrop} alt="LifeDrop Logo" className="w-30" />
                    </div>

                    {/* Middle: Links */}
                    <div className="hidden md:flex space-x-4">
                        {links.map((link) => {
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={
                                        `flex items-center gap-1 px-2 rounded-md font-medium `
                                    }
                                >
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Right: Login / Avatar */}
                    <div className="flex items-center gap-4">
                        {!user ? (
                            <NavLink
                                to="/login"
                                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium"
                            >
                                Login
                            </NavLink>
                        ) : (
                            <div className="relative">
                                <img
                                    src={user.avatar || avatar}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full cursor-pointer"
                                    onClick={() => setMenuOpen(!menuOpen)}
                                />
                                {menuOpen && (
                                    <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md p-2 flex flex-col gap-2">
                                        <NavLink to="/profile" className="hover:text-primary">
                                            Profile
                                        </NavLink>
                                        <NavLink to="/logout" className="hover:text-primary">
                                            Logout
                                        </NavLink>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
                {menuOpen && (
                    <div className="md:hidden bg-white shadow-md p-4 flex flex-col gap-2 mt-2">
                        {links.map((link) => {
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-3 py-2 rounded-md font-medium ${isActive
                                            ? "text-primary bg-soft-red-card"
                                            : "text-text-primary hover:bg-soft-red-card"
                                        }`
                                    }
                                    onClick={() => setMenuOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;