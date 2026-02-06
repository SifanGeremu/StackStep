import Project from "../models/project.js";

/**
 * Save LLM-generated project plan to MongoDB
 * @param {string} techStack
 * @param {object} llmPlan - The structured LLM output
 */
export const saveProject = async (techStack, llmPlan) => {
  try {
    // Transform LLM output to match schema
    const transformed = {
      techStack,
      projectTitle: llmPlan.projectTitle,
      projectDescription: llmPlan.projectDescription,
      phases: llmPlan.phases.map((phase) => ({
        title: phase.title,
        description: phase.description,
        order: phase.order,
        tasks: phase.tasks.map((task) => ({
          title: task.title,
          description: task.description,
          expectedOutcome: task.expectedOutcome,
          order: task.order,
        })),
      })),
    };

    // Create new Project instance
    const project = new Project(transformed);

    // Validate
    await project.validate();

    // Save to MongoDB
    const savedProject = await project.save();
    console.log(
      `Project saved: ${savedProject._id} (${savedProject.projectTitle})`,
    );

    return savedProject;
  } catch (error) {
    console.error("Error saving project:", error.message);
    return { error: "PROJECT_SAVE_FAILED" };
  }
};
