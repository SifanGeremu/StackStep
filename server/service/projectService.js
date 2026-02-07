import Project from "../models/project.js";

export const saveProject = async (techStack, llmOutput, userId) => {
  try {
    if (!llmOutput?.phases) {
      throw new Error("Invalid LLM output");
    }

    const project = new Project({
      user: userId,
      techStack,
      projectTitle: llmOutput.projectTitle,
      projectDescription: llmOutput.projectDescription,
      phases: llmOutput.phases,
    });

    return await project.save();
  } catch (error) {
    console.error("Error saving project:", error.message);
    return { error: "PROJECT_SAVE_FAILED" };
  }
};
