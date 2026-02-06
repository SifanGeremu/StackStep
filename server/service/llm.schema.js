const Joi = require("joi");

const taskSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  expectedOutcome: Joi.string().required(),
  order: Joi.number().required(),
});

const phaseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().optional(),
  order: Joi.number().required(),
  tasks: Joi.array().items(taskSchema).required(),
});

const projectPlanSchema = Joi.object({
  projectTitle: Joi.string().required(),
  projectDescription: Joi.string().required(),
  phases: Joi.array().items(phaseSchema).required(),
});
