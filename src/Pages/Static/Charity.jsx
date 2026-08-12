import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, DollarSign, Gift, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Charity = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-text-primary">
            <Helmet>
                <title>Charity & Funding | Life Drop</title>
                <meta name="description" content="Support Life Drop charity funding campaigns and find out how your donation helps save lives." />
            </Helmet>

            {/* Title */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <p className="text-primary font-semibold uppercase tracking-wider">Charity & Funding</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">Help Us Scale Our Operations</h1>
                <p className="text-text-muted text-lg mt-3">
                    Your donations directly support community blood camps, digital platform server costs, and awareness campaigns across Bangladesh.
                </p>
            </div>

            {/* Main Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch mb-16">
                
                {/* How Funds are Used */}
                <div className="p-8 border border-border/40 bg-bg-card rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Gift className="h-6 w-6 text-primary" />
                            How Your Money Helps
                        </h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Life Drop runs entirely on voluntary contributions. Every dollar collected through Stripe payments is transparently routed to:
                        </p>
                        <ul className="space-y-2 text-sm text-text-muted pl-4 list-disc">
                            <li>Funding rural blood testing kits and awareness camps.</li>
                            <li>Maintaining digital infrastructure, servers, and SMS notification gateways.</li>
                            <li>Organizing volunteer logistics and hospital-coordination training.</li>
                        </ul>
                    </div>
                    <Link to="/funding" className="mt-8">
                        <Button className="w-full bg-primary hover:bg-primary-hover text-white">Donate via Stripe</Button>
                    </Link>
                </div>

                {/* Donation Safety & Transparency */}
                <div className="p-8 border border-border/40 bg-bg-card rounded-2xl flex flex-col justify-between">
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <Heart className="h-6 w-6 text-primary" />
                            Safe & Secure Funding
                        </h2>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We use industry-standard security and Stripe processing. All fund balances and donation events are logged securely in our system database. Users must be logged in to execute payments.
                        </p>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Interested in checking our campaigns, donating, or accessing receipts? Visit our central Funding page.
                        </p>
                    </div>
                    <div className="pt-6 border-t border-border/30 flex items-center gap-2 text-xs text-text-muted font-medium">
                        <Calendar className="h-4 w-4 text-primary" />
                        Campaign updated for the current fiscal year.
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Charity;
