const axios = require("axios");

module.exports = async (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const apiKey = process.env.GENAI_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server missing Gemini API key" });
    }

    const { prompt, model = "gemini-1.5-flash" } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Missing prompt" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const resp = await axios.post(
      `${url}?key=${encodeURIComponent(apiKey)}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { temperature: 0.2 },
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 15000,
      }
    );

    // Proxy the response body
    return res.status(resp.status).json(resp.data);
  } catch (err) {
    console.error(
      "generateReflection error",
      err.response ? err.response.data || err.message : err.message || err
    );
    const status = err.response ? err.response.status : 500;
    const data = err.response
      ? err.response.data
      : { error: String(err.message || err) };
    return res.status(status).json(data);
  }
};
