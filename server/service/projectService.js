import Project from "../models/project.js";

export const saveProject = async (techStack, llmOutput) => {
  try {
    if (!llmOutput) throw new Error("LLM output is missing");

    const phases = Array.isArray(llmOutput.phases) ? llmOutput.phases : [];

    const mappedPhases = phases.map((phase, idx) => ({
      title: phase.title || `Phase ${idx}`,
      description: phase.description || "",
      order: phase.order ?? idx,
      tasks: Array.isArray(phase.tasks)
        ? phase.tasks.map((task, tIdx) => ({
            title: task.title || `Task ${tIdx}`,
            description: task.description || "",
            expectedOutcome: task.expectedOutcome || "",
            order: task.order ?? tIdx,
          }))
        : [],
    }));

    const project = new Project({
      techStack,
      projectTitle: llmOutput.projectTitle || "Untitled Project",
      projectDescription: llmOutput.projectDescription || "",
      phases: mappedPhases,
    });

    return await project.save();
  } catch (error) {
    console.error("Error saving project:", error.message);
    return { error: "PROJECT_SAVE_FAILED" };
  }
};
