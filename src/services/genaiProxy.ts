export async function generateReflectionProxy(
  prompt: string,
  model = "gemini-1.5-flash",
) {
  const proxyUrl =
    import.meta.env.VITE_GENAI_PROXY_URL || "/api/generateReflection";
  const res = await fetch(proxyUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, model }),
  });

  const responseBody = await res.text();

  if (!res.ok) {
    throw new Error(
      `Network response was not ok: ${res.status} ${res.statusText}. Body: ${responseBody}`,
    );
  }

  try {
    return JSON.parse(responseBody);
  } catch (e) {
    return { text: responseBody };
  }
}
