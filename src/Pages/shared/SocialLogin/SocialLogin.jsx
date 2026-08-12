import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";
import useAxios from "@/hooks/useAxios";
import { useLocation, useNavigate } from "react-router-dom";

const SocialLogin = () => {
    const { signInWithGoogle } = useAuth();
    const axiosInstance = useAxios();
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || "/";

    const handleGoogleLogin = () => {
        signInWithGoogle()
            .then(async (result) => {
                const userInfo = {
                    name: result.user.displayName,
                    email: result.user.email,
                    role: "donor", // Default role is donor
                    status: "active",
                    district: "",
                    upazila: "",
                    image: result.user.photoURL,
                    created_at: new Date().toISOString(),
                    last_logIn: new Date().toISOString(),
                };

                try {
                    // Sync user registration to the database
                    await axiosInstance.post("/users", userInfo);
                    
                    Swal.fire({
                        icon: "success",
                        title: "Login Successful",
                        text: "You have logged in with Google.",
                        confirmButtonColor: "#2563eb",
                        timer: 2000,
                        timerProgressBar: true
                    });
                    
                    navigate(from, { replace: true });
                } catch (error) {
                    Swal.fire({
                        icon: "error",
                        title: "Registration Sync Failed",
                        text: error.response?.data?.message || error.message || "Failed to sync user data.",
                        confirmButtonColor: "#dc2626"
                    });
                }
            })
            .catch((error) => {
                Swal.fire({
                    icon: "error",
                    title: "Google Login Failed",
                    text: error?.message || "Unable to login with Google.",
                    confirmButtonColor: "#dc2626"
                });
            });
    };

    return (
        <div className="mt-6">
            {/* Divider */}
            <div className="flex items-center gap-3 mb-4">
                <div className="grow border-t border-gray-200"></div>
                <span className="text-sm text-gray-500">or continue with</span>
                <div className="grow border-t border-gray-200"></div>
            </div>

            {/* Google Button */}
            <Button
                variant="outline"
                type="button"
                onClick={handleGoogleLogin}
                className="w-full flex items-center justify-center gap-3 py-6"
            >
                <FcGoogle size={22} />
                <span className="font-medium">Continue with Google</span>
            </Button>
        </div>
    );
};

export default SocialLogin;
