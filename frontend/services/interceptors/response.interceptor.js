import Axios from 'axios';
const {store} = require("../../src/store");
import * as keyNames from '../../src/keynames';

// TODO ADD INTERCEPTOR
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
                console.log(r.data)
                store.commit(keyNames.MUTATE_USER_ACCESS_TOKEN, r.data.data.accessToken);

                console.log(store.state.accessToken)
            }
        }).catch(err => console.log(err));
    }
    return response;
}, (error) => {
    console.log(error);
})