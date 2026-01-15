import useAuth from "@/hooks/useAuth";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "./useAxiosSecure";

const useUserRole = () => {
    const { user, loading: authLoading } = useAuth();
    const axiosSecure = useAxiosSecure();

    const {
        data,
        isLoading: roleLoading,
        isError,
        error,
        refetch,
    } = useQuery({
        queryKey: ["user-role", user?.email],
        queryFn: async () => {
            // if (!user?.email) throw new Error("No user email");
            const res = await axiosSecure.get(`/users/${user.email}/role`);
            return res.data;
        },
        enabled: !!user?.email && !authLoading, // only run when user email exists
        staleTime: 5 * 60 * 1000, // 5 mins
        retry: false,
    });

    return {
        role: data?.role,
        status: data?.status,
        user: data, // backend role info
        isLoading: authLoading || roleLoading,
        isError,
        error,
        refetch,
    };
};

export default useUserRole;
