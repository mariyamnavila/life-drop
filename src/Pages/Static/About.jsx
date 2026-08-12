import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Heart, Shield, Users, Award } from 'lucide-react';
import aboutImg from '@/assets/service.jpg';

const About = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8 text-text-primary">
            <Helmet>
                <title>About Us | Life Drop</title>
                <meta name="description" content="Learn more about Life Drop, our mission to connect blood donors, and our impact." />
            </Helmet>

            {/* Title Section */}
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
                <p className="text-primary font-semibold uppercase tracking-wider">About Life Drop</p>
                <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight mt-1">Our Mission is to Save Lives</h1>
                <p className="text-text-muted text-lg mt-3">
                    Life Drop is a community-driven blood donation platform connecting volunteers, donors, and recipients seamlessly across Bangladesh.
                </p>
            </div>

            {/* Image + Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
                <div className="relative rounded-2xl overflow-hidden shadow-lg border border-border/20">
                    <img src={aboutImg} alt="Our team at work" className="w-full h-96 object-cover" />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                </div>
                <div className="space-y-6">
                    <h2 className="text-3xl font-bold">Why We Started</h2>
                    <p className="text-text-muted leading-relaxed">
                        Every day, thousands of patients in Bangladesh require blood transfusions due to surgeries, accidents, or chronic conditions. Finding the right donor quickly remains a major challenge. 
                    </p>
                    <p className="text-text-muted leading-relaxed">
                        Life Drop was founded to bridge this gap. By offering a digital registry with location-based matching, real-time urgency statuses, and streamlined tracking, we make sure that blood finds its recipient when every minute counts.
                    </p>
                    <div className="grid grid-cols-2 gap-6 pt-4">
                        <div>
                            <h4 className="font-bold text-2xl text-primary">10k+</h4>
                            <p className="text-xs text-text-muted uppercase font-semibold mt-1">Registered Donors</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-2xl text-primary">5k+</h4>
                            <p className="text-xs text-text-muted uppercase font-semibold mt-1">Successful Transfusions</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Values */}
            <div className="border-t border-border/40 pt-16">
                <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Value 1 */}
                    <div className="p-6 bg-bg-card border border-border/40 rounded-xl space-y-3">
                        <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                            <Heart className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Compassion</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We treat every donation request with utmost empathy and urgency, remembering that behind every ticket is a human life.
                        </p>
                    </div>

                    {/* Value 2 */}
                    <div className="p-6 bg-bg-card border border-border/40 rounded-xl space-y-3">
                        <div className="h-12 w-12 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Trust & Safety</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            We value donor privacy and strictly verify requests to ensure a transparent, secure environment for our community.
                        </p>
                    </div>

                    {/* Value 3 */}
                    <div className="p-6 bg-bg-card border border-border/40 rounded-xl space-y-3">
                        <div className="h-12 w-12 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500">
                            <Users className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-bold">Community</h3>
                        <p className="text-sm text-text-muted leading-relaxed">
                            Together we are stronger. Life Drop relies on cooperation between hospital systems, donors, and volunteer coordinators.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
