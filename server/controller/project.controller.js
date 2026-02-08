import { generateProjectPlan } from "../service/llm.service.js";
import { saveProject } from "../service/projectService.js";

export const createProjectController = async (req, res) => {
  const { techStack, experienceLevel } = req.body;
  const userId = req.userId;

  try {
    const llmPlan = await generateProjectPlan(techStack, experienceLevel);

    if (!llmPlan || llmPlan.error) {
      return res
        .status(500)
        .json({ error: true, message: "LLM generation failed" });
    }

    // Pass the whole llmPlan (wrapper) into saveProject
    const savedProject = await saveProject(techStack, llmPlan, userId);

    if (savedProject?.error) {
      return res
        .status(500)
        .json({
          error: true,
          message: savedProject.message || "Failed to save project",
        });
    }

    return res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: true, message: error.message });
  }
};
