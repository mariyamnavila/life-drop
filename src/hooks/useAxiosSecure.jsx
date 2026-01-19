import axios from 'axios';
import React from 'react';
import useAuth from './useAuth';
import { useNavigate } from 'react-router-dom';

const axiosSecure = axios.create({
    baseURL: `https://life-drop-server-five.vercel.app`
})

const useAxiosSecure = () => {
    const { user, logOut } = useAuth()
    const navigate = useNavigate()

    axiosSecure.interceptors.request.use((config) => {
        config.headers.Authorization = `Bearer ${user.accessToken}`
        return config;
    }, (error) => {
        return Promise.reject(error)
    })

    axiosSecure.interceptors.response.use((res) => {
        return res;
    }, async (error) => {
        const status = error.status || error.response.status;
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
    })

    return axiosSecure
};

export default useAxiosSecure;