export const config = {
  runtime: "edge", // แนะนำให้ใช้ Edge Runtime สำหรับ AI responses เพราะทำงานได้เร็ว
};

export default async function handler(req: Request) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
    });
  }

  try {
    const { prompt } = await req.json();
    const apiKey = process.env.GEMINI_API_KEY; // ดึงจาก Environment Variables ของ Vercel

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
      return new Response(JSON.stringify({ error: data }), {
        status: response.status,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
    });
  }
}
