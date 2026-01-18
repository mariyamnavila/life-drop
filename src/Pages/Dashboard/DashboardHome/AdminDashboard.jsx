import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Droplet } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";

const AdminDashboard = () => {
    const axiosSecure = useAxiosSecure();

    // Fetch statistics
    const { data, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/dashboard-stats");
            return res.data;
        },
    });

    if (isLoading) {
        return (
            <div className="p-6">
                <Skeleton className="h-8 w-64 mb-6" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-36 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">
                    Welcome, Admin!
                </h1>
                <p className="text-muted-foreground">
                    This is your admin dashboard. Here you can see the platform statistics and manage users, donations, and funding.
                </p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <Card className="flex flex-col items-center justify-center p-6 bg-blue-50 border-blue-100">
                    <CardHeader className="flex flex-col items-center">
                        <Users className="h-10 w-10 text-blue-600 mb-2" />
                        <h2 className="text-3xl font-bold">{data.totalUsers}</h2>
                        <p className="text-muted-foreground mt-1 text-center">Total Users</p>
                    </CardHeader>
                </Card>

                {/* Total Funding */}
                <Card className="flex flex-col items-center justify-center p-6 bg-green-50 border-green-100">
                    <CardHeader className="flex flex-col items-center">
                        <DollarSign className="h-10 w-10 text-green-600 mb-2" />
                        <h2 className="text-3xl font-bold">${data.totalFunds}</h2>
                        <p className="text-muted-foreground mt-1 text-center">Total Funding</p>
                    </CardHeader>
                </Card>

                {/* Total Blood Donations */}
                <Card className="flex flex-col items-center justify-center p-6 bg-red-50 border-red-100">
                    <CardHeader className="flex flex-col items-center">
                        <Droplet className="h-10 w-10 text-red-600 mb-2" />
                        <h2 className="text-3xl font-bold">{data.totalDonations}</h2>
                        <p className="text-muted-foreground mt-1 text-center">Total Blood Requests</p>
                    </CardHeader>
                </Card>
            </div>
        </div>
    );
};

export default AdminDashboard;
