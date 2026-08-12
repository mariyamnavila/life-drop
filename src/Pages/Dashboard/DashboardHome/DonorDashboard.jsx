import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/Pages/Loading/Loading";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Eye, Edit, Users, AlertCircle, CheckCircle2 } from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Badge } from "@/components/ui/badge";

const DonorDashboard = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // Query 1: Fetch recent 3 donations
    const { data: donations, isLoading, refetch } = useQuery({
        queryKey: ["recent-donations", user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/donations?email=${user.email}&limit=3`
            );
            return res.data.data;
        },
    });

    // Query 2: Fetch all my donations to calculate dashboard summary counts
    const { data: allDonations, isLoading: isAllLoading } = useQuery({
        queryKey: ["all-my-donations", user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/donations?email=${user.email}&limit=100`);
            return res.data.data;
        }
    });

    // Mutation to update donation status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ donationId, status }) => {
            const res = await axiosSecure.patch(`/donations/${donationId}/status`, { donationStatus: status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["recent-donations", user?.email]);
            queryClient.invalidateQueries(["all-my-donations", user?.email]);
        },
        onError: (err) => {
            Swal.fire("Error", err.response?.data?.message || err.message, "error");
        },
    });

    const handleUpdateStatus = (donationId, status) => {
        if (status === "canceled") {
            Swal.fire({
                title: "Are you sure?",
                text: "This donation request will be canceled!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: 'No',
                confirmButtonColor: "#dc2626",
                cancelButtonColor: "#6b7280"
            }).then((result) => {
                if (result.isConfirmed) {
                    updateStatusMutation.mutate({ donationId, status }, {
                        onSuccess: () => {
                            Swal.fire("Canceled!", "Donation request has been canceled.", "success");
                        },
                    });
                }
            });
        } else {
            updateStatusMutation.mutate({ donationId, status }, {
                onSuccess: () => {
                    Swal.fire("Success!", "Donation request has been marked as done.", "success");
                },
            });
        }
    };

    if (loading || isLoading || isAllLoading) return <Loading />;

    const handleDelete = async (donationId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This donation request will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            confirmButtonColor: "#dc2626",
            cancelButtonColor: "#6b7280"
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/donations/${donationId}`);
                Swal.fire(
                    "Deleted!",
                    "Your donation request has been deleted.",
                    "success"
                );
                refetch();
                queryClient.invalidateQueries(["all-my-donations", user?.email]);
            } catch (err) {
                Swal.fire(
                    "Error",
                    err.response?.data?.message || err.message || "Something went wrong.",
                    "error"
                );
            }
        }
    };

    // Calculate Summary Stats
    const totalRequests = allDonations?.length || 0;
    const pendingRequests = allDonations?.filter(d => d.donationStatus === "pending")?.length || 0;
    const completedRequests = allDonations?.filter(d => d.donationStatus === "done")?.length || 0;

    return (
        <div className="flex flex-col items-start justify-start p-4 md:p-6 space-y-6 w-full text-text-primary">
            <Helmet>
                <title>Donor Dashboard | Life Drop</title>
                <meta name="description" content="Manage your blood donation requests and track donation progress." />
            </Helmet>

            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold mb-1">
                    Welcome, {user?.displayName || "Donor"}!
                </h1>
                <p className="text-text-muted text-sm">
                    Manage requests, track pending details, and overview your donation impact.
                </p>
            </div>

            {/* Stats Overview Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {/* Total Requests */}
                <Card className="flex flex-col items-center justify-center p-6 bg-bg-card border border-border/40 rounded-xl text-text-primary shadow-xs">
                    <Users className="h-8 w-8 text-primary mb-2" />
                    <h2 className="text-3xl font-extrabold">{totalRequests}</h2>
                    <p className="text-xs text-text-muted mt-1.5 uppercase font-semibold tracking-wider">Requests Created</p>
                </Card>

                {/* Pending Requests */}
                <Card className="flex flex-col items-center justify-center p-6 bg-bg-card border border-border/40 rounded-xl text-text-primary shadow-xs">
                    <AlertCircle className="h-8 w-8 text-yellow-500 mb-2 animate-pulse" />
                    <h2 className="text-3xl font-extrabold">{pendingRequests}</h2>
                    <p className="text-xs text-text-muted mt-1.5 uppercase font-semibold tracking-wider">Pending Requests</p>
                </Card>

                {/* Completed Donations */}
                <Card className="flex flex-col items-center justify-center p-6 bg-bg-card border border-border/40 rounded-xl text-text-primary shadow-xs">
                    <CheckCircle2 className="h-8 w-8 text-green-500 mb-2" />
                    <h2 className="text-3xl font-extrabold">{completedRequests}</h2>
                    <p className="text-xs text-text-muted mt-1.5 uppercase font-semibold tracking-wider">Completed Pledges</p>
                </Card>
            </div>

            {/* Recent Donations Table */}
            {donations && donations.length > 0 ? (
                <div className="w-full space-y-3 pt-4">
                    <CardHeader className="px-0 py-0">
                        <CardTitle className="text-lg font-bold">Your Recent Requests</CardTitle>
                        <CardDescription>Quick overview of your 3 most recent requests</CardDescription>
                    </CardHeader>
                    <Card className="w-full overflow-x-auto py-0 rounded-lg border border-border/40">
                        <Table className="min-w-200 md:min-w-full">
                            <TableHeader>
                                <TableRow className="hover:bg-bg-card">
                                    <TableHead className="text-text-primary">Recipient Name</TableHead>
                                    <TableHead className="text-text-primary">Location</TableHead>
                                    <TableHead className="text-text-primary">Date</TableHead>
                                    <TableHead className="text-text-primary">Time</TableHead>
                                    <TableHead className="text-text-primary">Blood Group</TableHead>
                                    <TableHead className="text-text-primary">Status</TableHead>
                                    <TableHead className="text-text-primary">Donor Info</TableHead>
                                    <TableHead className="text-text-primary text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {donations.map((donation) => (
                                    <TableRow key={donation._id} className="hover:bg-bg-card">
                                        <TableCell className="font-medium">{donation.recipientName}</TableCell>
                                        <TableCell>
                                            {donation.recipientDistrict}, {donation.recipientUpazila}
                                        </TableCell>
                                        <TableCell>{new Date(donation.donationDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}</TableCell>
                                        <TableCell>{donation.donationTime}</TableCell>
                                        <TableCell className="font-semibold text-primary">{donation.bloodGroup}</TableCell>
                                        <TableCell>
                                            <Badge variant={donation.donationStatus === 'pending' ? 'outline' : 'default'} className="capitalize">
                                                {donation.donationStatus}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {donation.donationStatus !== "pending" ? (
                                                <div className="flex flex-col text-xs">
                                                    <span className="font-medium text-text-primary">{donation.donorName}</span>
                                                    <span className="text-text-muted">{donation.donorEmail}</span>
                                                </div>
                                            ) : (
                                                <span className="text-text-muted text-xs">Pending Donor</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right space-x-1.5">
                                            {donation.donationStatus === "inprogress" && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(donation._id, "done")}
                                                        disabled={updateStatusMutation.isLoading}
                                                        className="text-xs bg-green-500/10 hover:bg-green-500 hover:text-white text-green-600 border border-green-500/20"
                                                    >
                                                        Done
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(donation._id, "canceled")}
                                                        disabled={updateStatusMutation.isLoading}
                                                        className="text-xs"
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            <Link to={`/donations/${donation._id}`}>
                                                <Button variant="ghost" size="sm" className="hover:bg-bg-card">
                                                    <Eye className="h-4 w-4 text-text-primary" />
                                                </Button>
                                            </Link>
                                            <Link to={`/dashboard/edit-donation/${donation._id}`}>
                                                <Button variant="outline" size="sm" className="hover:bg-bg-card">
                                                    <Edit className="h-4 w-4 text-text-primary" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(donation._id)}
                                            >
                                                <Trash className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>
                </div>
            ) : (
                <div className="w-full p-8 border border-dashed border-border rounded-lg text-center bg-bg-card mt-4">
                    <p className="text-sm text-text-muted">
                        You have not created any donation requests yet.
                    </p>
                    <Link to="/dashboard/create-donation-request">
                        <Button className="mt-4 bg-primary text-white hover:bg-primary-hover">Create Request</Button>
                    </Link>
                </div>
            )}

            {/* View all button */}
            <div className="pt-2">
                <Link to="/dashboard/my-donation-requests">
                    <Button variant="outline" className="border border-border text-text-primary hover:bg-primary hover:text-white">
                        View My All Requests
                    </Button>
                </Link>
            </div>
        </div>
    );
};

export default DonorDashboard;
