import "dotenv/config";
import generateProjectPlan from "./service/llm.service.js";
const plan = await generateProjectPlan("Express + MongoDB Atlas", "Beginner");
console.log(plan);
