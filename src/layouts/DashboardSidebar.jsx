import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
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
            onNavigate(); // Close the sheet on mobile
        }
    };

    return (
        <Sidebar collapsible="icon" className="h-full flex flex-col">
            {/* Header */}
            <SidebarHeader className="flex flex-row items-center justify-between px-4 py-3">
                {state === "expanded" || isMobile ? (
                    <Link to={'/'}>
                        <img src={lifeDrop} alt="LifeDrop Logo" className="w-30" />
                    </Link>
                ) : null}
                {!isMobile && (
                    <SidebarTrigger className={'pr-3'}>
                        <Menu className="h-5 w-5" />
                    </SidebarTrigger>
                )}
            </SidebarHeader>

            <Separator />

            {/* Navigation */}
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Dashboard">
                            <NavLink to="/dashboard" end onClick={handleNavClick}>
                                <Home />
                                <span>Dashboard</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    {/* Admin links */}

                    {
                        !isLoading && role === 'admin' && <>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="All Users">
                                    <NavLink to="/dashboard/all-users" onClick={handleNavClick}>
                                        <Users />
                                        <span>All Users</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                        </>
                    }

                    {/* admin and volunteer links */}
                    {
                        !isLoading && (role === 'admin' || role === 'volunteer') && <>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="All Donation Requests">
                                    <NavLink to="/dashboard/all-donation-requests" onClick={handleNavClick}>
                                        <ClipboardList />
                                        <span>All Donation Requests</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild tooltip="Content Management">
                                    <NavLink to="/dashboard/content-management" onClick={handleNavClick}>
                                        <Folder /> {/* lucide-react icon */}
                                        <span>Content Management</span>
                                    </NavLink>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </>

                    }

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="My Requests">
                            <NavLink to="/dashboard/my-donation-requests" onClick={handleNavClick}>
                                <Droplet />
                                <span>My Donation Requests</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Create Request">
                            <NavLink to="/dashboard/create-donation-request" onClick={handleNavClick}>
                                <PlusCircle />
                                <span>Create Donation Request</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarMenuItem>
                    <SidebarMenuButton asChild tooltip="Profile">
                        <NavLink to="/dashboard/profile" onClick={handleNavClick}>
                            <User />
                            <span>Profile</span>
                        </NavLink>
                    </SidebarMenuButton>
                </SidebarMenuItem>


            </SidebarContent>

            <Separator />

            {/* User Info Footer */}
            <Link to={'/dashboard/profile'}>
                <SidebarFooter className="p-4">
                    <div className="flex items-center gap-3">
                        <div className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted ${state === 'expanded' || isMobile ? 'left-0' : '-left-3'}`}>
                            {user?.photoURL ? (
                                <img
                                    src={user.photoURL || avatar}
                                    alt={user.displayName}
                                    className="h-full w-full object-cover"
                                />
                            ) : (
                                <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                                    {user?.displayName?.charAt(0) || 'U'}
                                </div>
                            )}
                        </div>

                        {(state === "expanded" || isMobile) && (
                            <div className="flex min-w-0 flex-col">
                                <span className="truncate text-sm font-medium">
                                    {user?.displayName || 'User'}
                                </span>
                                <span className="truncate text-xs text-muted-foreground">
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
