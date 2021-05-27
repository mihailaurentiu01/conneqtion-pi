// TODO MIGRATE TO AXIOS
const axios = require("axios");

exports.doSignup = async (user) => {
    let data = fetch("/v1/auth/signup", {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: user.email,
            password: user.password,
            confirmPassword: user.confirmPassword,
            name: user.name,
            username: user.username,
            birthDate: user.birthDate,
            location: user.location,
            statusTerms: user.statusTerms,
            statusPrivacy: user.statusPrivacy
        })
    }).then(result => {
        return result.json();
    }).then(jsonResult => {
        if (jsonResult.errors !== undefined){
            return jsonResult.errors;
        }

        return jsonResult;
    }).catch(err => console.log(err));


    return await data;
}

exports.doLogin = async (user) => {
    let data = fetch("/v1/auth/login", {
        method: "POST",
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: user.email,
            password: user.password
        })
    }).then(result => {

        return result.json();
    }).then(jsonResult => {
        return jsonResult;
    }).catch(err => console.log(err));

    return await data;
}

exports.doLogout = async (notifications) => {
    return await axios.post("/v1/auth/logout", {notifications}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}

/*
exports.requestForgetPassword = async (email) => {
    return await axios.post("/v1/auth/forgot", {email}).then(async (res) => {
        return res;
    }).catch(err => console.log(err));
}*/
