import { Button } from '@/components/ui/button';
import React from 'react';
import { FaCheck } from "react-icons/fa";
import about from '@/assets/service.jpg';

const AboutUs = () => {

    const aboutUsData = [
        'Good Service',
        'Help People',
        'Hygiene Tools',
        '24h Service',
        'Health Check',
        'Blood Bank'
    ]

    return (
        <div className='max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-center md:justify-between mt-20 gap-10 px-5'>
            <div className='lg:w-1/2 pr-3 space-y-2'>
                <p className='text-primary font-semibold mb-2'>About Us</p>
                <h1 className='text-4xl font-semibold'>Together We Can Make World More Health & Better</h1>
                <p className='mt-4 text-gray-500'>Our mission is to ensure that everyone has access to quality healthcare, regardless of their location or economic status. Through partnerships with local organizations and healthcare providers, we strive to create sustainable solutions that address the root causes of health disparities. Join us in our journey to make a positive impact on the world, one life at a time.</p>
                <div className='grid grid-cols-1 md:grid-cols-2 gap-2 my-5'>
                    {
                        aboutUsData.map((item, index) => (
                            <div key={index} className='flex items-center space-x-2'>
                                <FaCheck className='text-primary' />
                                <p className='font-medium'>{item}</p>
                            </div>
                        ))
                    }
                </div>
                <Button className=' bg-primary hover:bg-primary-hover mb-7'>Read More</Button>
            </div>
            <div className='relative'>
                <img className='rounded-md w-150 h-150 object-cover relative z-10' src={about} alt="" />
            </div>
        </div>
    );
};

export default AboutUs;