import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarTrigger,
} from "@/components/ui/sidebar";
import { useSidebar } from '@/components/ui/use-sidebar';
import { Home, PlusCircle, Droplet, Menu, User, ClipboardList, Users, Folder } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, NavLink } from "react-router-dom";
import lifeDrop from '@/assets/lifedrop-logo.png';
import useAuth from "@/hooks/useAuth";
import avatar from '@/assets/avatar.png';
import useUserRole from "@/hooks/useUserRole";

const DashboardSidebar = ({ isMobile, onNavigate }) => {
    const { state } = useSidebar();
    const { user } = useAuth();
    const { role, isLoading } = useUserRole();

    const handleNavClick = () => {
        if (isMobile && onNavigate) {
            onNavigate();
        }
    };

    const isCollapsed = state === "collapsed" && !isMobile;

    const getLinkClass = ({ isActive }) =>
        `flex items-center ${isCollapsed ? 'justify-center p-2.5' : 'gap-3 px-3 py-2'} w-full rounded-md text-sm font-medium transition-all ${
            isActive
                ? "bg-primary text-white font-semibold shadow-sm"
                : "text-gray-700 hover:bg-red-50 hover:text-primary"
        }`;

    return (
        <Sidebar collapsible="icon" className="h-full flex flex-col border-r bg-white text-gray-800">
            {/* Header */}
            <SidebarHeader className={`flex flex-row items-center px-3 py-3 ${isCollapsed ? "justify-center" : "justify-between"}`}>
                {!isCollapsed && (
                    <Link to={'/'} className="flex items-center">
                        <img src={lifeDrop} alt="LifeDrop Logo" className="w-28 h-auto" />
                    </Link>
                )}
                {!isMobile && (
                    <SidebarTrigger className="h-8 w-8 hover:bg-red-50 text-gray-700 hover:text-primary rounded-md flex items-center justify-center">
                        <Menu className="h-5 w-5" />
                    </SidebarTrigger>
                )}
            </SidebarHeader>

            <Separator />

            {/* Navigation */}
            <SidebarContent className="px-2 py-4">
                <SidebarMenu className="space-y-1">
                    {/* Dashboard */}
                    <SidebarMenuItem>
                        <NavLink
                            to="/dashboard"
                            end
                            title="Dashboard"
                            onClick={handleNavClick}
                            className={getLinkClass}
                        >
                            <Home className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>Dashboard</span>}
                        </NavLink>
                    </SidebarMenuItem>

                    {/* Admin links */}
                    {!isLoading && role === 'admin' && (
                        <SidebarMenuItem>
                            <NavLink
                                to="/dashboard/all-users"
                                end
                                title="All Users"
                                onClick={handleNavClick}
                                className={getLinkClass}
                            >
                                <Users className="h-5 w-5 shrink-0" />
                                {!isCollapsed && <span>All Users</span>}
                            </NavLink>
                        </SidebarMenuItem>
                    )}

                    {/* Admin and Volunteer links */}
                    {!isLoading && (role === 'admin' || role === 'volunteer') && (
                        <>
                            <SidebarMenuItem>
                                <NavLink
                                    to="/dashboard/all-donation-requests"
                                    end
                                    title="All Donation Requests"
                                    onClick={handleNavClick}
                                    className={getLinkClass}
                                >
                                    <ClipboardList className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span>All Donation Requests</span>}
                                </NavLink>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <NavLink
                                    to="/dashboard/content-management"
                                    end
                                    title="Content Management"
                                    onClick={handleNavClick}
                                    className={getLinkClass}
                                >
                                    <Folder className="h-5 w-5 shrink-0" />
                                    {!isCollapsed && <span>Content Management</span>}
                                </NavLink>
                            </SidebarMenuItem>
                        </>
                    )}

                    {/* My Requests */}
                    <SidebarMenuItem>
                        <NavLink
                            to="/dashboard/my-donation-requests"
                            end
                            title="My Donation Requests"
                            onClick={handleNavClick}
                            className={getLinkClass}
                        >
                            <Droplet className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>My Donation Requests</span>}
                        </NavLink>
                    </SidebarMenuItem>

                    {/* Create Request */}
                    <SidebarMenuItem>
                        <NavLink
                            to="/dashboard/create-donation-request"
                            end
                            title="Create Donation Request"
                            onClick={handleNavClick}
                            className={getLinkClass}
                        >
                            <PlusCircle className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>Create Donation Request</span>}
                        </NavLink>
                    </SidebarMenuItem>

                    {/* Profile */}
                    <SidebarMenuItem>
                        <NavLink
                            to="/dashboard/profile"
                            end
                            title="Profile"
                            onClick={handleNavClick}
                            className={getLinkClass}
                        >
                            <User className="h-5 w-5 shrink-0" />
                            {!isCollapsed && <span>Profile</span>}
                        </NavLink>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <Separator />

            {/* User Info Footer */}
            <Link to={'/dashboard/profile'}>
                <SidebarFooter className="p-3">
                    <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'gap-3'}`}>
                        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted border">
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL || avatar}
                                    alt={user.displayName || 'User'}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-semibold text-gray-700">
                                    {user?.displayName?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>

                        {!isCollapsed && (
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-semibold text-gray-900">
                                    {user?.displayName || 'User'}
                                </span>
                                <span className="truncate text-xs text-gray-500">
                                    {user?.email || ''}
                                </span>
                            </div>
                        )}
                    </div>
                </SidebarFooter>
            </Link>
        </Sidebar>
    );
};

export default DashboardSidebar;
