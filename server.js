const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const createUserTable = require("./model/userModel");
const createProjectTable = require("./model/projectModel");
const createProjectMembersTable = require("./model/projetcMemberModel");
const createTasksTable = require("./model/taskModel");
const createCommentModel = require("./model/commentModel");
const authRouter = require("./routes/authRoutes");
const projectRouter = require("./routes/projectRoutes");
const taskRouter = require("./routes/taskRoute");
const coommentRouter = require("./routes/commetRoute");

dotenv.config();

const app = express();
createUserTable();
createProjectTable()
createProjectMembersTable();
createTasksTable();
createCommentModel();
require('./config/db')

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Test Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Task Management API Running Successfully",
  });
});

app.use("/api/auth",authRouter);
app.use("/api/project",projectRouter);
app.use("/api/tasks",taskRouter);
app.use("/api/comment",coommentRouter);

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});