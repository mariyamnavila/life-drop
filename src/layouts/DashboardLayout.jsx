import { Outlet } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
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
            <div className="flex min-h-screen w-full">
                {/* Desktop Sidebar */}
                <DashboardSidebar />

                {/* Mobile Header with Hamburger */}
                <div className="md:hidden fixed top-0 left-0 right-0 z-40 bg-background border-b px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setMobileOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </Button>
                        <span className="font-semibold text-lg">Dashboard</span>
                    </div>
                </div>

                {/* Mobile Sidebar as Sheet */}
                <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                    <SheetContent side="left" className="w-64 p-0">
                        <MobileSidebar onClose={() => setMobileOpen(false)} />
                    </SheetContent>
                </Sheet>

                {/* Main content inset */}
                <SidebarInset className="flex-1 w-full p-4 pt-3 md:p-6 mt-16 md:mt-0 overflow-x-hidden">
                    <Outlet />
                </SidebarInset>
            </div>
        </SidebarProvider>
    );
};

export default DashboardLayout;
