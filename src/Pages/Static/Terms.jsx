import React from 'react';
import { Helmet } from 'react-helmet-async';
import { FileText, ShieldAlert, HeartHandshake } from 'lucide-react';

const Terms = () => {
    return (
        <div className="max-w-4xl mx-auto px-5 py-12 text-text-primary">
            <Helmet>
                <title>Terms & Conditions | Life Drop</title>
                <meta name="description" content="Read the terms, conditions, and guidelines for using the Life Drop blood donation platform." />
            </Helmet>

            <div className="flex flex-col items-center text-center mb-12 space-y-2">
                <FileText className="h-10 w-10 text-primary mb-2" />
                <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">Terms & Conditions</h1>
                <p className="text-text-muted text-sm max-w-md mt-2">
                    Please read these guidelines carefully before creating donation requests or pledging blood.
                </p>
            </div>

            <div className="space-y-8 text-sm md:text-base leading-relaxed text-text-muted">
                {/* Section 1 */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <HeartHandshake className="h-5 w-5 text-primary shrink-0" />
                        1. Community Pledging Agreement
                    </h3>
                    <p className="pl-7">
                        Life Drop acts as a matching directory connecting patients (requesters) with volunteer donors. By confirming a blood donation pledge (clicking "Confirm Donation"), you commit to showing up at the selected hospital at the agreed date and time. If you cannot fulfill a confirmed donation, please cancel your pledge at least 24 hours in advance to allow another donor to step forward.
                    </p>
                </div>

                {/* Section 2 */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <ShieldAlert className="h-5 w-5 text-primary shrink-0" />
                        2. Verification & Safety Guidelines
                    </h3>
                    <p className="pl-7">
                        Requesters must provide genuine patient info, hospital details, and contact numbers. Deliberate creation of fake or malicious donation tickets is strictly prohibited and will result in permanent account suspension and ban. We urge donors to also verify the medical conditions directly with the requester prior to donation.
                    </p>
                </div>

                {/* Section 3 */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        3. Privacy Policy Summary
                    </h3>
                    <p className="pl-7">
                        Life Drop collects name, email, district, upazila, and blood group for the sole purpose of matching donors and displaying lists. Your contact email is displayed only to verified members for communication regarding active blood requests.
                    </p>
                </div>

                {/* Section 4 */}
                <div className="space-y-3">
                    <h3 className="text-xl font-bold text-text-primary flex items-center gap-2">
                        <FileText className="h-5 w-5 text-primary shrink-0" />
                        4. Disclaimer
                    </h3>
                    <p className="pl-7 font-light">
                        Life Drop does not operate blood storage facilities or conduct medical testing. The platform is not liable for health consequences resulting from blood transfusions or agreements made between users. Please consult certified medical staff at the respective hospital before donation.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Terms;
