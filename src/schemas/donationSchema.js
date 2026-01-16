// src/schemas/donationSchema.js
import { z } from "zod";

export const donationSchema = z.object({
    recipientName: z.string().min(1, "Recipient name is required"),
    recipientDistrict: z.string().min(1, "District is required"),
    recipientUpazila: z.string().min(1, "Upazila is required"),
    hospitalName: z.string().min(1, "Hospital name is required"),
    fullAddress: z.string().min(1, "Full address is required"),
    bloodGroup: z.enum([
        "A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"
    ]),
    donationDate: z.string().min(1, "Donation date is required"),
    donationTime: z.string().min(1, "Donation time is required"),
    requestMessage: z
        .string()
        .min(10, "Please explain the reason (min 10 characters)"),
});
