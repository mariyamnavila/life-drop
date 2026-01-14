import React from 'react';

const ServiceCard = ({ title, description, icon }) => {

    return (
        <div className="bg-white rounded-lg shadow-md p-6 flex flex-col h-full items-center justify-center hover:shadow-xl transition-shadow duration-300">
            <div className="mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-500 text-center w-3/4 mb-3">{description}</p>
            <p className='text-primary/50'>Learn more</p>
        </div>
    );
};

export default ServiceCard;