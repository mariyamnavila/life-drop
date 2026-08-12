import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Eye, EyeOff } from "lucide-react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import useAuth from "@/hooks/useAuth";
import Swal from "sweetalert2";
import SocialLogin from "../shared/SocialLogin/SocialLogin";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const Login = () => {
    const { signIn } = useAuth();
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const onSubmit = (data) => {
        const { email, password } = data;
        executeLogin(email, password);
    };

    const executeLogin = (email, password) => {
        signIn(email, password)
            .then((result) => {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "Welcome back! You have been logged in successfully.",
                    confirmButtonText: "Continue",
                    confirmButtonColor: "#2563eb",
                    timer: 2500,
                    timerProgressBar: true
                });
                navigate(from, { replace: true });
            })
            .catch((error) => {
                console.log(error);
                Swal.fire({
                    icon: "error",
                    title: "Login Failed",
                    text: error?.message || "Something went wrong. Please try again.",
                    confirmButtonText: "Try Again",
                    confirmButtonColor: "#dc2626"
                });
            });
    };

    const handleDemoLogin = (email, password) => {
        setValue("email", email);
        setValue("password", password);
        executeLogin(email, password);
    };

    return (
        <div className="max-w-7xl mx-auto my-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-5">
            <Helmet>
                <title>Sign In | Life Drop</title>
                <meta name="description" content="Access your Life Drop donor dashboard and manage blood requests." />
            </Helmet>
            {/* LEFT: FORM */}
            <div className="md:p-8">
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
                        <Link
                            to="/register"
                            state={location.state}
                            className="text-primary font-medium hover:underline"
                        >
                            Register here
                        </Link>
                    </p>

                    <Button className="bg-primary w-full mt-2">Login</Button>
                </form>

                {/* Instant Demo Credentials Section */}
                <div className="mt-8 border-t pt-6">
                    <p className="text-sm font-semibold text-gray-700 mb-3">Instant Demo Login:</p>
                    <div className="grid grid-cols-3 gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex flex-col items-center justify-center p-4 h-auto border hover:border-primary hover:text-primary transition-all group"
                            onClick={() => handleDemoLogin("life@drop.com", "12345678")}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 group-hover:text-primary">Admin</span>
                            <span className="text-[10px] text-gray-400 truncate max-w-full">life@drop.com</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex flex-col items-center justify-center p-4 h-auto border hover:border-primary hover:text-primary transition-all group"
                            onClick={() => handleDemoLogin("ri.ro@ri.ro", "12345678")}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 group-hover:text-primary">Volunteer</span>
                            <span className="text-[10px] text-gray-400 truncate max-w-full">ri.ro@ri.ro</span>
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            className="flex flex-col items-center justify-center p-4 h-auto border hover:border-primary hover:text-primary transition-all group"
                            onClick={() => handleDemoLogin("bibimariyamnavila@gmail.com", "12345678")}
                        >
                            <span className="text-xs font-bold uppercase tracking-wider text-gray-800 group-hover:text-primary">Donor</span>
                            <span className="text-[10px] text-gray-400 truncate max-w-full text-ellipsis overflow-hidden">bibimariyam...</span>
                        </Button>
                    </div>
                </div>

                {/* Social Logins */}
                <SocialLogin />
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
