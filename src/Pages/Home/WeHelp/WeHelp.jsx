import { FaAward } from "react-icons/fa";
import { RiTeamLine } from "react-icons/ri";
import { HiInboxStack } from "react-icons/hi2";
import { CiHospital1 } from "react-icons/ci";
import HelpStatCard from "./HelpStatCard";

const WeHelp = () => {

    const helpStats = [
        {
            icon: <FaAward />,
            number: 24,
            title: 'Year Experience'
        },
        {
            icon: <RiTeamLine />,
            number: 98,
            title: 'Expert Staff'
        },
        {
            icon: <HiInboxStack />,
            number: 50,
            title: 'Blood Per-Month'
        },
        {
            icon: <CiHospital1 />,
            number: 29,
            title: 'Cooperation'
        },
    ]

    // text-[#da2929]

    return (
        <div className="bg-[url('./assets/help.jpg')] bg-cover bg-center">
            <div className="bg-black/70">
                <div className="max-w-7xl mx-auto py-36 ">
                    <div className="flex flex-col justify-center items-center">
                        <p className="text-primary font-semibold">We Help People</p>
                        <h2 className="text-4xl font-semibold text-white mt-2">Stay to Help You</h2>
                        <p className="mt-4 lg:w-1/2 text-white text-center"> Our commitment is simple—to care, to support, and to save lives by standing together as a community.</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-10">
                        {helpStats.map((item, index) => (
                            <HelpStatCard
                                key={index}
                                icon={item.icon}
                                number={item.number}
                                title={item.title}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WeHelp;