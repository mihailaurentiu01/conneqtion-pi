const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/dashboard", authMiddlewares.verifyToken, dashboardController.index);

module.exports = router;