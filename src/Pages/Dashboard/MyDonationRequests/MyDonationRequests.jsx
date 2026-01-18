import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import Loading from "@/Pages/Loading/Loading";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Eye, Trash } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";


const MyDonationRequests = () => {
    const { user, loading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);
    const [status, setStatus] = useState('all')

    const { data, isLoading } = useQuery({
        queryKey: ["recent-donations", user?.email, page, limit, status],
        enabled: !!user?.email && !loading,
        queryFn: async () => {
            const query = new URLSearchParams({
                email: user.email,
                page,
                limit,
            });

            if (status !== "all") {
                query.append("status", status);
            }

            const res = await axiosSecure.get(`/donations?${query.toString()}`);
            return res.data;
        },
        keepPreviousData: true,
    });


    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];

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
        <div className="">
            <div className="mt-3 mb-5 flex flex-col md:flex-row items-center justify-between mr-3">
                <h1 className="text-2xl font-semibold">Your Donation Requests</h1>
                <Select
                    value={status}
                    onValueChange={(val) => {
                        setStatus(val);
                        setPage(0);
                    }}
                >
                    <SelectTrigger className="w-34">
                        <SelectValue placeholder="Status" className="text-center text-black truncate" />
                    </SelectTrigger>
                    <SelectContent >
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="inprogress">In Progress</SelectItem>
                        <SelectItem value="done">Done</SelectItem>
                        <SelectItem value="canceled">Canceled</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            {data.donations && data.donations.length > 0 ? (
                <>
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
                                {data.donations.map((donation) => (
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
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{donation.donorName}</span>
                                                    <span className="text-sm text-muted-foreground">{donation.donorEmail}</span>
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
                                            <Link to={`/donations/${donation._id}`}>
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
                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap  sticky bottom-0 bg-white py-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </Button>

                        {pages.map(p => (
                            <Button
                                key={p}
                                size="sm"
                                variant={page === p ? "default" : "outline"}
                                onClick={() => setPage(p)}
                            >
                                {p + 1}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>

                        <Select
                            value={String(limit)}
                            onValueChange={(val) => {
                                setLimit(Number(val));
                                setPage(0);
                            }}
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rows" className="text-center text-black truncate" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            ) : (
                <div className="min-h-screen flex justify-center items-center">
                    <p className="text-lg text-muted-foreground">
                        You don't have donation requests here.
                    </p>
                </div>
            )}
        </div>
    );
};

export default MyDonationRequests;