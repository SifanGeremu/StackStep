export const createProjectController = async (req, res) => {
  const { techStack, experienceLevel } = req.body;
  const userId = req.userId; 

  try {
    const llmPlan = await generateProjectPlan(techStack, experienceLevel);

    if (!llmPlan || llmPlan.error) {
      return res.status(500).json({ message: "LLM generation failed" });
    }

    const savedProject = await saveProject(techStack, llmPlan.plan, userId);

    if (savedProject.error) {
      return res.status(500).json({ message: "Project save failed" });
    }

    return res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
