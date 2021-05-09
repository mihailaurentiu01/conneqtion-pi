const axios = require("axios");

exports.search = (query) => {
  axios.get("/v1/user/search?query=" + query).then(res => {
      console.log("search query completed");
      console.log(res);
  }).catch(err => console.log(err));
}