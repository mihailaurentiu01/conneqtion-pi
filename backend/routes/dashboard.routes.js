const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/search", authMiddlewares.verifyToken, dashboardController.search);
router.get("/test", authMiddlewares.verifyToken, dashboardController.test);
router.post("/addFriend", authMiddlewares.verifyToken, dashboardController.addFriend);
router.get("/pendingFriends", authMiddlewares.verifyToken, dashboardController.pendingFriends);
router.post("/friendReqStatus", authMiddlewares.verifyToken, dashboardController.friendReqStatus);
router.get("/pendingNotifications", authMiddlewares.verifyToken, dashboardController.pendingNotifications);
router.post("/statusAccept", authMiddlewares.verifyToken, dashboardController.statusAccept);
router.get("/get", authMiddlewares.verifyToken, dashboardController.getUserInfo);
router.post("/changemail", authMiddlewares.verifyToken, dashboardController.changeEmail);
router.post("/changepass", authMiddlewares.verifyToken, dashboardController.changePassword);
module.exports = router;