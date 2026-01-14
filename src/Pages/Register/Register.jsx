import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Eye, EyeOff } from "lucide-react";
import districts from '../../../public/bangladesh_districts.json';
import { DotLottieReact } from "@lottiefiles/dotlottie-react";
import { Link } from "react-router-dom";

const bloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const Register = () => {
    const { register, handleSubmit, control, formState: { errors } } = useForm();
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedDistrict, setSelectedDistrict] = useState("");

    const onSubmit = (data) => {
        console.log(data);
    };

    return (
        <div className="max-w-7xl mx-auto my-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center px-5">
            {/* LEFT: FORM */}
            <div>
                <h2 className="text-4xl font-semibold text-primary">Register</h2>
                <p className="text-gray-500 mt-3 max-w-lg">
                    Join our blood donation community and make a difference. Fill the form below to get started.
                </p>

                <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-5">
                    {/* Avatar */}
                    <div className="space-y-2">
                        <Label htmlFor="avatar">Avatar</Label>
                        <Input
                            id="avatar"
                            type="file"
                            accept="image/*"
                            {...register("avatar", { required: "Avatar is required" })}
                        />
                        {errors.avatar && <p className="text-red-500 text-sm">{errors.avatar.message}</p>}
                    </div>

                    {/* Name & Email */}
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                placeholder="Your full name"
                                {...register("name", { required: "Name is required" })}
                            />
                            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                        </div>
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="your@email.com"
                                {...register("email", { required: "Email is required" })}
                            />
                            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Blood Group */}
                    {/* Blood Group */}
                    <div className="space-y-2">
                        <Label htmlFor="blood_group">Blood Group</Label>
                        <Controller
                            control={control}
                            name="blood_group"
                            defaultValue=""
                            rules={{ required: "Blood group is required" }}
                            render={({ field }) => (
                                <Select
                                    value={field.value}           // ✅ Bind value
                                    onValueChange={field.onChange} // ✅ Bind onChange
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {bloodGroups.map((bg) => (
                                            <SelectItem key={bg} value={bg}>
                                                {bg}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />
                        {errors.blood_group && (
                            <p className="text-red-500 text-sm">{errors.blood_group.message}</p>
                        )}
                    </div>

                    {/* District & Upazila */}
                    <div className="flex flex-col md:flex-row md:space-x-4 space-y-2 md:space-y-0">
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="district">District</Label>
                            <Controller
                                control={control}
                                name="district"
                                defaultValue=""
                                rules={{ required: "District is required" }}
                                render={({ field }) => (
                                    <Select
                                        {...field}
                                        onValueChange={(value) => {
                                            field.onChange(value);
                                            setSelectedDistrict(value);
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select District" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {districts.map((d) => (
                                                <SelectItem key={d.district_name} value={d.district_name}>
                                                    {d.district_name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.district && <p className="text-red-500 text-sm">{errors.district.message}</p>}
                        </div>

                        {/* Upazila */}
                        <div className="flex-1 space-y-2">
                            <Label htmlFor="upazila">Upazila</Label>
                            <Controller
                                control={control}
                                name="upazila"
                                defaultValue=""
                                rules={{ required: "Upazila is required" }}
                                render={({ field }) => (
                                    <Select
                                        value={field.value}                // ✅ Bind value
                                        onValueChange={field.onChange}     // ✅ Bind onChange
                                        disabled={!selectedDistrict}       // optional: disable until district selected
                                    >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Upazila" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {selectedDistrict &&
                                                districts
                                                    .find((d) => d.district_name === selectedDistrict)
                                                    ?.upazilas.map((u) => (
                                                        <SelectItem key={u.id} value={u.name}>
                                                            {u.name}
                                                        </SelectItem>
                                                    ))}
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                            {errors.upazila && (
                                <p className="text-red-500 text-sm">{errors.upazila.message}</p>
                            )}
                        </div>
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

                    {/* Confirm Password */}
                    <div className="relative space-y-2">
                        <Label htmlFor="confirm_password">Confirm Password</Label>
                        <Input
                            id="confirm_password"
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm password"
                            {...register("confirm_password", {
                                required: "Confirm password is required",
                                validate: (val, formValues) => val === formValues.password || "Passwords do not match"
                            })}
                        />
                        <span
                            className="absolute right-3 top-7 cursor-pointer"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <EyeOff /> : <Eye />}
                        </span>
                        {errors.confirm_password && <p className="text-red-500 text-sm">{errors.confirm_password.message}</p>}
                    </div>
                    {/* Already registered text */}
                    <p className="text-sm text-gray-500 text-center mt-2">
                        Already have an account?{" "}
                        <Link to="/login" className="text-primary font-medium hover:underline">
                            Login here
                        </Link>
                    </p>
                    <Button className="bg-primary w-full mt-4">Register</Button>
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

export default Register;
