const express = require("express");


const authMiddleware = require("../middleware/authMiddleware");
const { createProject, getProjects, addProjectMember } = require("../controller/projectController");

const projectRouter = express.Router();

// Create Project
projectRouter.post("/create",authMiddleware,createProject);
projectRouter.post("/getALlProjets",authMiddleware,getProjects);
projectRouter.post("/add-member",authMiddleware,addProjectMember);

module.exports = projectRouter;