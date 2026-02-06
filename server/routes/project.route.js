import express from "express";
import { createProjectController } from "../controller/project.controller.js";
import getProjectsController from "../controller/getProject.controller.js";
const router = express.Router();
//generate projects
router.post("/projects", createProjectController);
//get projects
router.get("/projects", getProjectsController);

export default router;
