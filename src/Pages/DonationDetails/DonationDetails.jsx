import { useState, useEffect } from "react";
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
    AlertCircle,
    Info,
    Phone,
    Loader2
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
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
    const navigate = useNavigate();

    const form = useForm({
        defaultValues: {
            donorName: user?.displayName || "",
            donorEmail: user?.email || "",
        },
    });

    // Reset form values dynamically when user loads
    useEffect(() => {
        if (user) {
            form.setValue("donorName", user.displayName || "");
            form.setValue("donorEmail", user.email || "");
        }
    }, [user, form]);

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
        <div className="w-full space-y-6 max-w-7xl mx-auto px-4 mb-12">
            <Helmet>
                <title>{`Donation Request Details - ${donation.recipientName} (${donation.bloodGroup}) | Life Drop`}</title>
                <meta name="description" content={`Urgent blood request for ${donation.recipientName} in ${donation.recipientDistrict}. Blood Group: ${donation.bloodGroup}.`} />
            </Helmet>

            {/* Header Section */}
            <div className="space-y-2 mt-6">
                <h1 className="text-3xl font-bold text-text-primary">Donation Details</h1>
                <p className="text-text-muted">
                    Review specifications, surgical details, and patient requirements below.
                </p>
            </div>

            {/* Status Alert */}
            {donation.donationStatus === "pending" && (
                <Alert className="border-yellow-300 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/10">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertDescription className="text-yellow-800 dark:text-yellow-300 font-medium">
                        This donation request is currently pending. If you are eligible and willing to donate, please confirm below.
                    </AlertDescription>
                </Alert>
            )}

            {donation.donationStatus === "inprogress" && (
                <Alert className="border-blue-300 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
                    <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    <AlertDescription className="text-blue-800 dark:text-blue-300 font-medium">
                        A donor has been confirmed for this request. Status is In Progress.
                    </AlertDescription>
                </Alert>
            )}

            {/* Main Content Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">

                {/* Left/Main Column: Request Details, Description & Contact */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Section 1: Description Panel */}
                    <Card className="border border-border/40 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <MessageSquare className="h-5 w-5 text-primary" />
                                Description & Message
                            </CardTitle>
                            <CardDescription>Requester notes and patient condition summary</CardDescription>
                        </CardHeader>
                        <CardContent className="text-text-primary">
                            <div className="border-l-4 border-primary/50 bg-bg-card p-4 rounded-r-md italic">
                                <p className="leading-relaxed">
                                    "{donation.requestMessage || 'No specific description provided by requester.'}"
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 2: Key Specifications (Recipient, Location, Hospital) */}
                    <Card className="border border-border/40 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <Info className="h-5 w-5 text-primary" />
                                Key Specifications
                            </CardTitle>
                            <CardDescription>Essential details of the blood donation request</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            {/* Recipient Details */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-text-primary flex items-center gap-2 text-sm border-b border-border/30 pb-1.5">
                                    <User className="h-4 w-4 text-primary" />
                                    Recipient Info
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 text-sm">
                                    <div>
                                        <p className="text-xs text-text-muted">Recipient Name</p>
                                        <p className="font-medium text-text-primary mt-0.5">{donation.recipientName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Required Blood Group</p>
                                        <p className="font-semibold text-primary mt-0.5">{donation.bloodGroup}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Location Details */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-text-primary flex items-center gap-2 text-sm border-b border-border/30 pb-1.5">
                                    <MapPin className="h-4 w-4 text-primary" />
                                    Location Details
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pl-6 text-sm">
                                    <div>
                                        <p className="text-xs text-text-muted">District</p>
                                        <p className="font-medium text-text-primary mt-0.5">{donation.recipientDistrict}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Upazila</p>
                                        <p className="font-medium text-text-primary mt-0.5">{donation.recipientUpazila}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Full Address</p>
                                        <p className="font-medium text-text-primary mt-0.5">{donation.fullAddress}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Hospital Details */}
                            <div className="space-y-3">
                                <h4 className="font-semibold text-text-primary flex items-center gap-2 text-sm border-b border-border/30 pb-1.5">
                                    <Hospital className="h-4 w-4 text-primary" />
                                    Hospital Information
                                </h4>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pl-6 text-sm">
                                    <div>
                                        <p className="text-xs text-text-muted">Hospital Name</p>
                                        <p className="font-medium text-text-primary mt-0.5">{donation.hospitalName}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs text-text-muted">Schedule</p>
                                        <p className="font-medium text-text-primary mt-0.5 flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5 text-primary" />
                                            {formatDate(donation.donationDate)} at {donation.donationTime}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Section 3: Requester Information */}
                    <Card className="border border-border/40 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-xl flex items-center gap-2">
                                <User className="h-5 w-5 text-primary" />
                                Requester & Contact
                            </CardTitle>
                            <CardDescription>Details of the person requesting blood</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-2">
                                <div>
                                    <p className="text-xs text-text-muted font-medium mb-1">Name</p>
                                    <p className="font-semibold text-text-primary">{donation.requesterName}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-text-muted font-medium mb-1">Email Address</p>
                                    <p className="font-semibold text-primary break-all">{donation.requesterEmail}</p>
                                </div>
                            </div>

                            {/* Confirmed Donor details */}
                            {donation.donationStatus === "inprogress" && donation.donorName && (
                                <div className="mt-6 pt-6 border-t border-border/30">
                                    <h4 className="font-semibold text-text-primary flex items-center gap-2 mb-4 text-sm">
                                        <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                                        Confirmed Donor Information
                                    </h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pl-2">
                                        <div>
                                            <p className="text-xs text-text-muted font-medium mb-1">Donor Name</p>
                                            <p className="font-semibold text-text-primary">{donation.donorName}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-muted font-medium mb-1">Donor Email Address</p>
                                            <p className="font-semibold text-primary break-all">{donation.donorEmail}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Blood Group Highlight & Pledge Action */}
                <div className="space-y-6 lg:sticky lg:top-24 h-fit">

                    {/* Quick Specs Highlight */}
                    <Card className="border border-border/40 shadow-xs">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold">Request Summary</CardTitle>
                            <CardDescription>Quick overview status</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="bg-bg-card border border-border/30 rounded-lg p-5 flex flex-col items-center justify-center text-center">
                                <div className="h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center mb-3 shrink-0">
                                    <Droplet className="h-7 w-7 text-primary animate-pulse" />
                                </div>
                                <span className="text-4xl font-extrabold text-primary">{donation.bloodGroup}</span>
                                <span className="text-xs text-text-muted mt-1 uppercase font-semibold tracking-wide">Required Blood Group</span>
                                <Badge className={`mt-3 ${statusConfig.color} font-semibold border`}>
                                    <StatusIcon className="h-3 w-3 mr-1" />
                                    {statusConfig.text}
                                </Badge>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Action Card */}
                    {donation.donationStatus === "pending" && (
                        <Card className="border border-border/40 shadow-xs bg-bg-card">
                            <CardContent className="p-6 flex flex-col items-stretch gap-4 text-center">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-text-primary text-lg">Ready to Save a Life?</h3>
                                    <p className="text-xs text-text-muted">
                                        Click confirm below to pledge your donation for {donation.recipientName}.
                                    </p>
                                </div>

                                {!user ? (
                                    <Button
                                        size="lg"
                                        className="w-full bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
                                        onClick={() => {
                                            Swal.fire({
                                                title: "Login Required",
                                                text: "You must be logged in to confirm a blood donation request.",
                                                icon: "info",
                                                showCancelButton: true,
                                                confirmButtonText: "Go to Login",
                                                cancelButtonText: "Cancel",
                                                confirmButtonColor: "#dc2626",
                                                cancelButtonColor: "#6b7280"
                                            }).then((result) => {
                                                if (result.isConfirmed) {
                                                    navigate("/login", { state: { from: `/donations/${donationId}` } });
                                                }
                                            });
                                        }}
                                    >
                                        Confirm Donation
                                    </Button>
                                ) : (
                                    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                        <DialogTrigger asChild>
                                            <Button size="lg" className="w-full bg-primary hover:bg-primary-hover text-white font-semibold transition-colors">
                                                Confirm Donation
                                            </Button>
                                        </DialogTrigger>

                                        <DialogContent className="sm:max-w-md bg-bg-default border border-border">
                                            <DialogHeader>
                                                <DialogTitle className="flex items-center gap-2 text-text-primary text-lg font-bold">
                                                    Confirm Your Donation
                                                </DialogTitle>
                                                <DialogDescription className="text-text-muted text-sm">
                                                    Please verify your information below. Once confirmed, the status will be changed to "In Progress".
                                                </DialogDescription>
                                            </DialogHeader>

                                            <Form {...form}>
                                                <div className="space-y-4 py-4 text-text-primary">
                                                    <FormItem>
                                                        <FormLabel className="text-text-primary font-medium">Donor Name</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...form.register("donorName")}
                                                                readOnly
                                                                className="bg-bg-card border border-border text-text-primary"
                                                            />
                                                        </FormControl>
                                                    </FormItem>

                                                    <FormItem>
                                                        <FormLabel className="text-text-primary font-medium">Donor Email</FormLabel>
                                                        <FormControl>
                                                            <Input
                                                                {...form.register("donorEmail")}
                                                                readOnly
                                                                className="bg-bg-card border border-border text-text-primary"
                                                            />
                                                        </FormControl>
                                                    </FormItem>

                                                    <Alert className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10">
                                                        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                        <AlertDescription className="text-xs text-blue-800 dark:text-blue-300 font-medium">
                                                            By confirming, you commit to donating blood at the specified date and time.
                                                        </AlertDescription>
                                                    </Alert>
                                                </div>
                                            </Form>

                                            <DialogFooter className="gap-2 sm:gap-0 mt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setIsDialogOpen(false)}
                                                    disabled={confirmDonationMutation.isLoading}
                                                    className="border border-border text-text-primary hover:bg-bg-card mr-2"
                                                >
                                                    Cancel
                                                </Button>
                                                <Button
                                                    onClick={handleConfirmDonation}
                                                    disabled={confirmDonationMutation.isLoading}
                                                    className="bg-primary hover:bg-primary-hover text-white font-semibold transition-colors"
                                                >
                                                    {confirmDonationMutation.isLoading ? (
                                                        <>
                                                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
                                )}
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DonationDetails;
