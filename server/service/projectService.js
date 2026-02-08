import Project from "../models/project.js";

export const saveProject = async (techStack, llmOutput, userId) => {
  try {
    
    const plan = llmOutput?.plan || llmOutput;

    if (!plan || !Array.isArray(plan.phases)) {
      throw new Error("Invalid LLM output: missing phases");
    }

    const project = new Project({
      user: userId,
      techStack,
      projectTitle: plan.projectTitle,
      projectDescription: plan.projectDescription,
      phases: plan.phases,
    });

    const saved = await project.save();
    const obj = saved.toObject();
    
    if (obj._id && typeof obj._id !== "string") obj._id = obj._id.toString();
    if (obj.user && typeof obj.user !== "string")
      obj.user = obj.user.toString();
    return obj;
  } catch (error) {
    console.error("Error saving project:", error.message);
    return { error: true, message: error.message };
  }
};
