const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;