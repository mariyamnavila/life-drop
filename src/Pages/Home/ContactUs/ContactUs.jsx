import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin } from "lucide-react";

const ContactUs = () => {
    return (
        <div
            className="max-w-7xl mx-auto my-24 
                 grid grid-cols-1 md:grid-cols-2 gap-12 
                 items-stretch px-5"
        >
            {/* LEFT: TEXT SECTION */}
            <div className="flex flex-col justify-center">
                <p className="text-primary font-semibold">Contact Us</p>

                <h2 className="text-3xl md:text-5xl font-semibold mt-3">
                    Get In Touch With Us
                </h2>

                <p className="text-gray-500 mt-5 max-w-lg">
                    Have questions, need help, or want to support our mission?
                    Reach out anytime. We’re here to help and guide you.
                </p>

                {/* CONTACT INFO */}
                <div className="mt-8 space-y-4">
                    <div className="flex items-center gap-3 text-gray-600">
                        <Phone className="text-primary w-5 h-5" />
                        <span>+880 1234 567 890</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <Mail className="text-primary w-5 h-5" />
                        <span>support@lifedrop.com</span>
                    </div>

                    <div className="flex items-center gap-3 text-gray-600">
                        <MapPin className="text-primary w-5 h-5" />
                        <span>Chittagong, Bangladesh</span>
                    </div>
                </div>
            </div>

            {/* RIGHT: FORM */}
            <Card className="shadow-xl">
                <CardHeader>
                    <CardTitle className="text-2xl">
                        Send Us a Message
                    </CardTitle>
                </CardHeader>

                <CardContent>
                    <form className="space-y-5">
                        {/* Name + Email Row */}
                        <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                            <div className="flex-1 space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" placeholder="Your full name" />
                            </div>

                            <div className="flex-1 space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="your@email.com" />
                            </div>
                        </div>

                        {/* Phone Number */}
                        <div className="space-y-2">
                            <Label htmlFor="phone">Phone Number</Label>
                            <Input id="phone" placeholder="+880 ..." />
                        </div>

                        {/* Message */}
                        <div className="space-y-2">
                            <Label htmlFor="message">Message</Label>
                            <textarea
                                id="message"
                                rows={4}
                                placeholder="Write your message here..."
                                className="w-full rounded-md border border-input 
                 bg-background px-3 py-2 text-sm
                 ring-offset-background
                 focus-visible:outline-none
                 focus-visible:ring-2
                 focus-visible:ring-ring
                 focus-visible:ring-offset-2
                 resize-none"
                            />
                        </div>

                        <Button className="bg-primary w-full">
                            Send Message
                        </Button>
                    </form>

                </CardContent>
            </Card>
        </div>
    );
};

export default ContactUs;
