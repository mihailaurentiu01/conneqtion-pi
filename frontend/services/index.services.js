const {store} = require("../src/store");
const Interceptor = require("../services/interceptors/response.interceptor");

exports.search = (query) => {
    Interceptor.searchEndpoint("/v1/user/search?query=" + query);
}