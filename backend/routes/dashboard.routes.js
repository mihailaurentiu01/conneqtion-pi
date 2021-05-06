const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/search", authMiddlewares.verifyToken, dashboardController.search);

module.exports = router;