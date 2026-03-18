import { GoogleGenerativeAI } from "@google/generative-ai";

export const config = {
  runtime: "edge",
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API key not configured on Vercel" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    // Using the SDK is cleaner for this task
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.2,
        responseMimeType: "application/json", // This is crucial for the reflection prompt
      },
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    // The 'text' from a JSON response is a stringified JSON.
    // We return it directly, and the client will parse it into a JavaScript object.
    return new Response(text, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in /api/generateReflection:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
