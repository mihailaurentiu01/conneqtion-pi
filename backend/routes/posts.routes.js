const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const postsController = require("../controllers/posts.controller");
const {checkTitle, checkDescription} = require("../middlewares/validation.middleware");


router.post("/add", [authMiddlewares.verifyToken, checkTitle], postsController.add);
router.get("/all", authMiddlewares.verifyToken, postsController.getAll);
router.get("/friendsPosts", authMiddlewares.verifyToken, postsController.getFriendsPosts);
router.post("/update", authMiddlewares.verifyToken, postsController.update);
router.post("/delete", authMiddlewares.verifyToken, postsController.delete);

module.exports = router;