const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/search", authMiddlewares.verifyToken, dashboardController.search);
router.get("/test", authMiddlewares.verifyToken, dashboardController.test);

module.exports = router;