import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  expectedOutcome: { type: String },
  order: { type: Number, required: true },
});

const PhaseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  order: { type: Number, required: true },
  tasks: [TaskSchema],
});

const ProjectSchema = new mongoose.Schema({
  techStack: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String },
  phases: [PhaseSchema],
  createdAt: { type: Date, default: Date.now },
});

//index for fast retrieval
ProjectSchema.index({ createdAt: -1 });

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
