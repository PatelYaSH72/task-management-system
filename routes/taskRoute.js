const express = require("express");

const {
  createTask,
} = require("../controller/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const taskRouter = express.Router();

// Create Task
taskRouter.post("/create",authMiddleware,createTask);

module.exports = taskRouter;