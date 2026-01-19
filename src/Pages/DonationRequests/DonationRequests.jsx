import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import useAxios from "@/hooks/useAxios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const DonationRequests = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(6);


    const { data, isLoading } = useQuery({
        queryKey: ["pending-donations", page,limit],
        queryFn: async () => {
            const res = await axiosInstance.get(
                `/donations/pending?page=${page}&limit=${limit}`
            );
            return res.data;
        },
        keepPreviousData: true,
    });

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5">

            <div className="flex flex-col justify-center items-center mt-4 space-y-2">
                <p className="text-primary font-semibold">Blood Donation Requests</p>
                <h1 className="text-4xl font-semibold">Pending Donation Requests</h1>
                <p className="text-gray-500">Review and manage all blood donation requests that are currently awaiting donor response.</p>
            </div>

            <div className="space-y-6 mt-10">

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.donations.map((donation) => (
                        <Card
                            key={donation._id}
                            className="bg-red-50 border-red-100 shadow-sm hover:shadow-md transition"
                        >
                            <CardHeader className="flex flex-row items-center justify-between">
                                <h3 className="font-semibold text-lg">
                                    {donation.recipientName}
                                </h3>
                                <Badge variant="destructive">
                                    {donation.bloodGroup}
                                </Badge>
                            </CardHeader>

                            <CardContent className="space-y-2 text-sm text-muted-foreground">
                                <p>
                                    <span className="font-medium text-foreground">
                                        Location:
                                    </span>{" "}
                                    {donation.hospitalName}, {donation.recipientDistrict}
                                </p>
                                <p>
                                    <span className="font-medium text-foreground">
                                        Date:
                                    </span>{" "}
                                    {new Date(donation.donationDate).toLocaleDateString('en-GB', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </p>
                                <p>
                                    <span className="font-medium text-foreground">
                                        Time:
                                    </span>{" "}
                                    {donation.donationTime}
                                </p>
                            </CardContent>

                            <CardFooter>
                                <Button
                                    className="w-full"
                                    onClick={() =>
                                        navigate(`/donations/${donation._id}`)
                                    }
                                >
                                    View Details
                                </Button>
                            </CardFooter>
                        </Card>
                    ))}
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8 flex-wrap">
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
                            <SelectValue placeholder="Rows" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="6">6</SelectItem>
                            <SelectItem value="12">12</SelectItem>
                            <SelectItem value="24">24</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

            </div>
        </div>
    );
};

export default DonationRequests;
