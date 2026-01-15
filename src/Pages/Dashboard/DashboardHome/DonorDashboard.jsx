import React from "react";
import useAuth from "@/hooks/useAuth";
import Loading from "@/Pages/Loading/Loading";

const DonorDashboard = () => {
    const { user, loading } = useAuth();

    if (loading) return <Loading />;

    return (
        <div className="flex flex-col items-start justify-start p-6">
            <h1 className="text-2xl font-bold mb-2">
                Welcome, {user?.displayName || user?.name || "Donor"}!
            </h1>
            <p className="text-muted-foreground">
                This is your donor dashboard. You can manage your donation requests from here.
            </p>
        </div>
    );
};

export default DonorDashboard;
