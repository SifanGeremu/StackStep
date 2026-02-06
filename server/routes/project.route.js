import express from "express";
import { createProjectController } from "../controller/project.controller";
const router = express.Router();
//generate projects
router.post("/projects", createProjectController);
//get projects
router.get("/projects", createProjectController);
