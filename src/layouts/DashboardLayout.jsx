import { Outlet } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashboardSidebar from "./DashboardSidebar";
import MobileSidebar from "./MobileSidebar";
import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

const DashboardLayout = () => {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                {/* Desktop Sidebar */}
                <div className="hidden md:block">
                    <DashboardSidebar />
                </div>

                {/* Mobile Header with Hamburger */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b px-4 py-3 flex items-center">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setMobileOpen(true)}
                    >
                        <Menu className="h-5 w-5" />
                    </Button>
                    <span className="ml-3 font-semibold">Dashboard</span>
                </div>

                {/* Mobile Sidebar as Sheet */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="w-64 p-0">
                        <MobileSidebar onClose={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                {/* Main content */}
                <main className="flex-1 p-4 md:p-4 mt-16 md:mt-0">
                    <Outlet />
                </main>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
