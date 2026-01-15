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
import { Home, PlusCircle, Droplet, Menu } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Link, NavLink } from "react-router-dom";
import lifeDrop from '@/assets/lifedrop-logo.png';
import useAuth from "@/hooks/useAuth";
import avatar from '@/assets/avatar.png';

const DashboardSidebar = () => {
    const { state } = useSidebar(); // expanded | collapsed
    const { user } = useAuth()


    return (
        <Sidebar collapsible="icon">
            {/* Header */}
            <SidebarHeader className="flex flex-row items-center justify-between px-4 py-3">
                {state === "expanded" && (
                    <Link to={'/'}>
                        <img src={lifeDrop} alt="LifeDrop Logo" className="w-30" />
                    </Link>
                )}
                <SidebarTrigger className={'pr-3'}>
                    <Menu className="h-5 w-5" />
                </SidebarTrigger>
            </SidebarHeader>

            <Separator />

            {/* Navigation */}
            <SidebarContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Dashboard">
                            <NavLink to="/dashboard" >
                                <Home className={`${state === 'expanded'? 'ml-2':'ml-0'}`} />
                                <span>Dashboard</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="My Requests">
                            <NavLink to="/dashboard/my-donation-requests">
                                <Droplet />
                                <span>My Requests</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip="Create Request">
                            <NavLink to="/dashboard/create-donation-request">
                                <PlusCircle />
                                <span>Create Request</span>
                            </NavLink>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

            </SidebarContent>

            <Separator />

            {/* User Info Footer */}
            <SidebarFooter className="p-4">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className={`relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted ${state === 'expanded'? 'left-0':'-left-3'}`}>
                        {user ? (
                            <img
                                src={user.photoURL || avatar}
                                alt={user.displayName}
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-sm font-medium text-muted-foreground">
                                {user.displayName?.charAt(0)}
                            </div>
                        )}
                    </div>

                    {/* User Info */}
                    {state === "expanded" && (
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-medium">
                                {user.displayName}
                            </span>
                            <span className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </span>
                        </div>
                    )}
                </div>
            </SidebarFooter>

        </Sidebar>
    );
};

export default DashboardSidebar;
