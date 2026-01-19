import axios from "axios";

const axiosInstance = axios.create({
    baseURL:'https://life-drop-server-five.vercel.app'
});

const useAxios = () => {
    return axiosInstance
};

export default useAxios;