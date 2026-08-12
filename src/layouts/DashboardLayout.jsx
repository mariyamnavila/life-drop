import { Outlet, Link } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu, Sun, Moon } from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { useTheme } from "next-themes";
import Swal from "sweetalert2";
import avatar from "@/assets/avatar.png";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const DashboardLayout = () => {
    const { user, logOut } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);
    const { theme, setTheme } = useTheme();


    const handleLogOut = () => {
        Swal.fire({
            title: "Log out?",
            text: "You will be signed out of your account.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, log out",
            cancelButtonText: "Cancel",
            confirmButtonColor: "#c10100",
            cancelButtonColor: "#6b7280"
        }).then((result) => {
            if (result.isConfirmed) {
                logOut()
                    .then(() => {
                        Swal.fire({
                            icon: "success",
                            title: "Logged out",
                            text: "You have been logged out successfully.",
                            confirmButtonColor: "#c10100",
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
        <SidebarProvider>
            <div className="flex min-h-screen w-full bg-bg-default text-text-primary">
                {/* Desktop Sidebar */}
                <DashboardSidebar />

                {/* Mobile Sidebar as Sheet */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="w-64 p-0 bg-bg-default border-r border-border">
                        <MobileSidebar onClose={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                {/* Main Content Area Container */}
                <div className="flex flex-col flex-1 min-h-screen w-full min-w-0">
                    {/* Header/Navbar */}
                    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-border bg-bg-default/85 backdrop-blur-md px-4 md:px-6 shadow-xs shrink-0">
                        {/* Left: Mobile Hamburger & Dashboard Name */}
                        <div className="flex items-center gap-3">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setMobileOpen(true)}
                                className="md:hidden text-text-primary hover:bg-bg-card"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                            <span className="font-bold text-lg text-text-primary tracking-tight">Dashboard</span>
                        </div>

                        {/* Right: Theme Toggle & Profile Dropdown */}
                        <div className="flex items-center gap-4">
                            <button
                                type="button"
                                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                                className="p-2 rounded-md hover:bg-bg-card border border-border text-text-primary transition-colors focus:outline-none cursor-pointer"
                                aria-label="Toggle Theme"
                            >
                                {theme === "dark" ? (
                                    <Sun className="h-4 w-4 text-yellow-500" />
                                ) : (
                                    <Moon className="h-4 w-4 text-text-muted" />
                                )}
                            </button>

                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <img
                                        src={user?.photoURL || avatar}
                                        alt="User Avatar"
                                        className="w-9 h-9 rounded-full cursor-pointer border border-border object-cover focus:outline-hidden"
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56 bg-bg-default border border-border shadow-lg p-3 flex flex-col gap-1 z-50">
                                    <div className="flex items-center gap-3 px-2 py-2 mb-1 border-b border-border">
                                        <img
                                            src={user?.photoURL || avatar}
                                            alt="User Avatar"
                                            className="w-9 h-9 rounded-full border border-border object-cover"
                                        />
                                        <div className="flex flex-col min-w-0">
                                            <span className="text-sm font-semibold text-text-primary truncate">
                                                {user?.displayName || 'User'}
                                            </span>
                                            <span className="text-xs text-text-muted truncate">
                                                {user?.email}
                                            </span>
                                        </div>
                                    </div>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-text-primary hover:bg-bg-card hover:text-primary transition-colors cursor-pointer w-full text-left"
                                        >
                                            Home Website
                                        </Link>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem asChild>
                                        <Link
                                            to="/dashboard/profile"
                                            className="flex items-center gap-2 px-2 py-2 rounded-md text-sm text-text-primary hover:bg-bg-card hover:text-primary transition-colors cursor-pointer w-full text-left"
                                        >
                                            My Profile
                                        </Link>
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
                        </div>
                    </header>

                    {/* Main content inset (No top margins required as the header is static) */}
                    <SidebarInset className="flex-1 w-full p-4 md:p-6 overflow-x-hidden bg-bg-default">
                        <Outlet />
                    </SidebarInset>
                </div>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
