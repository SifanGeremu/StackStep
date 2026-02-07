import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createProjectController } from "../controller/project.controller.js";
import getProjectsController from "../controller/getProject.controller.js";
const router = express.Router();
//generate projects
router.post("/projects", authMiddleware, createProjectController);
//get projects
router.get("/projects", authMiddleware, getProjectsController);

export default router;
