import { Home, PlusCircle, Droplet, User, Folder, ClipboardList, Users } from "lucide-react";
import { Link, NavLink } from "react-router-dom";
import lifeDrop from '@/assets/lifedrop-logo.png';
import useAuth from "@/hooks/useAuth";
import avatar from '@/assets/avatar.png';
import { Separator } from "@/components/ui/separator";
import useUserRole from "@/hooks/useUserRole";

const MobileSidebar = ({ onClose }) => {
    const { user } = useAuth();
    const { role, isLoading } = useUserRole();

    const handleNavClick = () => {
        onClose();
    };

    const getLinkClass = ({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-all ${
            isActive
                ? "bg-primary text-white font-semibold shadow-sm"
                : "text-gray-700 hover:bg-red-50 hover:text-primary"
        }`;

    return (
        <div className="flex flex-col h-full bg-white text-gray-800">
            {/* Header */}
            <div className="px-4 py-3">
                <Link to={'/'} onClick={onClose}>
                    <img src={lifeDrop} alt="LifeDrop Logo" className="w-28 h-auto" />
                </Link>
            </div>

            <Separator />

            {/* Navigation */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                <NavLink
                    to="/dashboard"
                    end
                    onClick={handleNavClick}
                    className={getLinkClass}
                >
                    <Home className="h-5 w-5" />
                    <span className="text-current font-medium">Dashboard</span>
                </NavLink>

                {!isLoading && role === 'admin' && (
                    <NavLink
                        to="/dashboard/all-users"
                        onClick={handleNavClick}
                        className={getLinkClass}
                    >
                        <Users className="h-5 w-5" />
                        <span className="text-current font-medium">All Users</span>
                    </NavLink>
                )}

                {!isLoading && (role === 'admin' || role === 'volunteer') && (
                    <>
                        <NavLink
                            to="/dashboard/all-donation-requests"
                            onClick={handleNavClick}
                            className={getLinkClass}
                        >
                            <ClipboardList className="h-5 w-5" />
                            <span className="text-current font-medium">All Donation Requests</span>
                        </NavLink>

                        <NavLink
                            to="/dashboard/content-management"
                            onClick={handleNavClick}
                            className={getLinkClass}
                        >
                            <Folder className="h-5 w-5" />
                            <span className="text-current font-medium">Content Management</span>
                        </NavLink>
                    </>
                )}

                <NavLink
                    to="/dashboard/my-donation-requests"
                    onClick={handleNavClick}
                    className={getLinkClass}
                >
                    <Droplet className="h-5 w-5" />
                    <span className="text-current font-medium">My Donation Requests</span>
                </NavLink>

                <NavLink
                    to="/dashboard/create-donation-request"
                    onClick={handleNavClick}
                    className={getLinkClass}
                >
                    <PlusCircle className="h-5 w-5" />
                    <span className="text-current font-medium">Create Donation Request</span>
                </NavLink>

                <NavLink
                    to="/dashboard/profile"
                    onClick={handleNavClick}
                    className={getLinkClass}
                >
                    <User className="h-5 w-5" />
                    <span className="text-current font-medium">Profile</span>
                </NavLink>
            </nav>

            <Separator />

            {/* User Info Footer */}
            <div className="p-4">
                <div className="flex items-center gap-3">
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

                    <div className="flex min-w-0 flex-col">
                        <span className="truncate text-sm font-semibold text-gray-900">
                            {user?.displayName || 'User'}
                        </span>
                        <span className="truncate text-xs text-gray-500">
                            {user?.email || ''}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MobileSidebar;