import Project from "../models/project.js";

export const getProjectsController = async (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  const page = parseInt(req.query.page) || 1;

  try {
    const projects = await Project.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json(projects);
  } catch (error) {
    console.error("Get projects error:", error.message); // <-- log actual error
    res.status(500).json({ message: "Server error" });
  }
};

export default getProjectsController;
