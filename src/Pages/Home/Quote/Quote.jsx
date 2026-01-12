import React from 'react';
import { LiaQuoteLeftSolid } from "react-icons/lia";

const Quote = () => {
    return (
        <div className='max-w-7xl flex flex-col justify-center items-center space-y-1 my-18 px-3 mx-auto'>
            <LiaQuoteLeftSolid className='text-[65px] text-primary'/>
            <h1 className="text-3xl font-bold italic">"A single donation can help save up to three lives."</h1>
            <p className='text-primary mt-3 font-medium'>- WHO</p>
        </div>
    );
};

export default Quote;