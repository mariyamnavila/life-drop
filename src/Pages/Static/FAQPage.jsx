import React from 'react';
import { Helmet } from 'react-helmet-async';
import FAQ from '../Home/FAQ/FAQ';

const FAQPage = () => {
    return (
        <div className="py-6">
            <Helmet>
                <title>FAQ | Life Drop</title>
                <meta name="description" content="Frequently Asked Questions about blood donation safety, eligibility, and scheduling." />
            </Helmet>
            <FAQ />
        </div>
    );
};

export default FAQPage;
