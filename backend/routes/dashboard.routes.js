const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const dashboardController = require("../controllers/dashboard.controller");

router.get("/search", authMiddlewares.verifyToken, dashboardController.search);
router.get("/test", authMiddlewares.verifyToken, dashboardController.test);
router.post("/addFriend", authMiddlewares.verifyToken, dashboardController.addFriend);
router.get("/pendingFriends", authMiddlewares.verifyToken, dashboardController.pendingFriends);
router.post("/friendReqStatus", authMiddlewares.verifyToken, dashboardController.friendReqStatus);
module.exports = router;