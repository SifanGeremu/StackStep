import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  description: { type: String, required: true },
});

const PhaseSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String, required: true },
  purpose: { type: String, required: true },
  tasks: [TaskSchema],
  definitionOfDone: {
    type: [String],
    default: [],
  },
});

const ProjectSchema = new mongoose.Schema({
  techStack: { type: String, required: true },
  projectTitle: { type: String, required: true },
  projectDescription: { type: String },
  phases: [PhaseSchema],
  createdAt: { type: Date, default: Date.now },
});

// index for fast retrieval
ProjectSchema.index({ createdAt: -1 });

const Project = mongoose.model("Project", ProjectSchema);

export default Project;
