import Project from "../models/project.js";

export const saveProject = async (techStack, llmOutput) => {
  try {
    if (!llmOutput?.phases) {
      throw new Error("Invalid LLM output");
    }

    const project = new Project({
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
