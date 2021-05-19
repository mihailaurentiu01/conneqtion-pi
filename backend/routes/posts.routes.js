const router = require("express").Router();

const authMiddlewares = require("../middlewares/auth.middlewares");
const postsController = require("../controllers/posts.controller");
const {checkTitle, checkDescription} = require("../middlewares/validation.middleware");


router.post("/add", [authMiddlewares.verifyToken, checkTitle], postsController.add);
module.exports = router;


