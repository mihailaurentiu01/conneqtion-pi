exports.search = (req, res, next) => {
    console.log(req.cookies);
    console.log(req.query.query)
    return res.status(200).json({message: "Welcome to the dashboard"});
}