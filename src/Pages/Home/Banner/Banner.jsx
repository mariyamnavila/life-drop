import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import heroImg from '@/assets/Hero.jpg';
import serviceImg from '@/assets/service.jpg';
import helpImg from '@/assets/help.jpg';

const Banner = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [
        {
            image: heroImg,
            title: "Donate Your Blood, Save Lives Together",
            description: "Your single donation can save up to three lives. Join our community of volunteer savers and make a difference today.",
            buttonText: "Find Donors",
            buttonLink: "/search-donors",
            textPosition: "justify-end"
        },
        {
            image: serviceImg,
            title: "Urgent Request Matching in Real-Time",
            description: "View active blood requests in your district. Coordinate directly with hospital representatives and pledge donations instantly.",
            buttonText: "Explore Requests",
            buttonLink: "/donation-requests",
            textPosition: "justify-start"
        },
        {
            image: helpImg,
            title: "Support Platform Campaigns & Charity",
            description: "Help us fund rural blood camps, transport kits, and notification servers by participating in our secure charity campaigns.",
            buttonText: "Donate Funding",
            buttonLink: "/funding",
            textPosition: "justify-end"
        }
    ];

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 6000);
        return () => clearInterval(timer);
    }, [slides.length]);

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    };

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % slides.length);
    };

    return (
        <div className="relative h-[550px] w-full overflow-hidden bg-black select-none group">
            {/* Slides */}
            {slides.map((slide, index) => {
                const isActive = index === currentSlide;
                return (
                    <div
                        key={index}
                        className={`absolute inset-0 w-full h-full flex items-center ${slide.textPosition} transition-opacity duration-1000 ease-in-out ${
                            isActive ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                    >
                        {/* Background Image with Zoom animation */}
                        <div
                            className={`absolute inset-0 bg-cover bg-center transition-transform duration-[6000ms] ease-out ${
                                isActive ? "scale-105" : "scale-100"
                            }`}
                            style={{ backgroundImage: `url(${slide.image})` }}
                        >
                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/45" />
                        </div>

                        {/* Content Card (Slide In / Fade In) */}
                        <div className={`relative w-full md:w-1/2 bg-bg-default/90 dark:bg-bg-card/90 backdrop-blur-md h-full flex flex-col justify-center items-start p-8 md:p-16 text-text-primary transition-all duration-700 ease-out border-x border-border/10 ${
                            isActive ? "translate-x-0 opacity-100" : slide.textPosition === "justify-end" ? "translate-x-12 opacity-0" : "-translate-x-12 opacity-0"
                        }`}>
                            <h1 className="text-3xl md:text-5xl font-extrabold leading-tight tracking-tight text-text-primary">
                                {slide.title}
                            </h1>
                            <p className="mt-6 text-sm md:text-base text-text-muted leading-relaxed max-w-lg">
                                {slide.description}
                            </p>
                            <Link to={slide.buttonLink} className="mt-8">
                                <Button size="lg" className="bg-primary hover:bg-primary-hover text-white font-semibold shadow-md transition-all duration-200 cursor-pointer">
                                    {slide.buttonText}
                                </Button>
                            </Link>
                        </div>
                    </div>
                );
            })}

            {/* Left Arrow Button */}
            <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label="Previous Slide"
            >
                <ChevronLeft className="h-6 w-6" />
            </button>

            {/* Right Arrow Button */}
            <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 h-11 w-11 flex items-center justify-center rounded-full bg-black/30 hover:bg-black/50 border border-white/10 text-white transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:outline-none"
                aria-label="Next Slide"
            >
                <ChevronRight className="h-6 w-6" />
            </button>

            {/* Indicator Dots */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2.5">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`h-2.5 rounded-full transition-all duration-300 focus:outline-none cursor-pointer ${
                            index === currentSlide ? "w-8 bg-primary" : "w-2.5 bg-white/40 hover:bg-white/60"
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Banner;