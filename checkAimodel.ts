import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

// ✅ This will now look for ".env" by default
dotenv.config(); 

async function listModels() {
  const apiKey = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  if (!apiKey) {
    console.error("❌ Error: GOOGLE_GENERATIVE_AI_API_KEY is not defined in your .env file");
    console.log("Current ENV keys found:", Object.keys(process.env).filter(k => k.includes('GOOGLE')));
    return;
  }

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1/models?key=${apiKey}`
    );
    const data: any = await response.json();

    if (data.error) {
      console.error("❌ API Error:", data.error.message);
      return;
    }

    console.log("\n--- Available Models for your API Key ---");
    data.models.forEach((model: any) => {
      if (model.supportedGenerationMethods.includes("generateContent")) {
        console.log(`✅ Model Name: ${model.name.replace("models/", "")}`);
      }
    });
  } catch (error) {
    console.error("❌ Request Failed:", error);
  }
}

listModels();