import fetch from "node-fetch";
import stackStepPrompt from "../service/prompt.service.js";

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const generateProjectPlan = async (techStack, experienceLevel) => {
  try {
    // 1️⃣ Build user prompt (input only, no rules)
    const userPrompt = `
Tech stack: ${techStack}
Experience level: ${experienceLevel}

Generate a complete project plan.
    `.trim();

    // 2️⃣ Call GROQ API
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

    // 3️⃣ Convert response to JSON
    const data = await response.json();
    console.log("GROQ KEY LOADED:", !!process.env.GROQ_API_KEY);
    console.log("FULL GROQ RESPONSE:", JSON.stringify(data, null, 2));

    // 4️⃣ Extract model output (plain text)
    const rawContent = data?.choices?.[0]?.message?.content;

    if (!rawContent) {
      throw new Error("Empty LLM response");
    }

    // ✅ Return plain text directly (no JSON.parse)
    return rawContent.trim();
  } catch (error) {
    console.error("LLM generation failed:", error.message);

    return "LLM_GENERATION_FAILED";
  }
};

export default generateProjectPlan;
