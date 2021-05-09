import Axios from 'axios';
const {store} = require("../../src/store");
const keyNames = require("../../src/keynames");

/*export const searchEndpoint = Axios.create({
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + store.state.accessToken
    },
    credentials: "include",
    validateStatus: () => true
});*/

Axios.interceptors.request.use(config => {
    const token = store.state.accessToken;
    if (token){
        config.headers['Authorization'] = 'Bearer ' + token;
    }

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


/*
Axios.interceptors.response.use( (response) => {
    if (response.status === 401){
        let reqtoken = async () => {
            const tokenRequest = await Axios.post("/v1/auth/token", {
                withCredentials: true
            });

            return tokenRequest;
        }

        reqtoken().then(r => {
            if (r.status === 200){
                store.commit(keyNames.MUTATE_USER_ACCESS_TOKEN, r.data.data.accessToken);
                response.config.headers.Authorization = "Bearer " + store.state.accessToken;
                return Axios.request(response.config);
            }
        }).then(res => {
            console.log(res);
        }).catch(err => console.log(err));
    }
    return response;
}, (error) => {
    console.log(error);
})*/
