export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const apiKey = process.env.GEMINI_KEY;
  if (!apiKey) return res.status(500).json({ error: "Gemini API key not configured" });

  try {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== "string") return res.status(400).json({ error: "Missing or invalid prompt" });
    if (prompt.length > 4000) return res.status(400).json({ error: "Prompt too long" });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-image-preview:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { responseModalities: ["TEXT", "IMAGE"] },
        }),
      }
    );

    const data = await response.json();

    if (data.error) {
      console.error("Gemini API error:", JSON.stringify(data.error));
      return res.status(400).json({ error: data.error.message });
    }

    // Find the image part in the response
    const parts = data.candidates?.[0]?.content?.parts || [];
    const imagePart = parts.find((p) => p.inlineData?.mimeType?.startsWith("image/"));

    if (!imagePart) {
      return res.status(500).json({ error: "No image returned from Nano Banana 2" });
    }

    const { mimeType, data: b64 } = imagePart.inlineData;
    const dataUrl = `data:${mimeType};base64,${b64}`;

    return res.status(200).json({ url: dataUrl });
  } catch (err) {
    console.error("Image generation error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
