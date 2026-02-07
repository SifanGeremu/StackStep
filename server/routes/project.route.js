import express from "express";
import authMiddleware from "../middleware/auth.js";
import { createProjectController } from "../controller/project.controller.js";
import getProjectsController from "../controller/getProject.controller.js";
import Project from "../models/project.js";

const router = express.Router();

// Generate new project (POST /api/projects/generate)
router.post("/generate", authMiddleware, createProjectController);

// Get all user's projects (GET /api/projects)
router.get("/", authMiddleware, getProjectsController);

// Get single project by ID (GET /api/projects/:id)
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;

    // prevent invalid IDs from reaching database
    if (!projectId || projectId === "undefined" || projectId.length !== 24) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user?._id || req.user?.id || req.user;

    // If the project has an owner, ensure it matches the authenticated user.
    if (project.user && project.user.toString() !== (userId || "").toString()) {
      return res.status(404).json({ message: "Project not found" });
    }

    return res.status(200).json(project);
  } catch (error) {
    console.error("Project detail error:", error);

    // Handle Mongoose invalid ObjectId error gracefully
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid project ID format" });
    }

    // All other errors
    return res.status(500).json({ message: "Server error" });
  }
});

// Delete project (DELETE /api/projects/:id)
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const projectId = req.params.id;

    // basic validation
    if (!projectId || projectId === "undefined" || projectId.length !== 24) {
      return res.status(400).json({ message: "Invalid project ID" });
    }

    // Fetch project first
    const project = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const userId = req.user?._id || req.user?.id || req.user;

    // If project has an owner, ensure the requester is the owner.
    if (project.user && project.user.toString() !== (userId || "").toString()) {
      return res
        .status(404)
        .json({ message: "Project not found or access denied" });
    }

    
    if (!project.user) {
      console.warn(
        `Deleting legacy project without owner: ${projectId} by user ${userId}`,
      );
    }

    await Project.deleteOne({ _id: projectId });

    return res.status(200).json({ success: true, message: "Project deleted" });
  } catch (error) {
    console.error("Project delete error:", error);
    if (error.name === "CastError") {
      return res.status(400).json({ message: "Invalid project ID format" });
    }
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
