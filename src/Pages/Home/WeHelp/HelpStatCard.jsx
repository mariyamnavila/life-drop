import React from 'react';

const HelpStatCard = ({ icon, number, title }) => {
    return (
        <div className="flex flex-col items-center text-center gap-2 group">

            {/* ICON */}
            <div className="text-5xl text-primary group-hover:text-white transition-colors duration-300">
                {icon}
            </div>

            {/* NUMBER */}
            <div className="flex items-start">
                <span className="text-5xl font-semibold text-white mt-3">
                    {number}
                </span>
                <span className="text-primary text-xl font-semibold ml-1 ">
                    +
                </span>
            </div>

            {/* TITLE */}
            <p className=" text-white tracking-wide">
                {title}
            </p>

        </div>
    );
};

export default HelpStatCard;