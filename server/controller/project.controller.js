import generateProjectPlan from "../services/llmService.js";
import { saveProject } from "../services/projectService.js";

export const createProjectController = async (req, res) => {
  const { techStack, experienceLevel } = req.body;

  try {
    // Generate LLM plan
    const llmPlan = await generateProjectPlan(techStack, experienceLevel);

    if (!llmPlan || llmPlan.error) {
      return res.status(500).json({ message: "LLM generation failed" });
    }

    // Save to MongoDB
    const savedProject = await saveProject(techStack, llmPlan);

    if (savedProject.error) {
      return res.status(500).json({ message: "Project save failed" });
    }

    return res
      .status(201)
      .json({ message: "Project created successfully", project: savedProject });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
