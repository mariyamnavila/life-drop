import React from 'react';

const ServiceCard = ({ title, description, icon }) => {

    return (
        <div className="bg-bg-default border border-border/10 rounded-lg shadow-md p-6 flex flex-col h-full items-center justify-center hover:shadow-xl transition-all duration-300">
            <div className="mb-4">{icon}</div>
            <h3 className="text-2xl font-semibold mb-2 text-text-primary">{title}</h3>
            <p className="text-text-muted text-center w-3/4 mb-3">{description}</p>
            <p className='text-primary/50'>Learn more</p>
        </div>
    );
};

export default ServiceCard;