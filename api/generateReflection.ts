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

    // Use fetch directly as the SDK can have issues in Edge runtime.
    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.2,
            response_mime_type: "application/json", // Crucial for the reflection prompt
          },
        }),
      },
    );

    const data = await geminiResponse.json();

    if (!geminiResponse.ok) {
      console.error("Gemini API error:", data);
      return new Response(
        JSON.stringify({ error: data.error?.message || "Gemini API error" }),
        {
          status: geminiResponse.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const reflectionJsonString =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reflectionJsonString) {
      console.error("Invalid response structure from Gemini:", data);
      return new Response(
        JSON.stringify({ error: "Invalid response structure from AI" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // The 'text' from a JSON response is a stringified JSON.
    // We return it directly, and the client will parse it.
    return new Response(reflectionJsonString, {
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
