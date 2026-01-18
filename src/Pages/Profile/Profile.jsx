import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import useAuth from "@/hooks/useAuth";
import useAxiosSecure from "@/hooks/useAxiosSecure";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import districtsData from "@/assets/bangladesh_districts.json";
import { Skeleton } from "@/components/ui/skeleton";
import { Camera, Mail, MapPin, Droplet, User, CheckCircle2, XCircle, Loader2, Edit2, Save, X } from "lucide-react";

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

    // Load profile data
    const { data: profileData, isLoading } = useQuery({
        queryKey: ["profile", user?.email],
        enabled: !!user?.email && !authLoading,
        queryFn: async () => {
            const res = await axiosSecure.get(`/users/${user.email}`);
            const data = res.data;
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

    // Update profile mutation
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
            <div className="max-w-4xl mx-auto mt-8 px-4">
                <Card className="overflow-hidden">
                    <div className="h-32 bg-linear-to-r from-red-500 to-pink-500" />
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center -mt-20">
                            <Skeleton className="h-32 w-32 rounded-full border-4 border-white" />
                            <Skeleton className="h-8 w-48 mt-4" />
                            <Skeleton className="h-4 w-32 mt-2" />
                        </div>
                        <div className="mt-8 space-y-4">
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                            <Skeleton className="h-20 w-full" />
                        </div>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const handleChange = (key, value) => {
        setFormData((prev) => ({ ...prev, [key]: value }));

        // Reset upazila if district changes
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
            "A+": "bg-red-100 text-red-700 border-red-200",
            "A-": "bg-red-50 text-red-600 border-red-100",
            "B+": "bg-blue-100 text-blue-700 border-blue-200",
            "B-": "bg-blue-50 text-blue-600 border-blue-100",
            "AB+": "bg-purple-100 text-purple-700 border-purple-200",
            "AB-": "bg-purple-50 text-purple-600 border-purple-100",
            "O+": "bg-green-100 text-green-700 border-green-200",
            "O-": "bg-green-50 text-green-600 border-green-100",
        };
        return colors[bg] || "bg-gray-100 text-gray-700 border-gray-200";
    };

    return (
        <div className="max-w-4xl mx-auto mt-8 px-4 pb-8">
            {/* Success Alert */}
            {showSuccess && (
                <Alert className="mb-4 border-green-200 bg-green-50">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        Profile updated successfully!
                    </AlertDescription>
                </Alert>
            )}

            {/* Error Alert */}
            {showError && (
                <Alert className="mb-4 border-red-200 bg-red-50">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                        Failed to update profile. Please check all fields and try again.
                    </AlertDescription>
                </Alert>
            )}

            <Card className="overflow-hidden shadow-lg pt-0">
                {/* Header Banner */}
                <div className="h-32 bg-linear-to-r from-red-500 via-pink-500 to-rose-500 relative">
                    <div className="absolute top-4 right-4 flex gap-2">
                        {!isEditing ? (
                            <Button
                                size="sm"
                                onClick={() => setIsEditing(true)}
                                className="bg-white text-gray-800 hover:bg-gray-100"
                            >
                                <Edit2 className="h-4 w-4 mr-2" />
                                Edit Profile
                            </Button>
                        ) : (
                            <>
                                <Button
                                    size="sm"
                                    onClick={handleCancel}
                                    variant="outline"
                                    className="bg-white hover:bg-gray-100"
                                    disabled={updateProfile.isPending}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Cancel
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={handleSave}
                                    className="bg-white text-green-700 hover:bg-green-50"
                                    disabled={updateProfile.isPending}
                                >
                                    {updateProfile.isPending ? (
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                    ) : (
                                        <Save className="h-4 w-4 mr-2" />
                                    )}
                                    Save Changes
                                </Button>
                            </>
                        )}
                    </div>
                </div>

                <CardContent className="pt-6">
                    {/* Profile Picture Section */}
                    <div className="flex flex-col items-center -mt-20 mb-8">
                        <div className="relative">
                            <img
                                src={avatarPreview || formData.avatar || "https://via.placeholder.com/150"}
                                alt="Profile Avatar"
                                className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg"
                                onError={(e) => {
                                    e.target.src = "https://via.placeholder.com/150";
                                }}
                            />
                            {isEditing && (
                                <div className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg">
                                    <Camera className="h-5 w-5 text-gray-600" />
                                </div>
                            )}
                        </div>
                        <h1 className="text-2xl font-bold mt-4 text-gray-800">
                            {formData.name || "Your Name"}
                        </h1>
                        <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            {user?.email}
                        </p>
                        {formData.bloodGroup && !isEditing && (
                            <div className={`mt-3 px-4 py-1.5 rounded-full border-2 font-semibold ${getBloodGroupColor(formData.bloodGroup)}`}>
                                <Droplet className="h-4 w-4 inline mr-1" />
                                {formData.bloodGroup}
                            </div>
                        )}
                    </div>

                    {/* Avatar URL Input (when editing) */}
                    {isEditing && (
                        <div className="mb-6 max-w-2xl mx-auto">
                            <Label htmlFor="avatar" className="flex items-center gap-2">
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
                            <p className="text-xs text-gray-500 mt-1">
                                Enter a URL to your profile picture
                            </p>
                        </div>
                    )}

                    {/* Profile Information Grid */}
                    <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
                        {/* Name */}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2">
                                <User className="h-4 w-4" />
                                Full Name
                            </Label>
                            {isEditing ? (
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => handleChange("name", e.target.value)}
                                    placeholder="Enter your full name"
                                    className="w-full"
                                />
                            ) : (
                                <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
                                    {formData.name || "Not provided"}
                                </div>
                            )}
                        </div>

                        {/* Email (read-only) */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email Address
                            </Label>
                            <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-500">
                                {user?.email}
                            </div>
                        </div>

                        {/* District */}
                        <div className="space-y-2">
                            <Label htmlFor="district" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                District
                            </Label>
                            {isEditing ? (
                                <Select
                                    value={formData.district}
                                    onValueChange={(val) => handleChange("district", val)}
                                >
                                    <SelectTrigger id="district" className={'w-full'}>
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
                                <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
                                    {formData.district || "Not provided"}
                                </div>
                            )}
                        </div>

                        {/* Upazila */}
                        <div className="space-y-2">
                            <Label htmlFor="upazila" className="flex items-center gap-2">
                                <MapPin className="h-4 w-4" />
                                Upazila
                            </Label>
                            {isEditing ? (
                                <Select
                                    value={formData.upazila}
                                    onValueChange={(val) => handleChange("upazila", val)}
                                    disabled={!formData.district}
                                >
                                    <SelectTrigger id="upazila" className={'w-full'}>
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
                                <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
                                    {formData.upazila || "Not provided"}
                                </div>
                            )}
                        </div>

                        {/* Blood Group */}
                        <div className="space-y-2 md:col-span-2">
                            <Label htmlFor="bloodGroup" className="flex items-center gap-2">
                                <Droplet className="h-4 w-4" />
                                Blood Group
                            </Label>
                            {isEditing ? (
                                <Select
                                    value={formData.bloodGroup}
                                    onValueChange={(val) => handleChange("bloodGroup", val)}
                                >
                                    <SelectTrigger id="bloodGroup" className={'w-full'}>
                                        <SelectValue placeholder="Select Blood Group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
                                            (bg) => (
                                                <SelectItem key={bg} value={bg}>
                                                    <div className="flex items-center gap-2">
                                                        {bg}
                                                    </div>
                                                </SelectItem>
                                            )
                                        )}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <div className="px-3 py-2 border rounded-md bg-gray-50 text-gray-700">
                                    {formData.bloodGroup ? (
                                        <span className="flex items-center gap-2">
                                            <Droplet className="h-4 w-4" />
                                            {formData.bloodGroup}
                                        </span>
                                    ) : (
                                        "Not provided"
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Profile Completion Indicator */}
                    {!isEditing && (
                        <div className="mt-8 max-w-2xl mx-auto">
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700">
                                        Profile Completion
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {(() => {
                                            const fields = [
                                                formData.name,
                                                formData.district,
                                                formData.upazila,
                                                formData.bloodGroup,
                                                formData.avatar,
                                            ];
                                            const completed = fields.filter(Boolean).length;
                                            return Math.round((completed / fields.length) * 100);
                                        })()}%
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div
                                        className="bg-linear-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                        style={{
                                            width: `${(() => {
                                                const fields = [
                                                    formData.name,
                                                    formData.district,
                                                    formData.upazila,
                                                    formData.bloodGroup,
                                                    formData.avatar,
                                                ];
                                                const completed = fields.filter(Boolean).length;
                                                return Math.round((completed / fields.length) * 100);
                                            })()}%`,
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Profile;