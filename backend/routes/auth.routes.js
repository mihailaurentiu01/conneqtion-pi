const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.post("/signup", authController.signup);
router.post("/login", authController.login);
router.post("/token", authMiddlewares.verifyRefreshToken, authController.getAccessToken);
router.get("/logout", authMiddlewares.verifyToken, authController.logout);

module.exports = router;