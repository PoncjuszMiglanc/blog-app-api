const express = require("express");
const feedController = require("../controllers/feed");
const protect = require("../middleware/protectMiddleware");

const router = express.Router();

router.get("/posts", feedController.getPosts);
router.get("/posts/:id", feedController.getPost);
router.post("/post", protect, feedController.postPost);

module.exports = router;
