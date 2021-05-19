let {validationResult} = require("express-validator");

exports.add = (req, res, next) => {
    let errors = validationResult(req);
    const errorsBack = [];

    if (!errors.isEmpty()){
        errors.errors.map(error => errorsBack.push(error.msg));

        return res.status(401).json({errors: errorsBack});
    }

    // ADd the post


}