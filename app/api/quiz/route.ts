import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/* ── System prompt ── */
const SYSTEM_PROMPT = `You are a Psychological Profiler for Cybersecurity. Based on the user's answers to the security quiz, categorize them into exactly ONE of the following personas:
1. 'The Vigilant Guardian' - Highly alert and proactive.
2. 'The Trusted Ally' - Good intentions but might be too trusting.
3. 'The Busy Professional' - Overloaded, takes shortcuts, prone to urgency-based attacks.
4. 'The High-Risk Target' - Unaware of basic security hygiene.

CRITICAL: You MUST return ONLY a valid JSON object with this exact structure:
{
  "personaTitle": "'The Vigilant Guardian' | 'The Trusted Ally' | 'The Busy Professional' | 'The High-Risk Target'",
  "personaDescription": "A 2-sentence description of their strengths or typical behavior.",
  "safetyTip": "One actionable safety tip tailored to their vulnerability."
}`;

/* ── Lazy-initialised Groq client ── */
let _client: Groq | null = null;

function getClient(): Groq {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new Error(
        "GROQ_API_KEY is not set. Add it to your .env.local file."
      );
    }
    _client = new Groq({ apiKey });
  }
  return _client;
}

/* ── POST /api/quiz ── */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const answers = body?.answers;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Missing or invalid 'answers' array in request body." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const groq = getClient();
    const formattedAnswers = answers.map((a, i) => `Q${i + 1}: ${a}`).join("\n");

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Here are the user's answers:\n\n${formattedAnswers}\n\nCategorize this user.` },
      ],
      temperature: 0.2,
      max_tokens: 300,
      response_format: { type: "json_object" },
    });

    const raw = chatCompletion.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "The AI returned an empty response." },
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    const result = JSON.parse(raw);

    return NextResponse.json(result, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("[/api/quiz] Error:", error);
    const message =
      error instanceof SyntaxError
        ? "Failed to parse the AI response as valid JSON."
        : error instanceof Error
          ? error.message
          : "An unexpected error occurred.";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
