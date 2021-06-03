const router = require("express").Router();
const authMiddlewares = require("../middlewares/auth.middlewares");
const adminController = require("../controllers/admin.controller");

router.get("/users", authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, adminController.getAllUsers);
router.get("/userposts", authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, adminController.getUserPosts);
router.post("/deleteComment", authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, adminController.deleteComment);
router.post("/deletePost", authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, adminController.deletePost);
router.post("/ban", authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, adminController.banUser);
router.post("/globalMessage", authMiddlewares.verifyToken, authMiddlewares.verifyAdmin, adminController.globalMessage);

module.exports = router;