import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = (data) => {
        console.log(data);
        // handle login API here
    };

    return (
        <div className="max-w-7xl mx-auto my-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-5">
            {/* LEFT: FORM */}
            <div>
                <h2 className="text-4xl font-semibold text-primary">Login</h2>
                <p className="text-gray-500 mt-3 max-w-lg">
                    Welcome back! Please enter your credentials to access your account.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                    {/* Email */}
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="your@email.com"
                            {...register("email", { required: "Email is required" })}
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter password"
                            {...register("password", { required: "Password is required" })}
                        />
                        <span
                            className="absolute right-3 top-7 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <EyeOff /> : <Eye />}
                        </span>
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    {/* Already have an account / register link */}
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Don't have an account?{" "}
                        <a href="/register" className="text-primary font-medium hover:underline">
                            Register here
                        </a>
                    </p>

                    <Button className="bg-primary w-full mt-2">Login</Button>
                </form>
            </div>

            {/* RIGHT: Lottie Animation (desktop only) */}
            <div className="hidden lg:flex justify-center items-center">
                <DotLottieReact
                    src="https://lottie.host/84dd7204-13a5-4018-99eb-6fdf61fb161d/Qo0lLeGqBy.lottie"
                    loop
                    autoplay
                    style={{ width: "400px", height: "400px" }}
                />
            </div>
        </div>
    );
};

export default Login;
