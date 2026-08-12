import axios from 'axios';
import { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';
import { auth } from "@/firebase/firebase.init";

const axiosSecure = axios.create({
    baseURL: `https://life-drop-server-five.vercel.app`
});

// Synchronous, global request interceptor.
// Runs immediately on import, preventing timing races during query rendering.
axiosSecure.interceptors.request.use(async (config) => {
    const user = auth.currentUser;
    if (user) {
        try {
            const token = await user.getIdToken();
            config.headers.Authorization = `Bearer ${token}`;
        } catch (err) {
            console.error("Error getting ID token in interceptor:", err);
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

const useAxiosSecure = () => {
    const { logOut } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const responseInterceptor = axiosSecure.interceptors.response.use((res) => {
            return res;
        }, async (error) => {
            const status = error.status || error.response?.status;
            if (error.response && (status === 401 || status === 403)) {
                logOut()
                    .then(() => {
                        navigate('/login');
                    })
                    .catch((err) => {
                        console.error("error during logout", err);
                    });
            }
            return Promise.reject(error);
        });

        return () => {
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [navigate, logOut]);

    return axiosSecure;
};

export default useAxiosSecure;