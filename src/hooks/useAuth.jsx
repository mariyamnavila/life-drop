import { AuthContext } from "@/contexts/AuthContext/AuthContext";
import { use } from "react";


const useAuth = () => {
    const authInfo = use(AuthContext)
    return authInfo
};

export default useAuth;