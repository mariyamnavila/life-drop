import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays, Clock, MapPin, Droplet, User, Hospital, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import districtsData from "@/assets/bangladesh_districts.json";
import useAxios from "@/hooks/useAxios";

const SearchPage = () => {
    const axiosInstance = useAxios();
    const [bloodGroup, setBloodGroup] = useState("");
    const [district, setDistrict] = useState("");
    const [upazila, setUpazila] = useState("");
    const [searchParams, setSearchParams] = useState(null);

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

    // TanStack Query for fetching donations
    const { data: results = [], isLoading, error } = useQuery({
        queryKey: ["donations", searchParams],
        queryFn: async () => {
            if (!searchParams) return [];

            const params = new URLSearchParams();
            if (searchParams.bloodGroup) params.append("blood_group", searchParams.bloodGroup);
            if (searchParams.district) params.append("district", searchParams.district);
            if (searchParams.upazila) params.append("upazila", searchParams.upazila);

            const response = await axiosInstance.get(`/donations/search?${params.toString()}`);
            return response.data;
        },
        enabled: searchParams !== null,
        staleTime: 30000, // 30 seconds
    });

    console.log(results);

    const handleSearch = () => {
        setSearchParams({ bloodGroup, district, upazila });
    };

    const handleReset = () => {
        setBloodGroup("");
        setDistrict("");
        setUpazila("");
        setSearchParams(null);
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800 border-yellow-300";
            case "inprogress":
                return "bg-blue-100 text-blue-800 border-blue-300";
            case "done":
                return "bg-green-100 text-green-800 border-green-300";
            case "cancelled":
                return "bg-red-100 text-red-800 border-red-300";
            default:
                return "bg-gray-100 text-gray-800 border-gray-300";
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <div className="w-full space-y-6 max-w-7xl mx-auto px-3">
            {/* Header */}
            <div className="mt-6">
                <h1 className="text-3xl font-bold text-gray-900">Search Blood Donors</h1>
                <p className="text-gray-600 mt-1">Find blood donation requests by blood group and location</p>
            </div>

            {/* Search Filters Card */}
            <Card>
                <CardHeader>
                    <CardTitle>Search Filters</CardTitle>
                    <CardDescription>Select criteria to find matching donation requests</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-4">
                        {/* Blood Group */}
                        <div className="flex-1 min-w-40">
                            <label className="text-sm font-medium mb-2 block">Blood Group</label>
                            <Select value={bloodGroup} onValueChange={setBloodGroup}>
                                <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select blood group" />
                                </SelectTrigger>
                                <SelectContent>
                                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                        <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* District */}
                        <div className="flex-1 min-w-40">
                            <label className="text-sm font-medium mb-2 block">District</label>
                            <Select value={district} onValueChange={handleDistrictChange}>
                                <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder="Select district" />
                                </SelectTrigger>
                                <SelectContent>
                                    {districtsData.map(d => (
                                        <SelectItem key={d.district_name} value={d.district_name}>
                                            {d.district_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Upazila */}
                        <div className="flex-1 min-w-40">
                            <label className="text-sm font-medium mb-2 block">Upazila</label>
                            <Select value={upazila} onValueChange={setUpazila} disabled={!district}>
                                <SelectTrigger className={'w-full'}>
                                    <SelectValue placeholder={district ? "Select upazila" : "Select district first"} />
                                </SelectTrigger>
                                <SelectContent>
                                    {upazilas.map(u => (
                                        <SelectItem key={u.id} value={u.name}>{u.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 items-end">
                            <Button onClick={handleSearch} disabled={isLoading}>
                                {isLoading ? "Searching..." : "Search"}
                            </Button>
                            <Button variant="outline" onClick={handleReset}>
                                Reset
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Error Alert */}
            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                        {error?.response?.data?.message || "Failed to fetch donation requests. Please try again."}
                    </AlertDescription>
                </Alert>
            )}

            {/* Loading State */}
            {isLoading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {[1, 2, 3].map(i => (
                        <Card key={i}>
                            <CardContent className="p-6 space-y-3">
                                <Skeleton className="h-4 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-10 w-full" />
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* No Results */}
            {!isLoading && searchParams && results.length === 0 && (
                <Card>
                    <CardContent className="p-12 text-center">
                        <Droplet className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No Results Found</h3>
                        <p className="text-gray-600">
                            No donation requests match your search criteria. Try adjusting your filters.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Initial State - Before Search */}
            {!isLoading && !searchParams && (
                <Card>
                    <CardContent className="p-12 text-center">
                        {/* <Droplet className="h-12 w-12 mx-auto text-blue-400 mb-4" /> */}
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Search</h3>
                        <p className="text-gray-600">
                            Select your search criteria above and click "Search" to find donation requests.
                        </p>
                    </CardContent>
                </Card>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
                <>
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Found {results.length} {results.length === 1 ? 'Request' : 'Requests'}
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map(request => (
                            <Card key={request._id} className="hover:shadow-lg transition-shadow">
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <div className="h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
                                                <Droplet className="h-6 w-6 text-red-600" />
                                            </div>
                                            <div>
                                                <CardTitle className="text-lg">
                                                    {request.bloodGroup}
                                                </CardTitle>
                                                <CardDescription>Blood Group</CardDescription>
                                            </div>
                                        </div>
                                        <Badge className={getStatusColor(request.donationStatus)}>
                                            {request.donationStatus}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <div className="flex items-start gap-2 text-sm">
                                        <User className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="font-medium text-gray-900">
                                                {request.recipientName}
                                            </p>
                                            <p className="text-gray-600 text-xs">Recipient</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm">
                                        <MapPin className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-gray-900">
                                                {request.recipientUpazila}, {request.recipientDistrict}
                                            </p>
                                            <p className="text-gray-600 text-xs">Location</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-2 text-sm">
                                        <Hospital className="h-4 w-4 text-gray-500 mt-0.5 shrink-0" />
                                        <div>
                                            <p className="text-gray-900">
                                                {request.hospitalName}
                                            </p>
                                            <p className="text-gray-600 text-xs">Hospital</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-2">
                                            <CalendarDays className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-900">
                                                {formatDate(request.donationDate)}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-900">
                                                {request.donationTime}
                                            </span>
                                        </div>
                                    </div>

                                    {request.requestMessage && (
                                        <div className="pt-2">
                                            <p className="text-sm text-gray-600 italic line-clamp-2">
                                                "{request.requestMessage}"
                                            </p>
                                        </div>
                                    )}

                                    <Button className="w-full mt-4" variant="default">
                                        View Details
                                    </Button>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SearchPage;