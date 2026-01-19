import React, { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Loading from "@/Pages/Loading/Loading";

// Stripe
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import PaymentForm from "./PaymentForm"; // your updated PaymentForm
import Swal from "sweetalert2";
import { Input } from "@/components/ui/input";

const stripePromise = loadStripe(import.meta.env.VITE_payment_Key);

const FundingPage = () => {
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [page, setPage] = useState(0);
    const [limit, setLimit] = useState(10);

    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [donationAmount, setDonationAmount] = useState(0);

    // ✅ Fetch paginated fundings (v5 style)
    const { data, isLoading } = useQuery({
        queryKey: ["fundings", page, limit],
        queryFn: async () => {
            const query = new URLSearchParams({ page, limit });
            const res = await axiosSecure.get(`/fundings?${query.toString()}`);
            return res.data;
        },
        keepPreviousData: true,
    });

    if (isLoading) return <Loading />;

    const totalPages = Math.ceil((data?.totalCount || 0) / limit);
    const pages = [...Array(totalPages).keys()];

    // Open Stripe payment form
    const handleGiveFund = () => {
        const amount = parseFloat(donationAmount);
        if (!amount || amount <= 0) {
            Swal.fire({
                icon: "error",
                title: "Invalid amount",
                text: "Please enter a valid donation amount",
            });
            return;
        }
        setDonationAmount(amount);
        setShowPaymentForm(true);
    };

    // Callback after successful payment
    const handlePaymentSuccess = () => {
        setShowPaymentForm(false);
        queryClient.invalidateQueries({ queryKey: ["fundings"] }); // refresh table
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-semibold">Support LifeDrop</h1>
                    <p className="text-gray-500 mt-1">
                        Contribute to our cause and help us facilitate blood donations for those in need.
                    </p>
                </div>

                <div className="flex items-center gap-2 mt-6 md:mt-0">
                    <Input
                        type="number"
                        placeholder="Enter amount in USD"
                        value={donationAmount}
                        onChange={(e) => setDonationAmount(e.target.value)}
                        className="w-full md:w-34"
                        min={1}
                    />
                    <Button onClick={handleGiveFund}>Give Fund 💖</Button>
                </div>
            </div>

            {/* Stripe Payment Form */}
            {showPaymentForm && donationAmount > 0 && (
                <Elements stripe={stripePromise}>
                    <PaymentForm
                        amount={donationAmount}
                        onSuccess={handlePaymentSuccess}
                        onCancel={() => setShowPaymentForm(false)}
                    />
                </Elements>
            )}

            {/* Fundings Table */}
            {data.fundings && data.fundings.length > 0 ? (
                <>
                    <Card className="w-full overflow-x-auto py-0 rounded-lg">
                        <Table className="min-w-200 md:min-w-full">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User Name</TableHead>
                                    <TableHead>Fund Amount</TableHead>
                                    <TableHead>Funding Date</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {data.fundings.map((fund) => (
                                    <TableRow key={fund._id}>
                                        <TableCell>{fund.userName}</TableCell>
                                        <TableCell>${fund.amount}</TableCell>
                                        <TableCell>
                                            {new Date(fund.date).toLocaleDateString("en-GB", {
                                                day: "2-digit",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Card>

                    {/* Pagination */}
                    <div className="flex items-center justify-center gap-2 mt-8 flex-wrap sticky bottom-0 bg-white py-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 0}
                            onClick={() => setPage(page - 1)}
                        >
                            Prev
                        </Button>

                        {pages.map((p) => (
                            <Button
                                key={p}
                                size="sm"
                                variant={page === p ? "default" : "outline"}
                                onClick={() => setPage(p)}
                            >
                                {p + 1}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages - 1}
                            onClick={() => setPage(page + 1)}
                        >
                            Next
                        </Button>

                        <Select
                            value={String(limit)}
                            onValueChange={(val) => {
                                setLimit(Number(val));
                                setPage(0);
                            }}
                        >
                            <SelectTrigger className="w-24">
                                <SelectValue placeholder="Rows" className="text-center text-black truncate" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="5">5</SelectItem>
                                <SelectItem value="10">10</SelectItem>
                                <SelectItem value="15">15</SelectItem>
                                <SelectItem value="20">20</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </>
            ) : (
                <div className="min-h-screen flex justify-center items-center">
                    <p className="text-lg text-muted-foreground">
                        No funds have been made yet.
                    </p>
                </div>
            )}
        </div>
    );
};

export default FundingPage;
