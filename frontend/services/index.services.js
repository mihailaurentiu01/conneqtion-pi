const {store} = require("../src/store");
const axios = require("axios");

exports.search = (query) => {

    axios.get("/v1/user/search?query=" + query, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + store.state.accessToken
        },
        credentials: "include",
        validateStatus: () => true
    }).then(res=> {
        // todo do smth w res
    }).catch(err => {});
}