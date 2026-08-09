import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import useAxios from "@/hooks/useAxios";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import districtsData from "@/assets/bangladesh_districts.json";
import { Helmet } from "react-helmet-async";

const DonationRequests = () => {
    const axiosInstance = useAxios();
    const navigate = useNavigate();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(6);
    const [bloodGroup, setBloodGroup] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");

    // Derive upazilas from district using useMemo
    const upazilas = useMemo(() => {
        const selectedDistrict = districtsData.find(d => d.district_name === district);
        return selectedDistrict ? selectedDistrict.upazilas : [];
    }, [district]);

    // Reset upazila when district changes
    const handleDistrictChange = (value) => {
        setDistrict(value);
        setUpazila(""); // reset upazila when district changes
    };

    const { data, isLoading } = useQuery({
        queryKey: ["pending-donations", page, limit, bloodGroup, district, upazila],
        queryFn: async () => {
            const params = new URLSearchParams({
                page: page,
                limit: limit,
            });

            if (bloodGroup) params.append("blood_group", bloodGroup);
            if (district) params.append("district", district);
            if (upazila) params.append("upazila", upazila);

            const res = await axiosInstance.get(
                `/donations/pending?${params.toString()}`
            );
            return res.data;
        },
        keepPreviousData: true,
    });

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];

    const handleReset = () => {
        setBloodGroup("");
        setDistrict("");
        setUpazila("");
        setPage(0);
    };

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {[...Array(6)].map((_, i) => (
                    <Skeleton key={i} className="h-44 rounded-xl" />
                ))}
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-5">
            <Helmet>
                <title>Blood Donation Requests | Life Drop</title>
                <meta name="description" content="Browse and respond to urgent blood donation requests near your area." />
            </Helmet>

            <div className="flex flex-col justify-center items-center mt-4 space-y-2">
                <p className="text-primary font-semibold">Blood Donation Requests</p>
                <h1 className="text-4xl font-semibold">Pending Donation Requests</h1>
                <p className="text-gray-500">Review and manage all blood donation requests that are currently awaiting donor response.</p>
            </div>

            {/* Search/Filter Section */}
            <div className="mt-8 bg-white border rounded-lg p-4 shadow-sm">
                <div className="flex flex-wrap gap-4 items-end">
                    {/* Blood Group Filter */}
                    <div className="flex-1 min-w-37.5">
                        <label className="text-sm font-medium mb-2 block">Blood Group</label>
                        <Select value={bloodGroup} onValueChange={setBloodGroup}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                    <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* District Filter */}
                    <div className="flex-1 min-w-37.5">
                        <label className="text-sm font-medium mb-2 block">District</label>
                        <Select value={district} onValueChange={handleDistrictChange}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="All Districts" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Districts</SelectItem>
                                {districtsData.map(d => (
                                    <SelectItem key={d.district_name} value={d.district_name}>
                                        {d.district_name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Upazila Filter */}
                    <div className="flex-1 min-w-37.5">
                        <label className="text-sm font-medium mb-2 block">Upazila</label>
                        <Select value={upazila} onValueChange={setUpazila} disabled={!district || district === "all"}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={district && district !== "all" ? "All Upazilas" : "Select district first"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Upazilas</SelectItem>
                                {upazilas.map(u => (
                                    <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Reset Button */}
                    <div>
                        <Button
                            variant="outline"
                            onClick={handleReset}
                            disabled={!bloodGroup && !district && !upazila}
                        >
                            Reset Filters
                        </Button>
                    </div>
                </div>
            </div>

            <div className="space-y-6 mt-10">

                {/* Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data?.donations?.map((donation) => (
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

                {/* No Results Message */}
                {data?.donations?.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500 text-lg">No donation requests found matching your filters.</p>
                        <Button variant="link" onClick={handleReset} className="mt-2">
                            Clear filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                <div className="flex items-center justify-center gap-2 mt-8 flex-wrap mb-8">
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