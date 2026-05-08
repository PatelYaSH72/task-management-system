const express = require("express");
const { registerUser, loginUser } = require("../controller/authController");
const authMiddleware = require("../middleware/authMiddleware");
const { addComment } = require("../controller/commentController");

const coommentRouter =  express.Router(); 

// coommentRouter.post("/add-comment",authMiddleware,addComment);
module.exports = coommentRouter;