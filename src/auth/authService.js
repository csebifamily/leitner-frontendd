import axios from 'axios';

let accessToken = "";

export function login(username, password) {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/login-user`, { username, password }, { withCredentials: true })
        .then((res) => {
            localStorage.setItem('isLoggedIn', 'true');
            accessToken = res.data.accessToken;
        })
}

export function logout() {
    return axios.post(`${import.meta.env.VITE_API_URL}/api/logout-user`, {}, { withCredentials: true })
        .then(() => {
            localStorage.setItem('isLoggedIn', 'false');
            accessToken = "";
        })
}

export const sajatFetch = axios.create();

sajatFetch.interceptors.request.use(
    (config) => {

        if(!accessToken) return config;

        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer: ${accessToken}`;

        return config;
        
    },
    (error) => Promise.reject(error)
);

sajatFetch.interceptors.response.use(
    (response) => response,
    async (error) => {
        
        if(!error.response || error.response.status !== 403) {
            return Promise.reject(error);
        }
        
        const originalRequest = error.config;

        if(originalRequest.isRetry) {
            return Promise.reject(error);
        }

        originalRequest.isRetry = true;

        try {
            const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/get-new-access-token`, { withCredentials: true })
            accessToken = res.data.accessToken;   
            
            return sajatFetch(originalRequest);
        } catch (error) {
            accessToken = "";
            window.location.href = "/bejelentkezes";
            return Promise.reject(error);
        }


        

    }
);