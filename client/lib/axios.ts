import axios, {AxiosRequestHeaders} from "axios";
import cookie from 'cookie';

const authApi = axios.create({
    baseURL: "http://localhost:5000/",
    withCredentials: true
});

authApi.interceptors.request.use((config) => {
    //const token = useAuthStore.getState().token;
    const token = cookie.parse(document.cookie).jwt
    config.headers = {
        Authorization: `Bearer ${token}`
    } as AxiosRequestHeaders;
    return config;
});

export default authApi;