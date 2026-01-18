import React, { useState } from "react";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import { Button } from "@/components/ui/button";

const PaymentForm = ({ amount, onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const axiosSecure = useAxiosSecure();
    const { user } = useAuth(); // get logged-in user
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        setLoading(true);
        setError("");

        try {
            // 1️⃣ Create payment method
            const { error: pmError } = await stripe.createPaymentMethod({
                type: "card",
                card,
            });

            if (pmError) {
                setError(pmError.message);
                setLoading(false);
                return;
            }

            // 2️⃣ Create payment intent
            const res = await axiosSecure.post("/fundings/create-payment-intent", {
                amount,
            });
            const clientSecret = res.data.clientSecret;

            // 3️⃣ Confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card,
                    billing_details: {
                        name: user?.displayName || "Guest",
                        email: user?.email || "unknown@example.com",
                    },
                },
            });

            if (result.error) {
                setError(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                // 4️⃣ Save funding in database
                const fundingData = {
                    userId: user?._id || null,
                    userName: user?.displayName || "Guest",
                    userEmail: user?.email || "unknown@example.com",
                    amount,
                    transactionId: result.paymentIntent.id,
                    date: new Date(),
                };

                await axiosSecure.post("/fundings", fundingData);

                Swal.fire({
                    icon: "success",
                    title: "Donation Successful 🎉",
                    html: `Transaction ID: <b>${result.paymentIntent.id}</b>`,
                });

                onSuccess(); // close form & refresh table
            }
        } catch (err) {
            console.error(err);
            setError("Payment failed. Try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 mb-4 border rounded-md bg-white shadow-md">
            <h2 className="text-lg font-semibold mb-2">Donate ${amount}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <CardElement className="p-3 border rounded" />
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex space-x-2">
                    <Button type="submit" disabled={loading}>
                        {loading ? "Processing..." : "Pay Now"}
                    </Button>
                    <Button type="button" variant="outline" onClick={onCancel}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default PaymentForm;
