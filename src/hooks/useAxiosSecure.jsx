import axios from 'axios';
import React, { useEffect } from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
    baseURL: `https://life-drop-server-five.vercel.app`
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth()
    const navigate = useNavigate()

    useEffect(() => {
        const requestInterceptor = axiosSecure.interceptors.request.use(async (config) => {
            if (user) {
                try {
                    const token = await user.getIdToken();
                    config.headers.Authorization = `Bearer ${token}`;
                } catch (err) {
                    console.error("Error getting ID token:", err);
                }
            }
            return config;
        }, (error) => {
            return Promise.reject(error)
        });

        const responseInterceptor = axiosSecure.interceptors.response.use((res) => {
            return res;
        }, async (error) => {
            const status = error.status || error.response?.status;
            if (error.response && status === 403) {
                navigate('/unauthorized')
            } else if (error.response && status === 401) {
                logOut()
                    .then(() => {
                        navigate('/login')
                    })
                    .catch((err) => {
                        console.error("error during logout", err);
                    })
            }
            return Promise.reject(error)
        });

        // Cleanup interceptors when component unmounts or user changes
        return () => {
            axiosSecure.interceptors.request.eject(requestInterceptor);
            axiosSecure.interceptors.response.eject(responseInterceptor);
        };
    }, [user, navigate, logOut]);

    return axiosSecure
};

export default useAxiosSecure;