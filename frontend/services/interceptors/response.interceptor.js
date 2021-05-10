import Axios from 'axios';
const {store} = require("../../src/store");
const keyNames = require("../../src/keynames");

Axios.interceptors.request.use(config => {
    const token = store.state.accessToken;
    if (token){
        config.headers['Authorization'] = 'Bearer ' + token;
    }
    // TODO SET CONTENT-TYPE
    return config;
}, error => Promise.reject(error));

// Response interceptor

Axios.interceptors.response.use(response => {
    return response;
}, error => {
    const originalRequest = error.config;

    if (error.response.status === 401 && originalRequest.url === "http://localhost:3000/v1/auth/token"){
        console.log("must login?");
        return;
    }

    if (error.response.status === 401 && !originalRequest._retry){
        originalRequest._retry = true;
        return Axios.post("/v1/auth/token", {}, {
                withCredentials: true,
                validateStatus: () => true
            }
        ).then(res => {
            if (res.status === 200) {
                store.commit(keyNames.MUTATE_USER_ACCESS_TOKEN, res.data.data.accessToken);
                Axios.defaults.headers.common["Authorization"] = 'Bearer ' + store.state.accessToken;
                return Axios.request(originalRequest);
            }
        })
    }

    return Promise.reject(error)
});