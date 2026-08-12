import { useForm } from "react-hook-form";
import axios from "axios";
import Swal from "sweetalert2";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Loader2 } from "lucide-react";

const ContactUs = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: "",
            email: "",
            subject: "",
            message: ""
        }
    });

    const onSubmit = async (data) => {
        setIsSubmitting(true);
        try {
            // Send the contact message using FormSubmit.co AJAX API
            // FormSubmit requires email as recipient in the URL
            const recipientEmail = "bibimariyamnavila@gmail.com";
            await axios.post(`https://formsubmit.co/ajax/${recipientEmail}`, {
                name: data.name,
                email: data.email,
                _subject: data.subject, // custom subject line parsed by FormSubmit
                message: data.message
            });

            Swal.fire({
                icon: "success",
                title: "Message Sent!",
                text: "Your message has been sent successfully directly from the frontend!",
                confirmButtonColor: "#c10100",
            });
            reset();
        } catch (err) {
            Swal.fire({
                icon: "error",
                title: "Failed to Send Message",
                text: err.response?.data?.message || err.message || "Something went wrong. Please try again.",
                confirmButtonColor: "#dc2626",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div
            className="max-w-7xl mx-auto my-24 
                 grid grid-cols-1 md:grid-cols-2 gap-12 
                 items-stretch px-5 text-text-primary"
        >
            {/* LEFT: TEXT SECTION */}
            <div className="flex flex-col justify-center">
                <p className="text-primary font-semibold">Contact Us</p>

                <h2 className="text-3xl md:text-5xl font-semibold mt-3">
                    Get In Touch With Us
                </h2>

                <p className="text-text-muted mt-5 max-w-lg">
                    Have questions, need help, or want to support our mission?
                    Reach out anytime. We’re here to help and guide you.
                </p>

                {/* CONTACT INFO */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-text-muted">
                        <Phone className="text-primary w-5 h-5" />
                        <span>+880 1234 567 890</span>
                    </div>

                    <div className="flex items-center gap-3 text-text-muted">
                        <Mail className="text-primary w-5 h-5" />
                        <span>support@lifedrop.com</span>
                    </div>

                    <div className="flex items-center gap-3 text-text-muted">
                        <MapPin className="text-primary w-5 h-5" />
                        <span>Chittagong, Bangladesh</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: FORM */}
            <Card className="shadow-xl bg-bg-card border border-border/40">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-text-primary">
                        Send Us a Message
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Name + Email Row */}
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                            {/* Name Input */}
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="name" className="text-text-primary font-medium">Name</Label>
                                <Input
                                    id="name"
                                    placeholder="Your full name"
                                    {...register("name", { required: "Name is required" })}
                                    className={`bg-bg-default border border-border text-text-primary focus-visible:ring-primary ${errors.name ? 'border-red-500' : ''}`}
                                />
                                {errors.name && (
                                    <span className="text-red-500 text-xs mt-1 block">{errors.name.message}</span>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="email" className="text-text-primary font-medium">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    {...register("email", {
                                        required: "Email is required",
                                        pattern: {
                                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                                            message: "Invalid email address"
                                        }
                                    })}
                                    className={`bg-bg-default border border-border text-text-primary focus-visible:ring-primary ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <span className="text-red-500 text-xs mt-1 block">{errors.email.message}</span>
                                )}
                            </div>
                        </div>

                        {/* Subject Input */}
                        <div className="space-y-2">
                            <Label htmlFor="subject" className="text-text-primary font-medium">Subject</Label>
                            <Input
                                id="subject"
                                placeholder="How can we help you?"
                                {...register("subject", { required: "Subject is required" })}
                                className={`bg-bg-default border border-border text-text-primary focus-visible:ring-primary ${errors.subject ? 'border-red-500' : ''}`}
                            />
                            {errors.subject && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.subject.message}</span>
                            )}
                        </div>

                        {/* Message Textarea */}
                        <div className="space-y-2">
                            <Label htmlFor="message" className="text-text-primary font-medium">Message</Label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder="Write your message here..."
                                {...register("message", { required: "Message is required" })}
                                className={`w-full rounded-md border border-border bg-bg-default px-3 py-2 text-sm text-text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none ${errors.message ? 'border-red-500' : ''}`}
                            />
                            {errors.message && (
                                <span className="text-red-500 text-xs mt-1 block">{errors.message.message}</span>
                            )}
                        </div>

                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary hover:bg-primary-hover text-white w-full cursor-pointer transition-colors font-semibold"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                "Send Message"
                            )}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactUs;
