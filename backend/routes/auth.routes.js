const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const validationMiddlewares = require("../middlewares/validation.middleware");

router.post("/signup",[validationMiddlewares.checkEmail, validationMiddlewares.checkPassword, validationMiddlewares.checkPasswordMatch,
validationMiddlewares.checkFullName, validationMiddlewares.checkUsername, validationMiddlewares.checkBirthDate, validationMiddlewares.checkLocation,
validationMiddlewares.checkTermsUse, validationMiddlewares.checkPrivacyPolicy], authController.signup);

router.post("/login", authController.login);
router.post("/token", authMiddlewares.verifyRefreshToken, authController.getAccessToken);
router.get("/logout", authMiddlewares.verifyToken, authController.logout);

module.exports = router;