import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Loading from "@/Pages/Loading/Loading";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Form, FormControl, FormItem, FormLabel } from "@/components/ui/form";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

const DonationDetails = () => {
    const { donationId } = useParams();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const form = useForm({
        defaultValues: {
            donorName: user.displayName,
            donorEmail: user.email,
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
            Swal.fire("Success", "Donation confirmed!", "success");
        },
        onError: (err) => {
            Swal.fire("Error", err.message || "Something went wrong.", "error");
        },
    });

    if (authLoading || isLoading) return <Loading />;

    console.log(donation);

    return (
        <div className="p-4 md:p-6 flex flex-col gap-6">
            <div>
                <h1 className="text-4xl font-bold">Donation Details</h1>
                <p className="text-muted-foreground mt-3">View all the details of your blood donations, including dates, location, and recipient information.</p>
            </div>

            <Card className="p-4 space-y-2">
                <p>
                    <strong>Recipient Name:</strong> {donation.recipientName}
                </p>
                <p>
                    <strong>Location:</strong> {donation.recipientDistrict}, {donation.recipientUpazila}
                </p>
                <p>
                    <strong>Hospital:</strong> {donation.hospitalName}
                </p>
                <p>
                    <strong>Address:</strong> {donation.fullAddress}
                </p>
                <p>
                    <strong>Blood Group:</strong> {donation.bloodGroup}
                </p>
                <p>
                    <strong>Date:</strong> {new Date(donation.donationDate).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric',
                    })}
                </p>
                <p>
                    <strong>Time:</strong> {donation.donationTime}
                </p>
                {/* <p>
                    <strong>Status:</strong> {donation.donationStatus}
                </p> */}
                {donation.donationStatus === "inprogress" && (
                    <p>
                        <strong>Donor:</strong> {donation.donorName} ({donation.donorEmail})
                    </p>
                )}
                <p>
                    <strong>Request Message:</strong> {donation.requestMessage}
                </p>
            </Card>

            {donation.donationStatus === "pending" && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" className={'hover:bg-primary hover:text-white'}>Donate</Button>
                    </DialogTrigger>

                    <DialogContent className="sm:max-w-100">
                        <DialogHeader>
                            <DialogTitle>Confirm Donation</DialogTitle>
                            <DialogDescription>
                                Fill in your info and confirm the donation. Status will be changed to inprogress.
                            </DialogDescription>
                        </DialogHeader>

                        <Form {...form}>
                            <FormItem>
                                <FormLabel>Donor Name</FormLabel>
                                <FormControl>
                                    <Input {...form.register("donorName")} readOnly />
                                </FormControl>
                            </FormItem>

                            <FormItem>
                                <FormLabel>Donor Email</FormLabel>
                                <FormControl>
                                    <Input {...form.register("donorEmail")} readOnly />
                                </FormControl>
                            </FormItem>
                        </Form>

                        <DialogFooter>
                            <Button
                                onClick={() => confirmDonationMutation.mutate()}
                                disabled={confirmDonationMutation.isLoading}
                            >
                                {confirmDonationMutation.isLoading ? "Processing..." : "Confirm"}
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            )}
        </div>
    );
};

export default DonationDetails;
