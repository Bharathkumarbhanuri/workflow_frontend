import axios from "axios";
import { updateGlobalLoading } from "./loadingStore";


export const http = axios.create({
    baseURL: "http://localhost:8080",
    headers: {
        "Content-Type": "application/json",
    },
});

http.interceptors.request.use(
    (config) => {
        updateGlobalLoading(1);
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        updateGlobalLoading(-1);
        return Promise.reject(error);
    }
);

http.interceptors.response.use(
    (response) => {
        updateGlobalLoading(-1);
        return response;
    },
    (error) => {
        updateGlobalLoading(-1);

        // Check if error response exists and status is 401
        if (error.response && error.response.status === 401) {
            // Token expired or unauthorized, clear localStorage and redirect to login
            localStorage.removeItem('token');  // Remove expired token
            window.location.href = '/login';  // Redirect to login page
        }
        
        return Promise.reject(error);
    }
);


