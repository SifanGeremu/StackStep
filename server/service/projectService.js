import Project from "../models/project.js";



export const saveProject = async (techStack, llmOutput) => {
  try {
    if (!llmOutput || !Array.isArray(llmOutput.phases)) {
      throw new Error("Invalid LLM output");
    }

    const mappedPhases = llmOutput.phases.map((phase, pIdx) => ({
      title: phase.title || `Phase ${pIdx}`,
      description: phase.purpose || "", // 🔑 purpose → description
      order: phase.order ?? pIdx,

      tasks: Array.isArray(phase.tasks)
        ? phase.tasks.map((task, tIdx) => ({
            title: `Task ${tIdx + 1}`, // 🔑 generated (LLM doesn't provide)
            description: task.description || "",
            expectedOutcome: task.description || "", // 🔑 derived
            order: task.order ?? tIdx,
          }))
        : [],

      definitionOfDone: Array.isArray(phase.definitionOfDone)
        ? phase.definitionOfDone
        : [],
    }));

    const project = new Project({
      techStack,
      projectTitle: llmOutput.projectTitle,
      projectDescription: llmOutput.projectDescription,
      phases: mappedPhases,
    });

    return await project.save();
  } catch (error) {
    console.error("Error saving project:", error.message);
    return { error: "PROJECT_SAVE_FAILED" };
  }
};
