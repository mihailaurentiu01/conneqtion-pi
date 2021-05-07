import Axios from 'axios';
const {store} = require("../../src/store");
const keyNames = require("../../src/keynames");

export const searchEndpoint = Axios.create({
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + store.state.accessToken
    },
    credentials: "include",
    validateStatus: () => true
});

searchEndpoint.interceptors.response.use(response => {
    if (response.status === 401) {
        let reqtoken = async () => {
            const tokenRequest = await Axios.post("/v1/auth/token", {
                withCredentials: true
            });

            return tokenRequest;
        }

        reqtoken().then(r => {
            if (r.status === 200) {
                store.commit(keyNames.MUTATE_USER_ACCESS_TOKEN, r.data.data.accessToken);
                response.config.headers.Authorization = "Bearer " + store.state.accessToken;
                return Axios.request(response.config);
            }
        }).then(res => {
            // todo res
            console.log(res);
        }).catch(err => console.log(err));
    }
}, error => {
    console.log(error)
})
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
