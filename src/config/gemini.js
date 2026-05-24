
import {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} from "@google/generative-ai";

  const apiKey = "AIzaSyC_4YiYZ_6FlHSW1a2VzN6q9FiyZhCANsY";
  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });
  
  const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
  };
  
  async function run(prompt) {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });
    const result = await chatSession.sendMessage(prompt);
    return extractGeminiText(result);
  }

  function extractGeminiText(result) {
    const response = result?.response;

    if (!response) {
      return "";
    }

    if (typeof response.text === "function") {
      const text = response.text();
      if (text) {
        return text;
      }
    }

    const parts = response.candidates?.[0]?.content?.parts ?? [];
    const text = parts
      .map((part) => part?.text ?? "")
      .filter(Boolean)
      .join("\n\n");

    return text || "I couldn't generate a response.";
  }
  export default run;