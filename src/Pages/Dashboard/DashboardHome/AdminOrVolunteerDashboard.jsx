import React from "react";
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, DollarSign, Droplet } from "lucide-react";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import useUserRole from "@/hooks/useUserRole";
import { Helmet } from "react-helmet-async";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend
} from "recharts";

const STATUS_COLORS = {
    pending: "#eab308",       // Amber
    inprogress: "#3b82f6",    // Blue
    done: "#10b981",          // Green
    cancelled: "#ef4444",     // Red
};

const AdminOrVolunteerDashboard = () => {
    const axiosSecure = useAxiosSecure();
    const { role, isLoading: roleLoading } = useUserRole();

    // Fetch statistics
    const { data, isLoading } = useQuery({
        queryKey: ["admin-stats"],
        queryFn: async () => {
            const res = await axiosSecure.get("/admin/dashboard-stats");
            return res.data.data;
        },
    });

    if (isLoading || roleLoading) {
        return (
            <div className="p-6 space-y-6">
                <Skeleton className="h-8 w-64 mb-2" />
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-36 w-full rounded-xl" />
                    ))}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
                    {[...Array(2)].map((_, i) => (
                        <Skeleton key={i} className="h-96 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        );
    }

    const isAdmin = role === 'admin';

    // Map status data for Recharts Pie Chart
    const statusChartData = data?.donationsByStatus?.map(item => {
        const id = item._id?.toLowerCase() || 'pending';
        let name = "Pending";
        if (id === "inprogress") name = "In Progress";
        if (id === "done" || id === "completed") name = "Completed";
        if (id === "cancelled") name = "Cancelled";

        return {
            name,
            value: item.count,
            color: STATUS_COLORS[id] || "#6b7280"
        };
    }) || [];

    // Map blood group data for Recharts Bar Chart
    const bloodGroupChartData = data?.donationsByBloodGroup?.map(item => ({
        group: item._id || "Unknown",
        count: item.count
    })).sort((a, b) => b.count - a.count) || [];

    return (
        <div className="p-6 max-w-7xl mx-auto space-y-8 text-text-primary">
            <Helmet>
                <title>{`${isAdmin ? 'Admin' : 'Volunteer'} Dashboard Overview | Life Drop`}</title>
                <meta
                    name="description"
                    content={
                        isAdmin
                            ? "View platform stats, manage blood requests, users, and funding."
                            : "Manage blood requests, create blogs, and view platform statistics."
                    }
                />
            </Helmet>

            {/* Welcome Section */}
            <div>
                <h1 className="text-2xl font-bold mb-1">
                    Welcome, {isAdmin ? 'Admin!' : 'Volunteer!'}
                </h1>
                <p className="text-text-muted text-sm">
                    This is your {isAdmin ? 'admin' : 'volunteer'} dashboard overview. Here you can track system aggregates, active queries, and blood bank status.
                </p>
            </div>

            {/* Statistics Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Total Users */}
                <Card className="flex flex-col items-center justify-center p-6 bg-bg-card border border-border/40 rounded-xl shadow-xs">
                    <CardHeader className="flex flex-col items-center p-0 text-center">
                        <Users className="h-10 w-10 text-blue-500 mb-2" />
                        <h2 className="text-3xl font-extrabold text-center">{data.totalUsers}</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider text-center">Total Registered Users</p>
                    </CardHeader>
                </Card>

                {/* Total Funding */}
                <Card className="flex flex-col items-center justify-center p-6 bg-bg-card border border-border/40 rounded-xl shadow-xs">
                    <CardHeader className="flex flex-col items-center p-0 text-center">
                        <DollarSign className="h-10 w-10 text-green-500 mb-2" />
                        <h2 className="text-3xl font-extrabold text-center">${data.totalFunds}</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider text-center">Total Funding Collected</p>
                    </CardHeader>
                </Card>

                {/* Total Blood Donations */}
                <Card className="flex flex-col items-center justify-center p-6 bg-bg-card border border-border/40 rounded-xl shadow-xs">
                    <CardHeader className="flex flex-col items-center p-0 text-center">
                        <Droplet className="h-10 w-10 text-primary mb-2" />
                        <h2 className="text-3xl font-extrabold text-center">{data.totalDonations}</h2>
                        <p className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wider text-center">Total Requests Created</p>
                    </CardHeader>
                </Card>
            </div>

            {/* Visual Analytics / Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Donations by Status Card */}
                <Card className="p-6 border border-border/40 shadow-xs bg-bg-card text-text-primary rounded-xl flex flex-col h-100">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-bold">Donations by Status</CardTitle>
                        <CardDescription className="text-xs">Breakdown of all registered blood request statuses</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 w-full flex items-center justify-center min-h-0">
                        {statusChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={statusChartData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={80}
                                        paddingAngle={5}
                                        dataKey="value"
                                    >
                                        {statusChartData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                                    <Legend verticalAlign="bottom" align="center" iconType="circle" />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-6 text-text-muted text-sm">No status data available.</div>
                        )}
                    </CardContent>
                </Card>

                {/* Donations by Blood Group Card */}
                <Card className="p-6 border border-border/40 shadow-xs bg-bg-card text-text-primary rounded-xl flex flex-col h-100">
                    <CardHeader className="p-0 mb-4">
                        <CardTitle className="text-lg font-bold">Donations by Blood Group</CardTitle>
                        <CardDescription className="text-xs">Total request volume per required blood group</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 w-full min-h-0">
                        {bloodGroupChartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={bloodGroupChartData}>
                                    <XAxis dataKey="group" stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                                    <YAxis stroke="var(--text-muted)" fontSize={11} tickLine={false} />
                                    <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                                    <Bar dataKey="count" fill="#c10100" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="text-center py-6 text-text-muted text-sm">No blood group data available.</div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AdminOrVolunteerDashboard;
