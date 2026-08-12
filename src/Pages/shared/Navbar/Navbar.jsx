import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import LifeDrop from '../../../assets/lifedrop-logo.png';
import avatar from '../../../assets/avatar.png';
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
    const { user, logOut } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    // Prevent hydration mismatch
    useEffect(() => {
        setMounted(true);
    }, []);

    const links = [
        { name: "Home", path: "/", },
        { name: "Requests", path: "/donation-requests", },
        { name: "Search Donors", path: "/search-donors", },
        { name: "Blog", path: "/blogs", },
    ];

    if (user) {
        links.push({ name: "Funding", path: "/funding", });
    }

    const handleLogOut = () => {
        Swal.fire({
            title: "Log out?",
            text: "You will be signed out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#2563eb",
            cancelButtonColor: "#6b7280"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        Swal.fire({
                            icon: "success",
                            title: "Logged out",
                            text: "You have been logged out successfully.",
                            confirmButtonColor: "#2563eb",
                            timer: 2000,
                            timerProgressBar: true
                        });
                    })
                    .catch((error) => {
                        Swal.fire({
                            icon: "error",
                            title: "Logout failed",
                            text: error?.message || "Something went wrong. Please try again.",
                            confirmButtonColor: "#dc2626"
                        });
                    });
            }
        });
    };

    return (
        <nav className="bg-bg-default/85 backdrop-blur-md border-b border-border/50 shadow-xs sticky top-0 z-50 transition-all duration-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">

                    {/* Left: Logo */}
                    <div className="flex items-center gap-2">
                        {/* Mobile menu button */}
                        <div className="md:hidden">
                            <button
                                type="button"
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="relative w-10 h-10 flex flex-col justify-center items-center rounded-lg hover:bg-bg-card border border-border/10 focus:outline-none transition-colors duration-200"
                                aria-label="Toggle Menu"
                            >
                                <div className="flex flex-col justify-between w-5 h-3.5 transition-transform duration-300">
                                    <span className={`block h-[2px] w-5 bg-text-primary rounded-full transform transition-all duration-300 origin-left ${mobileMenuOpen ? 'rotate-45 translate-x-[2px] -translate-y-[1px]' : ''}`} />
                                    <span className={`block h-[2px] w-5 bg-text-primary rounded-full transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 scale-0' : ''}`} />
                                    <span className={`block h-[2px] w-5 bg-text-primary rounded-full transform transition-all duration-300 origin-left ${mobileMenuOpen ? '-rotate-45 translate-x-[2px] translate-y-[1px]' : ''}`} />
                                </div>
                            </button>
                        </div>

                        <Link to={'/'}>
                            <img src={LifeDrop} alt="LifeDrop Logo" className="w-30 filter dark:brightness-110" />
                        </Link>

                    </div>

                    {/* Middle: Links */}
                    <div className="hidden md:flex space-x-4">
                        {links.map((link) => {
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className="flex items-center gap-1 px-2 rounded-md font-medium text-text-primary hover:text-primary transition-colors"
                                >
                                    {link.name}
                                </NavLink>
                            );
                        })}
                    </div>

                    {/* Right: Theme Toggle & Login / Avatar */}
                    <div className="flex items-center gap-4">
                        {/* Theme Toggle Button */}
                        {mounted && (
                            <button
                                type="button"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-md hover:bg-bg-card border border-border text-text-primary transition-colors focus:outline-none"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <Moon className="h-4 w-4 text-text-muted" />
                                )}
                            </button>
                        )}

                        {!user ? (
                            <Link
                                to="/login"
                                className="px-4 py-2 bg-primary hover:bg-primary-hover text-white rounded-md font-medium transition-colors"
                            >
                                Login
                            </Link>
                        ) : (
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <img
                                        src={user.photoURL || avatar}
                                        alt="User Avatar"
                                        className="w-10 h-10 rounded-full cursor-pointer border border-border object-cover focus:outline-hidden"
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-bg-default border border-border shadow-lg p-3 flex flex-col gap-1 z-50">
                                    <div className="flex items-center gap-3 px-2 py-2 mb-1 border-b border-border">
                                        <img
                                            src={user.photoURL || avatar}
                                            alt="User Avatar"
                                            className="w-9 h-9 rounded-full border border-border object-cover"
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-text-primary truncate">
                                                {user.displayName || 'User'}
                                            </span>
                                            <span className="text-xs text-text-muted truncate">
                                                {user.email}
                                            </span>
                                        </div>
                                    </div>
                                    <DropdownMenuItem asChild>
                                        <NavLink
                                            to="/dashboard"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-text-primary hover:bg-bg-card hover:text-primary transition-colors cursor-pointer w-full text-left"
                                        >
                                            Dashboard
                                        </NavLink>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <button
                                            type="button"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-text-primary hover:bg-bg-card hover:text-primary transition-colors text-left w-full cursor-pointer"
                                            onClick={handleLogOut}
                                        >
                                            Logout
                                        </button>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>
                </div>
                {mobileMenuOpen && (
                    <div className="md:hidden bg-bg-default border border-border shadow-md p-4 flex flex-col gap-2 mt-2 transition-all">
                        {user && (
                            <div className="flex items-center gap-3 px-3 py-2 mb-2">
                                <img
                                    src={user.photoURL || avatar}
                                    alt="User Avatar"
                                    className="w-10 h-10 rounded-full border border-border object-cover"
                                />
                                <div className="flex flex-col min-w-0">
                                    <span className="text-sm font-semibold text-text-primary truncate">
                                        {user.displayName || 'User'}
                                    </span>
                                    <span className="text-xs text-text-muted truncate">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        )}
                        {links.map((link) => {
                            return (
                                <NavLink
                                    key={link.path}
                                    to={link.path}
                                    className={({ isActive }) =>
                                        `flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors ${isActive
                                            ? "text-primary bg-bg-card border border-border"
                                            : "text-text-primary hover:bg-bg-card"
                                        }`
                                    }
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </NavLink>
                            );
                        })}
                        {user && (
                            <NavLink
                                to="/dashboard"
                                className="flex items-center gap-2 px-3 py-2 rounded-md font-medium transition-colors text-text-primary hover:bg-bg-card"
                                onClick={() => setMobileMenuOpen(false)}
                            >
                                Dashboard
                            </NavLink>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
}

export default Navbar;