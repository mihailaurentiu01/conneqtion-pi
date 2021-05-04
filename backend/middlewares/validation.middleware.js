const {check, body} = require("express-validator");
const User = require("../models/user.model");

exports.checkEmail = check("email").isEmail().normalizeEmail().trim().withMessage("Invalid email")
.custom(value => {
    return User.findOne({email: value}).then(user => {
        if (user){
            return Promise.reject("That email is already registered");
        }
    })
});

exports.checkPassword = body("password","Password is not secure. Choose another one").custom(value => {
    let regPassword = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})");

    if (!regPassword.test(value)){
        return Promise.reject("Choose a stronger password");
    }

    return true;
})

exports.checkPasswordMatch = body("confirmPassword").custom((value, {req, next}) => {
    if (value !== req.body.password){
        throw new Error("Passwords do not match!");
    }

    return true;
});

exports.checkFullName = body("name").custom(value => {
    let regName = new RegExp("^[a-zA-Z\\s]*$");

    if (!regName.test(value) || value.length < 1){
        return Promise.reject("Invalid name. Length must be > 0 and only contain letters.");
    }

    return true;
});

exports.checkUsername = body("username").custom(value => {
    let regUsername = new RegExp("^[A-Za-z]\\w*$");

    if (!regUsername.test(value)){
        return Promise.reject("Invalid username. Must not start with a number nor be empty.")
    }

    return true;
});

exports.checkBirthDate = body("birthDate").custom(value => {
    let age = value ? getAge(value) : -1;
    if (!value || age < 18){
        return Promise.reject("Invalid birth date. The required minimum age is 18");
    }

    return true;
})

function getAge(dateString) {
    let today = new Date();
    let birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    let m = today.getMonth() - birthDate.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }

    return age;
}

exports.checkLocation = body("location").custom(value => {
    if (!value){
        return Promise.reject("Invalid location. Not specified.")
    }

    return true;
});

exports.checkTermsUse = body("statusTerms").custom(value => {
    if (!value){
        return Promise.reject("User has not accepted terms and conditions");
    }

    return true;
});

exports.checkPrivacyPolicy = body("statusPrivacy").custom(value => {
    if (!value){
        return Promise.reject("User has not accepted privacy policy");
    }

    return true;
});