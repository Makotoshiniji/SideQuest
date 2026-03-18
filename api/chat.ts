export const config = {
  runtime: "edge", // แนะนำให้ใช้ Edge Runtime สำหรับ AI responses เพราะทำงานได้เร็ว
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
    const apiKey = process.env.GEMINI_API_KEY; // ดึงจาก Environment Variables ของ Vercel

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.2 },
        }),
      },
    );

    const data = await response.json();

    // ถ้า Gemini ตอบกลับมาเป็น Error (เช่น API Key ผิด) ให้ส่ง Status Code เดิมกลับไป
    if (!response.ok) {
      console.error("Gemini API error in /api/chat:", data);
      return new Response(
        JSON.stringify({ error: data.error?.message || "Gemini API error" }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      console.error(
        "Invalid response structure from Gemini in /api/chat:",
        data,
      );
      return new Response(
        JSON.stringify({ error: "Invalid response structure from AI" }),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
    }

    // Return a cleaner object to the frontend, not the whole Gemini response.
    return new Response(JSON.stringify({ text }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Internal Server Error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
