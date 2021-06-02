const router = require("express").Router();
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
const validationMiddlewares = require("../middlewares/validation.middleware");

router.post("/signup",[validationMiddlewares.checkEmail, validationMiddlewares.checkPassword, validationMiddlewares.checkPasswordMatch,
validationMiddlewares.checkFullName, validationMiddlewares.checkUsername, validationMiddlewares.checkBirthDate, validationMiddlewares.checkLocation,
validationMiddlewares.checkTermsUse, validationMiddlewares.checkPrivacyPolicy], authController.signup);

// TODO ADD MIDDLEWARE VALIDATION FOR LOGIN
router.post("/login", authController.login);
router.post("/token", authMiddlewares.verifyRefreshToken, authController.getAccessToken);
router.post("/logout", authMiddlewares.verifyToken, authController.logout);
router.post("/adminlogin", authController.adminLogin);

module.exports = router;