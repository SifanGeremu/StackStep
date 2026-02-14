import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
  order: { type: Number, required: true },
  title: { type: String },
  description: { type: String, required: true },
  // tracking fields
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  startedAt: { type: Date },
  completedAt: { type: Date },
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
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
