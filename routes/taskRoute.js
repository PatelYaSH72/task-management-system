const express = require("express");

const {
  createTask,
  getTasks,
  updateTaskStatus,
} = require("../controller/taskController");

const authMiddleware = require("../middleware/authMiddleware");

const taskRouter = express.Router();

// Create Task
taskRouter.post("/create",authMiddleware,createTask);
taskRouter.post("/getAll/:id",authMiddleware,getTasks);
taskRouter.post("/updateTask/:id",authMiddleware,updateTaskStatus);

module.exports = taskRouter;