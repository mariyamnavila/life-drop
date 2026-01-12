import { FaPeopleGroup } from "react-icons/fa6";
import { LuHospital } from "react-icons/lu";
import { MdOutlineBloodtype } from "react-icons/md";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import ServiceCard from "./ServiceCard";

const BestService = () => {

    const bestServiceData = [
        {
            title: 'Blood Donation',
            description: 'Join our life-saving blood donation drives and make a difference in your community.',
            icon: <MdOutlineBloodtype className="text-soft-red-card text-6xl"/>
        },
        {
            title: 'Health Check',
            description: 'Get regular health screenings and ensure you and your loved ones stay healthy and safe.',
            icon: <MdOutlineHealthAndSafety className="text-soft-red-card text-6xl"/>
        },
        {
            title: 'Blood Bank',
            description: 'Access our well-stocked blood bank anytime and help save lives when it matters most.',
            icon: <LuHospital className="text-soft-red-card text-6xl"/>
        },
    ]
    return (
        <div className="bg-soft-red-card relative ">
            <div className="max-w-7xl mx-auto px-3">
                <div className="flex flex-col md:flex-row justify-start items-start absolute -top-20 md:-top-10 z-20">
                    <div className="bg-white p-4  lg:w-2/5 rounded-lg">
                        <h1 className="text-3xl font-bold">Best Service</h1>
                        <p className="text-gray-600 font-light ">Our commitment to excellence ensures that every individual receives the highest quality care and support.</p>
                    </div>
                    <div className="bg-soft-red-card flex items-center md:w-full lg:w-2/5 p-4 gap-4 rounded-t-lg ">
                        <FaPeopleGroup className="text-4xl" />
                        <div>
                            <h2 className="text-2xl font-semibold">Compassionate Care</h2>
                            <p className="text-gray-600 font-light">We prioritize empathy and understanding in all our interactions</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 pt-50 md:pt-30 pb-10 items-stretch">
                    {
                        bestServiceData.map((ser,i) => (
                            <ServiceCard
                            key={i}
                            title={ser.title}
                            description={ser.description}
                            icon={ser.icon}
                            />
                        ))
                    }
                </div>
            </div>
        </div>
    );
};

export default BestService;