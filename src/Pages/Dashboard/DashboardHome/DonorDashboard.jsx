import React from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/Pages/Loading/Loading";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Trash, Eye, Edit } from "lucide-react";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const DonorDashboard = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    // http://localhost:5000/donations?email=ayesha.rahman@example.com&limit=3

    const { data: donations, isLoading } = useQuery({
        queryKey: ["recent-donations", user?.email],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const res = await axiosSecure.get(
                `/donations?email=${user.email}&limit=3`
            );
            return res.data.donations;
        },
    });

    // Mutation to update donation status
    const updateStatusMutation = useMutation({
        mutationFn: async ({ donationId, status }) => {
            const res = await axiosSecure.patch(`/donations/${donationId}/status`, { donationStatus: status });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["recent-donations", user?.email]);
        },
        onError: (err) => {
            Swal.fire("Error", err.response?.data?.message || err.message, "error");
        },
    });

    const handleUpdateStatus = (donationId, status) => {
        if (status === "canceled") {
            // Ask for confirmation only for Cancel
            Swal.fire({
                title: "Are you sure?",
                text: "This donation request will be canceled!",
                icon: "warning",
                showCancelButton: true,
                confirmButtonText: "Yes, cancel it!",
                cancelButtonText: 'No'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Proceed to update
                    updateStatusMutation.mutate({ donationId, status }, {
                        onSuccess: () => {
                            Swal.fire("Canceled!", "Donation request has been canceled.", "success");
                        },
                    });
                }
            });
        } else {
            // For Done, directly update
            updateStatusMutation.mutate({ donationId, status }, {
                onSuccess: () => {
                    Swal.fire("Success!", "Donation request has been marked as done.", "success");
                },
            });
        }
    };


    if (loading || isLoading) return <Loading />;


    const handleDelete = async (donationId) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "This donation request will be deleted!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await axiosSecure.delete(`/donations/${donationId}`);
                Swal.fire(
                    "Deleted!",
                    "Your donation request has been deleted.",
                    "success"
                );
            } catch (err) {
                Swal.fire(
                    "Error",
                    err.response?.data?.message || err.message || "Something went wrong.",
                    "error"
                );
            }
        }
    };

    return (
        <div className="flex flex-col items-start justify-start p-4 md:p-6 space-y-6 w-full">
            <h1 className="text-2xl font-bold mb-2">
                Welcome, {user?.displayName || user?.name || "Donor"}!
            </h1>
            <p className="text-muted-foreground mb-4">
                This is your donor dashboard. You can manage your donation requests from
                here.
            </p>

            {donations && donations.length > 0 ? (
                <>
                    <CardHeader className={'w-full px-0 mt-3'}>
                        <CardTitle className={'text-xl'}>Your recent donation</CardTitle>
                        <CardDescription>Here are your 3 most recent blood donations for quick reference.</CardDescription>
                    </CardHeader>
                    <Card className="w-full overflow-x-auto py-0 rounded-lg">
                        <Table className="min-w-200 md:min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Recipient Name</TableHead>
                                    <TableHead>Location</TableHead>
                                    <TableHead>Date</TableHead>
                                    <TableHead>Time</TableHead>
                                    <TableHead>Blood Group</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead>Donor Info</TableHead>
                                    <TableHead>Actions</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {donations.map((donation) => (
                                    <TableRow key={donation._id}>
                                        <TableCell>{donation.recipientName}</TableCell>
                                        <TableCell>
                                            {donation.recipientDistrict}, {donation.recipientUpazila}
                                        </TableCell>
                                        <TableCell>{new Date(donation.donationDate).toLocaleDateString('en-GB', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                        })}</TableCell>
                                        <TableCell>{donation.donationTime}</TableCell>
                                        <TableCell>{donation.bloodGroup}</TableCell>
                                        <TableCell>{donation.donationStatus}</TableCell>
                                        <TableCell>
                                            {donation.donationStatus !== "pending" ? (
                                                <div>
                                                    {donation.donorName} ({donation.donorEmail})
                                                </div>
                                            ) : 'pending'}
                                        </TableCell>
                                        <TableCell className="space-x-2">
                                            {donation.donationStatus === "inprogress" && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(donation._id, "done")}
                                                        disabled={updateStatusMutation.isLoading}
                                                    >
                                                        Done
                                                    </Button>
                                                    <Button
                                                        variant="destructive"
                                                        size="sm"
                                                        onClick={() => handleUpdateStatus(donation._id, "canceled")}
                                                        disabled={updateStatusMutation.isLoading}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                            <Link to={`/donation/${donation._id}`}>
                                                <Button variant="ghost" size="sm">
                                                    <Eye className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Link to={`/dashboard/edit-donation/${donation._id}`}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="h-4 w-4" />
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
                </>
            ) : (
                <p className="text-sm text-muted-foreground">
                    You have no recent donation requests.
                </p>
            )}

            {/* View all button */}
            <Link to="/dashboard/my-donation-requests">
                <Button variant="outline" className="mt-2 hover:bg-primary hover:text-white">
                    View My All Requests
                </Button>
            </Link>
        </div>
    );
};

export default DonorDashboard;
