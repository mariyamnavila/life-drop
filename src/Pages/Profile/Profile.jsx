import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import districtsData from "@/assets/bangladesh_districts.json";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Mail, MapPin, Droplet, User, CheckCircle2, XCircle, Loader2, Edit2, Save, X } from "lucide-react";
import { Helmet } from "react-helmet-async";

const Profile = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();

    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        district: "",
        upazila: "",
        bloodGroup: "",
        avatar: "",
    });
    const [avatarPreview, setAvatarPreview] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [showError, setShowError] = useState(false);

    const { data: profileData, isLoading } = useQuery({
        queryKey: ["profile", user?.email],
        enabled: !!user?.email && !authLoading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            const data = res.data.data;
            setFormData({
                name: data.name || "",
                district: data.district || "",
                upazila: data.upazila || "",
                bloodGroup: data.blood_group || "",
                avatar: data.image || "",
            });
            setAvatarPreview(data.image || "");
            return data;
        },
    });

    const updateProfile = useMutation({
        mutationFn: async (updatedData) => {
            const res = await axiosSecure.put(`/users/${user.email}`, updatedData);
            return res.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["profile", user?.email]);
            setIsEditing(false);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: () => {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
        },
    });

    if (authLoading || isLoading) {
        return (
            <div className="max-w-3xl mx-auto mt-8 px-4 space-y-6">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-20 w-20 rounded-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-6 w-40" />
                        <Skeleton className="h-4 w-56" />
                    </div>
                </div>
                <Skeleton className="h-64 w-full rounded-lg" />
            </div>
        );
    }

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
        if (key === "district") {
            setFormData((prev) => ({ ...prev, upazila: "" }));
        }
    };

    const handleAvatarChange = (e) => {
        const url = e.target.value;
        handleChange("avatar", url);
        setAvatarPreview(url);
    };

    const handleSave = () => {
        if (!formData.name.trim()) {
            setShowError(true);
            setTimeout(() => setShowError(false), 3000);
            return;
        }
        updateProfile.mutate({
            name: formData.name,
            district: formData.district,
            upazila: formData.upazila,
            blood_group: formData.bloodGroup,
            image: formData.avatar,
        });
    };

    const handleCancel = () => {
        setFormData({
            name: profileData?.name || "",
            district: profileData?.district || "",
            upazila: profileData?.upazila || "",
            bloodGroup: profileData?.blood_group || "",
            avatar: profileData?.image || "",
        });
        setAvatarPreview(profileData?.image || "");
        setIsEditing(false);
    };

    const selectedDistrict = districtsData.find(
        (d) => d.district_name === formData.district
    );

    const getBloodGroupColor = (bg) => {
        const colors = {
            "A+": "bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800",
            "A-": "bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-800",
            "B+": "bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
            "B-": "bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800",
            "AB+": "bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
            "AB-": "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800",
            "O+": "bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800",
            "O-": "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800",
        };
        return colors[bg] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600";
    };

    const completionPercent = (() => {
        const fields = [formData.name, formData.district, formData.upazila, formData.bloodGroup, formData.avatar];
        const completed = fields.filter(Boolean).length;
        return Math.round((completed / fields.length) * 100);
    })();

    return (
        <div className="mt-8 px-4 pb-10">
            <Helmet>
                <title>User Profile | Life Drop</title>
                <meta name="description" content="View and update your profile details, district, upazila, and blood group." />
            </Helmet>

            {showSuccess && (
                <Alert className="mb-4 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20">
                    <CheckCircle2 className="h-4 w-4 text-green-600 dark:text-green-400" />
                    <AlertDescription className="text-green-800 dark:text-green-300">
                        Profile updated successfully!
                    </AlertDescription>
                </Alert>
            )}

            {showError && (
                <Alert className="mb-4 border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                    <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
                    <AlertDescription className="text-red-800 dark:text-red-300">
                        Failed to update profile. Please check all fields and try again.
                    </AlertDescription>
                </Alert>
            )}

            {/* Header Section */}
            <div className="flex flex-col md:flex-row items-center md:items-start gap-5 mb-8">
                <div className="relative shrink-0">
                    <img
                        src={avatarPreview || formData.avatar || "https://via.placeholder.com/150"}
                        alt="Profile Avatar"
                        className="h-20 w-20 rounded-full object-cover border-2 border-border shadow-sm"
                        onError={(e) => { e.target.src = "https://via.placeholder.com/150"; }}
                    />
                    {isEditing && (
                        <div className="absolute bottom-0 right-0 bg-bg-default border border-border rounded-full p-1.5 shadow-sm">
                            <Camera className="h-3.5 w-3.5 text-text-muted" />
                        </div>
                    )}
                </div>
                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-xl font-bold text-text-primary break-words">
                        {formData.name || "Your Name"}
                    </h1>
                    <p className="text-sm text-text-muted flex items-center gap-1 justify-center md:justify-start mt-0.5 break-all">
                        <Mail className="h-3.5 w-3.5 shrink-0" />
                        {user?.email}
                    </p>
                    {formData.bloodGroup && !isEditing && (
                        <div className={`mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getBloodGroupColor(formData.bloodGroup)}`}>
                            <Droplet className="h-3 w-3" />
                            {formData.bloodGroup}
                        </div>
                    )}
                </div>
                <div className="shrink-0 mt-3 md:mt-0">
                    {!isEditing ? (
                        <Button size="sm" onClick={() => setIsEditing(true)}>
                            <Edit2 className="h-4 w-4 mr-1.5" />
                            Edit Profile
                        </Button>
                    ) : (
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={handleCancel} disabled={updateProfile.isPending}>
                                <X className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                            <Button size="sm" onClick={handleSave} disabled={updateProfile.isPending}>
                                {updateProfile.isPending ? (
                                    <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4 mr-1" />
                                )}
                                Save
                            </Button>
                        </div>
                    )}
                </div>
            </div>

            {/* Profile Card */}
            <Card>
                <CardContent className="p-6">
                    {/* Avatar URL Input */}
                    {isEditing && (
                        <div className="mb-6 pb-6 border-b border-border">
                            <Label htmlFor="avatar" className="flex items-center gap-2 text-sm">
                                <Camera className="h-4 w-4" />
                                Profile Picture URL
                            </Label>
                            <Input
                                id="avatar"
                                value={formData.avatar}
                                onChange={handleAvatarChange}
                                placeholder="https://example.com/your-photo.jpg"
                                className="mt-2"
                            />
                        </div>
                    )}

                    <div className="grid lg:grid-cols-2 gap-x-8 gap-y-5">
                        {/* Name */}
                        <div className="space-y-1.5">
                            <Label htmlFor="name" className="flex items-center gap-1.5 text-sm">
                                <User className="h-3.5 w-3.5" />
                                Full Name
                            </Label>
                            {isEditing ? (
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Enter your full name"
                                />
                            ) : (
                                <p className="text-sm text-text-primary py-2">
                                    {formData.name || "Not provided"}
                                </p>
                            )}
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-1.5 text-sm">
                                <Mail className="h-3.5 w-3.5" />
                                Email Address
                            </Label>
                            <p className="text-sm text-text-muted py-2">
                                {user?.email}
                            </p>
                        </div>

                        {/* District */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-1.5 text-sm">
                                <MapPin className="h-3.5 w-3.5" />
                                District
                            </Label>
                            {isEditing ? (
                                <Select value={formData.district} onValueChange={(val) => handleChange("district", val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select District" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {districtsData.map((d) => (
                                            <SelectItem key={d.district_name} value={d.district_name}>
                                                {d.district_name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-text-primary py-2">
                                    {formData.district || "Not provided"}
                                </p>
                            )}
                        </div>

                        {/* Upazila */}
                        <div className="space-y-1.5">
                            <Label className="flex items-center gap-1.5 text-sm">
                                <MapPin className="h-3.5 w-3.5" />
                                Upazila
                            </Label>
                            {isEditing ? (
                                <Select
                                    value={formData.upazila}
                                    onValueChange={(val) => handleChange("upazila", val)}
                                    disabled={!formData.district}
                                >
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={formData.district ? "Select Upazila" : "Select District First"} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {selectedDistrict?.upazilas?.map((u) => (
                                            <SelectItem key={u.name} value={u.name}>
                                                {u.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-text-primary py-2">
                                    {formData.upazila || "Not provided"}
                                </p>
                            )}
                        </div>

                        {/* Blood Group */}
                        <div className="space-y-1.5 lg:col-span-2">
                            <Label className="flex items-center gap-1.5 text-sm">
                                <Droplet className="h-3.5 w-3.5" />
                                Blood Group
                            </Label>
                            {isEditing ? (
                                <Select value={formData.bloodGroup} onValueChange={(val) => handleChange("bloodGroup", val)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((bg) => (
                                            <SelectItem key={bg} value={bg}>{bg}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <p className="text-sm text-text-primary py-2">
                                    {formData.bloodGroup || "Not provided"}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Completion Bar */}
                    {!isEditing && (
                        <div className="mt-8 pt-6 border-t border-border">
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-medium text-text-muted">Profile Completion</span>
                                <span className="text-xs font-semibold text-text-primary">{completionPercent}%</span>
                            </div>
                            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                                <div
                                    className="bg-primary h-1.5 rounded-full transition-all duration-500"
                                    style={{ width: `${completionPercent}%` }}
                                />
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;
