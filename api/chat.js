// api/chat.js
//
// Serverless endpoint (Vercel Node.js Function) that powers the Babita
// Classes AI assistant. The frontend (script.js -> sendAssistantMessage)
// POSTs { message, context } here; this file adds a system prompt,
// calls Gemini, and returns { reply }.
//
// SECURITY NOTE: GEMINI_API_KEY is read from an environment variable so
// the real key never sits in a file committed to the repo. Set it in the
// Vercel dashboard: Project -> Settings -> Environment Variables ->
// GEMINI_API_KEY. GEMINI_API_KEY_FALLBACK below is only a safety net so
// the assistant still works on first deploy before that env var is set —
// replace/remove it once GEMINI_API_KEY is configured on Vercel.
const GEMINI_API_KEY_FALLBACK = "AQ.Ab8RN6KIOzhLgyPM63kmBrIaGBkIuHxlw5eE_JtwiYxYQPyqiw";
const GEMINI_MODEL = "gemini-3.5-flash-lite";

const SYSTEM_PROMPT = `You are the AI assistant embedded on the Babita Classes website (babitaclasses.vercel.app).

About Babita Classes:
- A free, non-profit educational institute in Kanpur, Uttar Pradesh, India, founded by Babita Soni in 2020.
- Provides free coaching (NCERT English & Hindi medium, kindergarten to 10th grade), free stationery, and cultural/physical activities to underprivileged children, entirely free of cost — no admission fees of any kind.
- Minimum admission age is 5 years. Admission is via the Admission Form (linked in the "All URLs" section of the site).
- Founder & Director: Babita Soni (M.A. Literature, CSJMU). Co-Founder & Online Editor: Shivam Soni (CA Finalist, B.Com), who also built and maintains this website.
- Address: 1/2, Juhi Bamburahiya Colony, Kanpur, Uttar Pradesh - 208014, India.
- Contact: phone/WhatsApp +91 73883 11148, email babitaclasses7@gmail.com.
- Open hours: Monday-Friday 9 AM-6 PM, Saturday 9 AM-5 PM, Sunday closed (may vary on public holidays).
- Site sections: Home, Blog, Results (roll number + name checker with downloadable marksheets, plus a Result ID verification tool), Syllabus/Datesheet/Results archive, Notice Board, What's New, Gallery, FAQs, Our Mission, From Director's Desk, Function Videos, Our Faculty, All URLs.

How to answer:
- Answer naturally and conversationally, like a helpful front-desk assistant for the institute. Keep replies concise (a few sentences) unless the question needs more detail.
- Prioritize the "Live page content" block below — it is scraped fresh from the exact page the visitor is on and is more current than anything above.
- If asked about a specific student's result/marks, do NOT guess or invent any numbers. Direct them to the Results page to check with their own roll number and full name, since that data isn't something you have access to here.
- For anything not covered by Babita Classes info (general knowledge, homework help, exam-prep questions, etc.), answer helpfully from your own general knowledge — this assistant is also meant to help students with their studies, not just site questions.
- If you're genuinely unsure about a Babita-Classes-specific fact (e.g. an exact date or fee that isn't in your context), say so plainly and point them to call/WhatsApp +91 73883 11148 rather than guessing.
- Do not use markdown headers or bullet-heavy formatting; plain sentences work best in this chat widget. You may use **bold** sparingly for key facts.`;

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      res.status(400).json({ error: "Invalid JSON body" });
      return;
    }
  }

  const message = (body && body.message ? String(body.message) : "").trim().slice(0, 2000);
  const context = (body && body.context ? String(body.context) : "").slice(0, 8000);

  if (!message) {
    res.status(400).json({ error: "Missing message" });
    return;
  }

  const apiKey = process.env.GEMINI_API_KEY || GEMINI_API_KEY_FALLBACK;
  if (!apiKey) {
    res.status(500).json({ error: "Assistant is not configured (missing API key)" });
    return;
  }

  const fullSystemPrompt = context
    ? `${SYSTEM_PROMPT}\n\nLive page content (from the page the visitor is currently on):\n${context}`
    : SYSTEM_PROMPT;

  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

  try {
    const geminiRes = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: {
          parts: [{ text: fullSystemPrompt }]
        },
        contents: [
          {
            role: "user",
            parts: [{ text: message }]
          }
        ],
        generationConfig: {
          temperature: 0.6,
          maxOutputTokens: 600
        }
      })
    });

    const data = await geminiRes.json();

    if (!geminiRes.ok) {
      const errMsg = (data && data.error && data.error.message) || "Gemini request failed";
      console.error("Gemini API error:", errMsg);
      res.status(502).json({ error: errMsg });
      return;
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("").trim() || "";

    if (!reply) {
      const finishReason = data?.candidates?.[0]?.finishReason;
      res.status(502).json({ error: `Empty response from Gemini${finishReason ? ` (${finishReason})` : ""}` });
      return;
    }

    res.status(200).json({ reply });
  } catch (err) {
    console.error("Assistant handler error:", err);
    res.status(500).json({ error: "Internal error contacting the assistant" });
  }
};
