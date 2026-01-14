import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import Swal from "sweetalert2";
import useAuth from "@/hooks/useAuth";

const SocialLogin = () => {
    const { signInWithGoogle } = useAuth()
    const handleGoogleLogin = () => {

        signInWithGoogle()
            .then(() => {
                Swal.fire({
                    icon: "success",
                    title: "Login Successful",
                    text: "You have logged in with Google.",
                    confirmButtonColor: "#2563eb",
                    timer: 2000,
                    timerProgressBar: true
                });
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
