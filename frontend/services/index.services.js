const {store} = require("../src/store");
const axios = require("axios");

exports.search = (query) => {

    axios.get("/v1/user/search?query=" + query, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + store.state.accessToken
        },
        credentials: "include"
    }).then(res=> {

    }).catch(err => {});
}