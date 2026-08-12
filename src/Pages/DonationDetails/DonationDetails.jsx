import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Loading from "@/Pages/Loading/Loading";
import Swal from "sweetalert2";
import { Helmet } from "react-helmet-async";
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
    // const navigate = useNavigate()

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
            return res.data.data;
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
                    color: "bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800",
                    icon: AlertCircle,
                    text: "Pending"
                };
            case "inprogress":
                return {
                    color: "bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-400 border-blue-300 dark:border-blue-800",
                    icon: CheckCircle2,
                    text: "In Progress"
                };
            case "done":
                return {
                    color: "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-400 border-green-300 dark:border-green-800",
                    icon: CheckCircle2,
                    text: "Completed"
                };
            case "cancelled":
                return {
                    color: "bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-400 border-red-300 dark:border-red-800",
                    icon: AlertCircle,
                    text: "Cancelled"
                };
            default:
                return {
                    color: "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-300 dark:border-gray-600",
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
            <Helmet>
                <title>{`Donation Request Details - ${donation.recipientName} (${donation.bloodGroup}) | Life Drop`}</title>
                <meta name="description" content={`Urgent blood request for ${donation.recipientName} in ${donation.recipientDistrict}. Blood Group: ${donation.bloodGroup}.`} />
            </Helmet>
            {/* Header Section */}
            <div className="space-y-2 mt-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Donation Details</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    View all the details of this blood donation request, including dates, location, and recipient information.
                </p>
            </div>

            {/* Status Alert */}
            {donation.donationStatus === "pending" && (
                <Alert className="border-yellow-300 dark:border-yellow-700 bg-yellow-50 dark:bg-yellow-900/20">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-300">
                        This donation request is pending. If you can donate, please confirm below.
                    </AlertDescription>
                </Alert>
            )}

            {donation.donationStatus === "inprogress" && (
                <Alert className="border-blue-300 dark:border-blue-700 bg-blue-50 dark:bg-blue-900/20">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300">
                        A donor has been confirmed for this request.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Blood Group Card */}
                <Card className="lg:col-span-1">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto h-20 w-20 rounded-full bg-red-100 dark:bg-red-900/40 flex items-center justify-center mb-4">
                            <Droplet className="h-10 w-10 text-red-600 dark:text-red-400" />
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
                                <Calendar className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Donation Date</p>
                                    <p className="font-medium">{formatDate(donation.donationDate)}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Time</p>
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
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Recipient Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                                    <p className="font-medium">{donation.recipientName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Blood Group</p>
                                    <p className="font-medium text-red-600">{donation.bloodGroup}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Location Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Location Details
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">District</p>
                                    <p className="font-medium">{donation.recipientDistrict}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Upazila</p>
                                    <p className="font-medium">{donation.recipientUpazila}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Hospital Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Hospital className="h-4 w-4" />
                                Hospital Information
                            </h3>
                            <div className="pl-6 space-y-2">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Hospital Name</p>
                                    <p className="font-medium">{donation.hospitalName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Full Address</p>
                                    <p className="font-medium">{donation.fullAddress}</p>
                                </div>
                            </div>
                        </div>

                        <Separator />

                        {/* Requester Info */}
                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Requester Information
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                                    <p className="font-medium">{donation.requesterName}</p>
                                </div>
                                <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                    <p className="font-medium text-blue-600">{donation.requesterEmail}</p>
                                </div>
                            </div>
                        </div>

                        {/* Donor Info (if inprogress) */}
                        {donation.donationStatus === "inprogress" && donation.donorName && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        Confirmed Donor
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                        <div>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Name</p>
                                            <p className="font-medium">{donation.donorName}</p>
                                        </div>
                                        <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Email</p>
                                            <p className="font-medium text-blue-600">{donation.donorEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Request Message */}
                        {donation.requestMessage && (
                            <>
                                <Separator className="dark:bg-slate-800" />
                                <div className="space-y-3">
                                    <h3 className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                        <MessageSquare className="h-4 w-4" />
                                        Request Message
                                    </h3>
                                    <div className="pl-6">
                                        <p className="text-gray-700 dark:text-gray-300 italic bg-gray-50 dark:bg-slate-950 p-3 rounded-md border dark:border-slate-800">
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
                <Card className="bg-linear-to-r from-red-50 to-pink-50 dark:from-slate-900 dark:to-slate-950 border-red-200 dark:border-slate-800">
                    <CardContent className="flex flex-col md:flex-row items-center justify-between p-6 gap-4">
                        <div>
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">Ready to Save a Life?</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
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
                                                    className="bg-gray-50 dark:bg-[#2a2e36]"
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <FormItem>
                                            <FormLabel>Donor Email</FormLabel>
                                            <FormControl>
                                                <Input
                                                    {...form.register("donorEmail")}
                                                    readOnly
                                                    className="bg-gray-50 dark:bg-[#2a2e36]"
                                                />
                                            </FormControl>
                                        </FormItem>

                                        <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20">
                                            <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                            <AlertDescription className="text-sm text-blue-800 dark:text-blue-300">
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
