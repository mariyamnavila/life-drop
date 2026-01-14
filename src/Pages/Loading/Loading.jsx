import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import React from "react";

const Loading = () => {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-white">
            <DotLottieReact
                src="https://lottie.host/a4bb3ca9-4892-4cbf-90cb-6589edb89083/qYHBw17GvQ.lottie"
                loop
                autoplay
                style={{ width: 180, height: 180 }}
            />

            <p className="mt-4 text-gray-500 text-sm tracking-wide">
                Loading, please wait…
            </p>
        </div>
    );
};

export default Loading;
