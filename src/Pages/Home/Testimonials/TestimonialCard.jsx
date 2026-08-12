import { LiaQuoteLeftSolid } from "react-icons/lia";

const TestimonialCard = ({ item }) => {
    const { name, profession, image, review } = item;

    return (
        <div className="p-7 m-4 shadow-xl rounded-xl bg-bg-default border border-border/10 flex flex-col text-text-primary">

            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <img
                        className="rounded-full w-12 h-12 object-cover"
                        src={image}
                        alt={name}
                    />
                    <div>
                        <p className="text-lg font-semibold">{name}</p>
                        <p className="text-sm text-text-muted">{profession}</p>
                    </div>
                </div>
                <LiaQuoteLeftSolid className="text-4xl text-primary" />

            </div>

            <p className="text-gray-500 dark:text-gray-400 mt-4 text-lg leading-relaxed">
                {review}
            </p>

        </div>
    );
};

export default TestimonialCard;
