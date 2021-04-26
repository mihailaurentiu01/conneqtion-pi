exports.index = (req, res, next) => {
    return res.status(200).json({message: "Welcome to the dashboard"});
}