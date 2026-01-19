import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Separator } from "@/components/ui/separator";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { donationSchema } from "@/schemas/donationSchema";

import useAuth from "@/hooks/useAuth";
import useUserRole from "@/hooks/useUserRole";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Skeleton } from "@/components/ui/skeleton";

import districts from "@/assets/bangladesh_districts.json";
import { useState } from "react";

import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

const CreateDonation = () => {
    const { user } = useAuth();
    const { status, isLoading } = useUserRole();
    const axiosSecure = useAxiosSecure();
    const [selectedDistrict, setSelectedDistrict] = useState(null);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMessage, setDialogMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate()

    const generateTimeOptions = () => {
        const times = [];
        for (let h = 8; h <= 20; h++) { // 8:00 AM to 8:00 PM
            for (let m = 0; m < 60; m += 15) {
                let hour = h;
                const minute = m.toString().padStart(2, "0");
                const ampm = hour >= 12 ? "PM" : "AM";

                if (hour > 12) hour -= 12;
                if (hour === 0) hour = 12;

                const hourStr = hour.toString().padStart(2, "0");

                times.push(`${hourStr}:${minute} ${ampm}`);
            }
        }
        return times;
    };


    const timeOptions = generateTimeOptions();


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

    const onSubmit = async (data) => {
        if (submitting) return; // 🚫 block duplicate submits

        setSubmitting(true);
        const donationRequest = {
            ...data,
            requesterName: user.displayName,
            requesterEmail: user.email,
            donationStatus: "pending",
            createdAt: new Date(),
        };

        try {
            const res = await axiosSecure.post("/donations", donationRequest);

            if (res.data.insertedId) {
                setDialogTitle("Success!");
                setDialogMessage("Donation request created successfully.");
                setDialogOpen(true);
                form.reset(); // reset form
                navigate('/dashboard/my-donation-requests')
            } else {
                throw new Error("Something went wrong");
            }
        } catch (err) {
            setDialogTitle("Error");
            setDialogMessage(err.response?.data?.message || err.message || "An unexpected error occurred.");
            setDialogOpen(true);
        } finally {
            setSubmitting(false);
        }
    };


    if (isLoading) {
        return (
            <Card className="max-w-3xl mx-auto p-6 space-y-4">
                <Skeleton className="h-6 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
            </Card>
        );
    }

    if (status === "blocked") {
        return (
            <Card>
                <CardContent className="p-6 text-center text-destructive">
                    You are blocked and cannot create a donation request.
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className={'text-2xl'}>Create Donation Request</CardTitle>
                <CardDescription>Submit a new blood donation request to help those in need quickly and efficiently.</CardDescription>
            </CardHeader>

            <Separator />

            <CardContent className="pt-6">
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                e.preventDefault();
                            }
                        }}
                        className="space-y-6">

                        {/* Read-only requester info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormItem>
                                <FormLabel>Requester Name</FormLabel>
                                <Input value={user.displayName} readOnly />
                            </FormItem>

                            <FormItem>
                                <FormLabel>Requester Email</FormLabel>
                                <Input value={user.email} readOnly />
                            </FormItem>
                        </div>

                        <Separator />

                        {/* Recipient Name */}
                        <FormField
                            control={form.control}
                            name="recipientName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Recipient Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter recipient's full name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* District & Upazila */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="recipientDistrict"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Recipient District</FormLabel>
                                        <Select
                                            onValueChange={(value) => {
                                                field.onChange(value);
                                                setSelectedDistrict(value);
                                                form.setValue("recipientUpazila", "");
                                            }}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select district" />
                                                </SelectTrigger>
                                            </FormControl>

                                            <SelectContent>
                                                {districts.map((district) => (
                                                    <SelectItem
                                                        key={district.district_name}
                                                        value={district.district_name}
                                                    >
                                                        {district.district_name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />


                            <FormField
                                control={form.control}
                                name="recipientUpazila"
                                render={({ field }) => {
                                    const upazilas =
                                        districts.find(d => d.district_name === selectedDistrict)
                                            ?.upazilas || [];

                                    return (
                                        <FormItem>
                                            <FormLabel>Recipient Upazila</FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                disabled={!selectedDistrict}
                                            >
                                                <FormControl>
                                                    <SelectTrigger className="w-full">
                                                        <SelectValue placeholder="Select upazila" />
                                                    </SelectTrigger>
                                                </FormControl>

                                                <SelectContent>
                                                    {upazilas.map((u) => (
                                                        <SelectItem key={u.id} value={u.name}>
                                                            {u.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    );
                                }}
                            />

                        </div>

                        {/* Hospital */}
                        <FormField
                            control={form.control}
                            name="hospitalName"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Hospital Name</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter hospital name" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Address */}
                        <FormField
                            control={form.control}
                            name="fullAddress"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Full Address</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter full address" {...field} />
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
                                    <Select onValueChange={field.onChange}>
                                        <FormControl>
                                            <SelectTrigger className="w-full">
                                                <SelectValue placeholder="Select blood group" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                                                <SelectItem key={bg} value={bg}>
                                                    {bg}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                                        {field.value
                                                            ? format(new Date(field.value), "PPP")
                                                            : "Pick a date"}
                                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                    </Button>
                                                </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent align="start" className="p-0">
                                                <Calendar
                                                    mode="single"
                                                    selected={field.value ? new Date(field.value) : undefined}
                                                    onSelect={(date) =>
                                                        field.onChange(date?.toISOString())
                                                    }
                                                    disabled={(date) => date < new Date()}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="donationTime"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Donation Time</FormLabel>
                                        <FormControl>
                                            <Select onValueChange={field.onChange} value={field.value}>
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Select time" />
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

                        {/* Message */}
                        <FormField
                            control={form.control}
                            name="requestMessage"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Request Message</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your request message" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />



                        <Button type="submit" className="w-full" disabled={submitting}>
                            {submitting ? "Submitting..." : "Request Donation"}
                        </Button>

                        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{dialogTitle}</DialogTitle>
                                    <DialogDescription>{dialogMessage}</DialogDescription>
                                </DialogHeader>
                                <DialogFooter>
                                    <Button onClick={() => setDialogOpen(false)}>Close</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </form>
                </Form>
            </CardContent>
        </Card>
    );
};

export default CreateDonation;
