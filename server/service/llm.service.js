import fetch from "node-fetch";
import stackStepPrompt from "../service/prompt.service.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

//Validate project plan structure
function validateProjectPlan(plan) {
  if (!plan.projectTitle || typeof plan.projectTitle !== "string") {
    throw new Error("Missing or invalid projectTitle");
  }
  if (!plan.projectDescription || typeof plan.projectDescription !== "string") {
    throw new Error("Missing or invalid projectDescription");
  }
  if (!Array.isArray(plan.phases) || plan.phases.length === 0) {
    throw new Error("Missing or invalid phases array");
  }

  plan.phases.forEach((phase, i) => {
    if (!phase.title || !phase.purpose) {
      throw new Error(`Phase ${i} missing title or purpose`);
    }
    phase.order = i; // normalize phase order

    if (!Array.isArray(phase.tasks)) {
      throw new Error(`Phase ${i} tasks must be an array`);
    }
    phase.tasks.forEach((task, j) => {
      if (!task.description) {
        throw new Error(`Phase ${i} task ${j} missing description`);
      }
      task.order = j; // normalize task order
    });

    if (!Array.isArray(phase.definitionOfDone)) {
      phase.definitionOfDone = [];
    }
  });

  return true;
}

//Fetch & parse LLM response with retries and metrics
async function fetchAndParseLLM(userPrompt, maxRetries = 2) {
  let attempt = 0;
  const startTime = Date.now();

  while (attempt <= maxRetries) {
    attempt++;
    try {
      console.log(`LLM request attempt ${attempt}...`);

      const response = await fetch(GROQ_API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: stackStepPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.3,
        }),
      });

      const data = await response.json();
      const rawContent = data?.choices?.[0]?.message?.content;
      if (!rawContent) throw new Error("Empty LLM response");

      // Clean code fences
      const cleaned = rawContent.replace(/```json|```/g, "").trim();

      // Parse JSON
      const parsed = JSON.parse(cleaned);

      // Validate structure
      validateProjectPlan(parsed);

      const endTime = Date.now();

      //Pretty print the full plan in console
      console.log("📝 Full project plan:\n", JSON.stringify(parsed, null, 2));

      console.log(
        `LLM success on attempt ${attempt} (took ${(
          (endTime - startTime) /
          1000
        ).toFixed(2)}s)`,
      );

      return {
        success: true,
        retries: attempt - 1,
        timeTakenMs: endTime - startTime,
        plan: parsed,
      };
    } catch (err) {
      console.warn(`Attempt ${attempt} failed: ${err.message}`);
      if (attempt > maxRetries) {
        console.error("LLM generation failed after retries");
        return {
          success: false,
          error: "LLM_GENERATION_FAILED",
          retries: attempt - 1,
        };
      }
      // wait 500ms before retry
      await new Promise((res) => setTimeout(res, 500));
    }
  }
}

// Main function called by routes/controllers
export const generateProjectPlan = async (techStack, experienceLevel) => {
  const userPrompt = `
Tech stack: ${techStack}
Experience level: ${experienceLevel}

Generate a complete project plan.
  `.trim();

  return await fetchAndParseLLM(userPrompt);
};

export default generateProjectPlan;
