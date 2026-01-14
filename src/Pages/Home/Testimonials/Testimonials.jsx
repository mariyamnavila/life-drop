import { Button } from '@/components/ui/button';
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
// import "swiper/css/pagination";
import TestimonialCard from './TestimonialCard';

const Testimonials = () => {

    const testimonialsData = [
        {
            id: 1,
            name: "Sarah Ahmed",
            profession: "Blood Donor",
            image: "https://i.pravatar.cc/150?img=32",
            review:
                "Donating blood here was a comforting experience. And made me feel safe ."
        },
        {
            id: 2,
            name: "Rahim Uddin",
            profession: "Volunteer",
            image: "https://i.pravatar.cc/150?img=12",
            review:
                "Being part of this initiative showed me how small actions can create a huge impact. Proud to be involved."
        },
        {
            id: 3,
            name: "Ayesha Khan",
            profession: "Recipient",
            image: "https://i.pravatar.cc/150?img=45",
            review:
                "I received timely help when I needed it most. I’m forever grateful to the donors and the caring team."
        },
        {
            id: 4,
            name: "Tanvir Hasan",
            profession: "Regular Donor",
            image: "https://i.pravatar.cc/150?img=8",
            review:
                "The process is smooth, clean, and respectful. I donate regularly and always feel valued here."
        }
    ];

    return (
        <div className='max-w-7xl mx-auto my-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 items-stretch px-5'>
            <div className='lg:col-span-1 '>
                <p className='text-primary font-semibold'>Testimonial</p>
                <h2 className='text-3xl md:text-5xl font-semibold mt-3'>Testimonials</h2>
                <p className='text-gray-500 mt-5 max-w-lg'>
                    Hear from donors and recipients who have experienced the impact of our work firsthand. Their stories reflect the care, trust, and hope we strive to deliver every day.
                </p>
                <Button className={'bg-primary mt-6'}>View More</Button>
            </div>
            <div className='lg:col-span-2 h-full overflow-x-hidden'>
                <Swiper
                    modules={[Autoplay]}
                    // spaceBetween={24}
                    autoplay={{ delay: 4000 }}
                    pagination={{ clickable: true }}
                    breakpoints={{
                        0: {
                            slidesPerView: 1,
                        },
                        1024: {
                            slidesPerView: 2,
                        },
                    }}
                    className="h-full py-6 overflow-y-visible"
                >
                    {testimonialsData.map(item => (
                        <SwiperSlide key={item.id} className="h-full flex">
                            <TestimonialCard item={item} />
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </div>
    );
};


{/* <div className='p-6 shadow-xl'>
                    <div className='flex items-center justify-between'>
                        <img className='rounded-full w-6 h-6' src="" alt="" />
                        <div className='flex flex-col'>
                            <p className='text-lg'>{name}</p>
                            <p className='tex-sm text-gray-400 mt-1'>{profession}</p>
                        </div>
                        <LiaQuoteLeftSolid className='text-3xl text-primary' />
                    </div>
                    <div>
                        <p className='text-gray-400'>{review}</p>
                    </div>
                </div> */}

export default Testimonials;