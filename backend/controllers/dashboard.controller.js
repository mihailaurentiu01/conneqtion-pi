exports.index = (req, res, next) => {
    console.log(req.cookies);
    return res.status(200).json({message: "Welcome to the dashboard"});
}