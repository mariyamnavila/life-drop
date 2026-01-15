import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = () => {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-muted/40">
                <DashboardSidebar />

                <main className="flex-1">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
