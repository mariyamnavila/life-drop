import { Button } from '@/components/ui/button';
import React from 'react';
const Banner = () => {
    return (
        <div className="bg-[url('./assets/Hero.jpg')] h-150 bg-cover flex justify-end">
            <div className='w-1/2 bg-white/80 h-150 flex flex-col justify-center items-start p-12'>
                <h1 className='text-5xl font-bold'>Donate Your Blood to Us, Save More Life Together</h1>
                <p className='mt-6 text-gray-700'>Join us in making a difference. Your donation can save lives.Together, we can create a stronger, healthier community—one donation at a time.</p>
                <Button className='mt-6 bg-primary hover:bg-primary-hover text-white'>Get Started</Button>
            </div>
        </div>
    );
};

export default Banner;