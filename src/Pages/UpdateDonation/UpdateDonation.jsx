import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Loading from "@/Pages/Loading/Loading";
import districts from "@/assets/bangladesh_districts.json";
import Swal from "sweetalert2";
import { format } from "date-fns";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { donationSchema } from "@/schemas/donationSchema";

// --- Generate 12-hour AM/PM time options
const generateTimeOptions = () => {
    const times = [];
    for (let h = 0; h < 24; h++) {
        for (let m = 0; m < 60; m += 15) {
            const hour = h % 12 === 0 ? 12 : h % 12;
            const minute = m.toString().padStart(2, "0");
            const ampm = h < 12 ? "AM" : "PM";
            times.push(`${hour}:${minute} ${ampm}`);
        }
    }
    return times;
};
const timeOptions = generateTimeOptions();

const UpdateDonation = () => {
    const { donationId } = useParams();
    const navigate = useNavigate();
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    // --- Fetch existing donation
    const { data: donation, isLoading } = useQuery({
        queryKey: ["donation", donationId],
        enabled: !!donationId,
        queryFn: async () => {
            const res = await axiosSecure.get(`/donations/${donationId}`);
            return res.data;
        },
    });

    // --- React Hook Form
    const form = useForm({
        resolver: zodResolver(donationSchema),
        defaultValues: {
            recipientName: "",
            recipientDistrict: "",
            recipientUpazila: "",
            hospitalName: "",
            fullAddress: "",
            bloodGroup: "",
            donationDate: "",
            donationTime: "",
            requestMessage: "",
        },
    });

    // --- Reset form when donation data loads
    useEffect(() => {
        if (donation) {
            form.reset({
                recipientName: donation.recipientName,
                recipientDistrict: donation.recipientDistrict,
                // recipientUpazila: donation.recipientUpazila,
                hospitalName: donation.hospitalName,
                fullAddress: donation.fullAddress,
                bloodGroup: donation.bloodGroup,
                donationDate: donation.donationDate,
                donationTime: donation.donationTime,
                requestMessage: donation.requestMessage,
            });
        }
    }, [donation, form]);

    // --- Mutation to update donation (PUT)
    const updateDonationMutation = useMutation({
        mutationFn: async (data) => {
            const res = await axiosSecure.put(`/donations/${donationId}`, data);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["donation", donationId]);
            Swal.fire("Success", "Donation updated successfully!", "success");
            navigate("/dashboard/my-donation-requests");
        },
        onError: (err) => {
            Swal.fire("Error", err.response?.data?.message || err.message, "error");
        },
    });

    const onSubmit = async (data) => {
        const donationRequest = {
            ...data,
            requesterName: user.displayName,
            requesterEmail: user.email,
            donationStatus: "pending",
            createdAt: new Date(),
        };

        updateDonationMutation.mutate(donationRequest)

    };

    if (authLoading || isLoading) return <Loading />;

    return (
        <Card className="p-6 max-w-3xl mx-auto space-y-4">
            <h1 className="text-2xl font-bold">Update Donation Request</h1>
            <Separator />

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4"
                >
                    {/* Recipient Name */}
                    <FormField
                        control={form.control}
                        name="recipientName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Recipient Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Recipient Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* District */}
                        <FormField
                            control={form.control}
                            name="recipientDistrict"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>District</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={(val) => {
                                                field.onChange(val);
                                                form.setValue("recipientUpazila", ""); // reset upazila
                                            }}
                                            value={field.value}
                                        >
                                            <SelectTrigger className={'w-full'}>
                                                <SelectValue placeholder="Select District" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {districts.map((d) => (
                                                    <SelectItem key={d.district_name} value={d.district_name}>
                                                        {d.district_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Upazila */}
                        <FormField
                            control={form.control}
                            name="recipientUpazila"
                            render={({ field }) => {
                                const selectedDistrict = form.getValues("recipientDistrict");
                                const districtObj = districts.find((d) => d.district_name === selectedDistrict);
                                return (
                                    <FormItem>
                                        <FormLabel>Upazila</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className={'w-full'}>
                                                    <SelectValue placeholder="Select Upazila" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {districtObj?.upazilas?.map((u) => (
                                                        <SelectItem key={u.id} value={u.name}>
                                                            {u.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>

                    {/* Hospital Name */}
                    <FormField
                        control={form.control}
                        name="hospitalName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Hospital Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Hospital Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Full Address */}
                    <FormField
                        control={form.control}
                        name="fullAddress"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Address</FormLabel>
                                <FormControl>
                                    <Input placeholder="Full Address" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* Blood Group */}
                    <FormField
                        control={form.control}
                        name="bloodGroup"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Blood Group</FormLabel>
                                <FormControl>
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger className={'w-full'}>
                                            <SelectValue placeholder="Select Blood Group" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                                <SelectItem key={bg} value={bg}>
                                                    {bg}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                        {/* Donation Date */}
                        <FormField
                            control={form.control}
                            name="donationDate"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Donation Date</FormLabel>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <FormControl>
                                                <Button
                                                    variant="outline"
                                                    className="w-full justify-start text-left"
                                                >
                                                    {field.value ? format(new Date(field.value), "PPP") : "Select Date"}
                                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                            </FormControl>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar
                                                mode="single"
                                                selected={field.value ? new Date(field.value) : undefined}
                                                onSelect={(date) => field.onChange(date.toISOString())}
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Donation Time */}
                        <FormField
                            control={form.control}
                            name="donationTime"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Donation Time</FormLabel>
                                    <FormControl>
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value || ""}
                                        >
                                            <SelectTrigger className={'w-full'}>
                                                <SelectValue placeholder="Select Time" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeOptions.map((time) => (
                                                    <SelectItem key={time} value={time}>
                                                        {time}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {/* Request Message */}
                    <FormField
                        control={form.control}
                        name="requestMessage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Request Message</FormLabel>
                                <FormControl>
                                    <Input placeholder="Why do you need blood?" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <Button type="submit" disabled={updateDonationMutation.isLoading}>
                        {updateDonationMutation.isLoading ? "Updating..." : "Update Donation"}
                    </Button>
                </form>
            </Form>
        </Card>
    );
};

export default UpdateDonation;
