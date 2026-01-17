import { useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Loading from "@/Pages/Loading/Loading";
import Swal from "sweetalert2";
import {
    Calendar,
    Clock,
    MapPin,
    Hospital,
    User,
    Mail,
    Droplet,
    MessageSquare,
    CheckCircle2,
    AlertCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";

const DonationDetails = () => {
    const { donationId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const form = useForm({
        defaultValues: {
            donorName: user?.displayName || "",
            donorEmail: user?.email || "",
        },
    });

    // Fetch donation details
    const { data: donation, isLoading } = useQuery({
        queryKey: ["donation", donationId],
        enabled: !!donationId,
        queryFn: async () => {
            const res = await axiosSecure.get(`/donations/${donationId}`);
            return res.data;
        },
    });

    // Mutation for confirming donation (status update)
    const confirmDonationMutation = useMutation({
        mutationFn: async () => {
            const res = await axiosSecure.patch(`/donations/${donationId}`, {
                donationStatus: "inprogress",
                donorName: user.displayName,
                donorEmail: user.email,
            });
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["donation", donationId]);
            setIsDialogOpen(false);
            Swal.fire({
                icon: "success",
                title: "Success",
                text: "Donation confirmed!",
                confirmButtonColor: "#dc2626",
            });
        },
        onError: (err) => {
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err?.response?.data?.message || "Something went wrong.",
                confirmButtonColor: "#dc2626",
            });
        },
    });

    const getStatusConfig = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return {
                    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
                    icon: AlertCircle,
                    text: "Pending"
                };
            case "inprogress":
                return {
                    color: "bg-blue-100 text-blue-800 border-blue-300",
                    icon: CheckCircle2,
                    text: "In Progress"
                };
            case "done":
                return {
                    color: "bg-green-100 text-green-800 border-green-300",
                    icon: CheckCircle2,
                    text: "Completed"
                };
            case "cancelled":
                return {
                    color: "bg-red-100 text-red-800 border-red-300",
                    icon: AlertCircle,
                    text: "Cancelled"
                };
            default:
                return {
                    color: "bg-gray-100 text-gray-800 border-gray-300",
                    icon: AlertCircle,
                    text: status
                };
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
        });
    };

    const handleConfirmDonation = () => {
        confirmDonationMutation.mutate();
    };

    if (authLoading || isLoading) return <Loading />;

    if (!donation) {
        return (
            <div className="w-full p-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>Donation not found.</AlertDescription>
                </Alert>
            </div>
        );
    }

    const statusConfig = getStatusConfig(donation.donationStatus);
    const StatusIcon = statusConfig.icon;

    return (
        <div className="w-full space-y-6 max-w-7xl mx-auto px-3 mb-8">
            {/* Header Section */}
            <div className="space-y-2 mt-6">
                <h1 className="text-3xl font-bold text-gray-900">Donation Details</h1>
                <p className="text-gray-600">
                    View all the details of this blood donation request, including dates, location, and recipient information.
                </p>
            </div>

            {/* Status Alert */}
            {donation.donationStatus === "pending" && (
                <Alert className="border-yellow-300 bg-yellow-50">
                    <AlertCircle className="h-4 w-4 text-yellow-600" />
                    <AlertDescription className="text-yellow-800">
                        This donation request is pending. If you can donate, please confirm below.
                    </AlertDescription>
                </Alert>
            )}

            {donation.donationStatus === "inprogress" && (
                <Alert className="border-blue-300 bg-blue-50">
                    <CheckCircle2 className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-800">
                        A donor has been confirmed for this request.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blood Group Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto h-20 w-20 rounded-full bg-red-100 flex items-center justify-center mb-4">
                            <Droplet className="h-10 w-10 text-red-600" />
                        </div>
                        <CardTitle className="text-3xl font-bold text-red-600">
                            {donation.bloodGroup}
                        </CardTitle>
                        <CardDescription>Blood Group Needed</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex justify-center">
                            <Badge className={statusConfig.color}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusConfig.text}
                            </Badge>
                        </div>

                        <Separator />

                        <div className="space-y-3 text-sm">
                            <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Donation Date</p>
                                    <p className="font-medium">{formatDate(donation.donationDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500" />
                                <div>
                                    <p className="text-xs text-gray-500">Time</p>
                                    <p className="font-medium">{donation.donationTime}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Details Card */}
                <Card className="lg:col-span-2">
                    <CardHeader>
                        <CardTitle>Request Information</CardTitle>
                        <CardDescription>Details about the donation request</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {/* Recipient Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Recipient Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500">Name</p>
                                    <p className="font-medium">{donation.recipientName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Blood Group</p>
                                    <p className="font-medium text-red-600">{donation.bloodGroup}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Location Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500">District</p>
                                    <p className="font-medium">{donation.recipientDistrict}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Upazila</p>
                                    <p className="font-medium">{donation.recipientUpazila}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Hospital Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Hospital className="h-4 w-4" />
                                Hospital Information
                            </h3>
                            <div className="pl-6 space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500">Hospital Name</p>
                                    <p className="font-medium">{donation.hospitalName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Full Address</p>
                                    <p className="font-medium">{donation.fullAddress}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Requester Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Requester Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500">Name</p>
                                    <p className="font-medium">{donation.requesterName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500">Email</p>
                                    <p className="font-medium text-blue-600">{donation.requesterEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Donor Info (if inprogress) */}
                        {donation.donationStatus === "inprogress" && donation.donorName && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                                        Confirmed Donor
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                        <div>
                                            <p className="text-xs text-gray-500">Name</p>
                                            <p className="font-medium">{donation.donorName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500">Email</p>
                                            <p className="font-medium text-blue-600">{donation.donorEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Request Message */}
                        {donation.requestMessage && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Request Message
                                    </h3>
                                    <div className="pl-6">
                                        <p className="text-gray-700 italic bg-gray-50 p-3 rounded-md border">
                                            "{donation.requestMessage}"
                                        </p>
                                    </div>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>

            {/* Action Button */}
            {donation.donationStatus === "pending" && (
                <Card className="bg-linear-to-r from-red-50 to-pink-50 border-red-200">
                    <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 mb-1">Ready to Save a Life?</h3>
                            <p className="text-sm text-gray-600">
                                Confirm your donation and help {donation.recipientName} get the blood they need.
                            </p>
                        </div>

                        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                            <DialogTrigger asChild>
                                <Button size="lg" className="bg-red-600 hover:bg-red-700 shrink-0">
                                    Confirm Donation
                                </Button>
                            </DialogTrigger>

                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex items-center gap-2">
                                        Confirm Your Donation
                                    </DialogTitle>
                                    <DialogDescription>
                                        Please verify your information below. Once confirmed, the status will be changed to "In Progress".
                                    </DialogDescription>
                                </DialogHeader>

                                <Form {...form}>
                                    <div className="space-y-4 py-4">
                                        <FormItem>
                                            <FormLabel>Donor Name</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...form.register("donorName")}
                                                    readOnly
                                                    className="bg-gray-50"
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel>Donor Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...form.register("donorEmail")}
                                                    readOnly
                                                    className="bg-gray-50"
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <Alert className="border-blue-200 bg-blue-50">
                                            <AlertCircle className="h-4 w-4 text-blue-600" />
                                            <AlertDescription className="text-sm text-blue-800">
                                                By confirming, you commit to donating blood at the specified date and time.
                                            </AlertDescription>
                                        </Alert>
                                    </div>
                                </Form>

                                <DialogFooter className="gap-2 sm:gap-0">
                                    <Button
                                        variant="outline"
                                        onClick={() => setIsDialogOpen(false)}
                                        disabled={confirmDonationMutation.isLoading}
                                        className={'mr-2'}
                                    >
                                        Cancel
                                    </Button>
                                    <Button
                                        onClick={handleConfirmDonation}
                                        disabled={confirmDonationMutation.isLoading}
                                        className="bg-red-600 hover:bg-red-700"
                                    >
                                        {confirmDonationMutation.isLoading ? (
                                            <>
                                                <span className="animate-spin mr-2">⏳</span>
                                                Processing...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle2 className="h-4 w-4 mr-2" />
                                                Confirm Donation
                                            </>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
            )}
        </div>
    );
};

export default DonationDetails;
