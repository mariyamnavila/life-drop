import { Home, PlusCircle, Droplet, User, Folder, ClipboardList, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import lifeDrop from '@/assets/lifedrop-logo.png';
import useAuth from "@/hooks/useAuth";
import avatar from '@/assets/avatar.png';
import { Separator } from "@/components/ui/separator";
import useUserRole from "@/hooks/useUserRole";

const MobileSidebar = ({ onClose }) => {
    const { user } = useAuth();
    const { role, isLoading } = useUserRole()

    const handleNavClick = () => {
        onClose();
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Header */}
            <div className="px-4 py-3">
                <Link to={'/'} onClick={onClose}>
                    <img src={lifeDrop} alt="LifeDrop Logo" className="w-30" />
                </Link>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4">
                <div className="space-y-1">
                    <NavLink
                        to="/dashboard"
                        end
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`
                        }
                    >
                        <Home className="h-5 w-5" />
                        <span>Dashboard</span>
                    </NavLink>

                    {
                        !isLoading && role === 'admin' && <>
                            <NavLink
                                to="/dashboard/all-users"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`
                                }
                            >
                                <Users className="h-5 w-5" />
                                <span>All Users</span>
                            </NavLink>

                        </>
                    }

                    {/* admin and volunteer links */}
                    {
                        !isLoading && (role === 'admin' || role === 'volunteer') && <>
                            <NavLink
                                to="/dashboard/all-donation-requests"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`
                                }
                            >
                                <ClipboardList className="h-5 w-5" />
                                <span>All Donation Requests</span>
                            </NavLink>

                            <NavLink
                                to="/dashboard/content-management"
                                onClick={handleNavClick}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                        ? 'bg-accent text-accent-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                    }`
                                }
                            >
                                <Folder className="h-5 w-5" />
                                <span>Content Management</span>
                            </NavLink>
                        </>

                    }

                    <NavLink
                        to="/dashboard/my-donation-requests"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`
                        }
                    >
                        <Droplet className="h-5 w-5" />
                        <span>My Donation Requests</span>
                    </NavLink>

                    <NavLink
                        to="/dashboard/create-donation-request"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`
                        }
                    >
                        <PlusCircle className="h-5 w-5" />
                        <span>Create Donation Request</span>
                    </NavLink>
                    <NavLink
                        to="/dashboard/profile"
                        onClick={handleNavClick}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive
                                ? 'bg-accent text-accent-foreground'
                                : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                            }`
                        }
                    >
                        <User className="h-5 w-5" />
                        <span>Profile</span>
                    </NavLink>
                </div>
            </nav>

            <Separator />

            {/* User Info Footer */}
            <div className="p-4">
                <div className="flex items-center gap-3">
                    <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full bg-muted">
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

                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-medium">
                            {user?.displayName || 'User'}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                            {user?.email || ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileSidebar;