import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

const FAQ = () => {
    const [activeIndex, setActiveIndex] = useState(null);

    const faqs = [
        {
            question: "Who can donate blood?",
            answer: "Most healthy individuals who are at least 17 years old (or 16 with parental consent), weigh at least 110 pounds, and meet the health criteria can donate. General health and travel history will be checked during screening."
        },
        {
            question: "How often can I donate blood?",
            answer: "You can donate whole blood every 56 days (8 weeks). If you are donating double red cells, you must wait 112 days. Platelet donors can donate every 7 days, up to 24 times a year."
        },
        {
            question: "Is blood donation safe?",
            answer: "Absolutely. The donation process is highly regulated. All needles and collection kits are sterile, used only once, and safely disposed of immediately after your donation, making it impossible to contract any disease."
        },
        {
            question: "What should I eat or drink before donating?",
            answer: "Drink plenty of water (an extra 16 oz is recommended) and eat a healthy meal before your donation. Avoid fatty foods (like fries or burgers) beforehand, as they can interfere with blood testing."
        },
        {
            question: "How long does the blood donation process take?",
            answer: "The entire process—from registration, brief health screening, actual donation, to resting in the refreshment area—takes about 45 to 60 minutes. The actual blood draw itself takes only about 8 to 10 minutes."
        }
    ];

    const toggleFAQ = (index) => {
        setActiveIndex(activeIndex === index ? null : index);
    };

    return (
        <section className="max-w-4xl mx-auto my-24 px-5 text-text-primary">
            <div className="flex flex-col justify-center items-center text-center mb-12 space-y-2">
                <p className="text-primary font-semibold flex items-center gap-1.5">
                    <HelpCircle className="h-4 w-4" />
                    FAQ
                </p>
                <h2 className="text-3xl md:text-5xl font-semibold mt-1">
                    Frequently Asked Questions
                </h2>
                <p className="text-text-muted mt-3 max-w-lg text-sm">
                    Have questions about blood donation safety, intervals, or preparation? Find answers to the most common queries below.
                </p>
            </div>

            <div className="space-y-4">
                {faqs.map((faq, index) => {
                    const isOpen = activeIndex === index;
                    return (
                        <div
                            key={index}
                            className="border border-border/40 rounded-xl bg-bg-card/50 overflow-hidden transition-all duration-200"
                        >
                            <button
                                type="button"
                                onClick={() => toggleFAQ(index)}
                                className="w-full flex items-center justify-between p-5 text-left font-medium text-text-primary hover:bg-bg-card transition-colors duration-200 focus:outline-none"
                            >
                                <span className="text-sm md:text-base pr-4">{faq.question}</span>
                                <ChevronDown
                                    className={`h-4 w-4 text-text-muted shrink-0 transition-transform duration-300 ${
                                        isOpen ? "rotate-180 text-primary" : ""
                                    }`}
                                />
                            </button>

                            <div
                                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                                    isOpen ? "max-h-48 border-t border-border/20" : "max-h-0"
                                }`}
                            >
                                <div className="p-5 text-sm leading-relaxed text-text-muted bg-bg-default/40">
                                    {faq.answer}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default FAQ;
