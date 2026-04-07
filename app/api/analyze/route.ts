import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

/* ── System prompt ── */
const SYSTEM_PROMPT = `You are an Elite Cybersecurity Analyst. Your task is to perform a deep-scan on the provided URL or text snippet for phishing, social engineering, or malware intent.

Analyze the following:
- Domain legitimacy (check for typosquatting or strange TLDs).
- Urgency or fear-based language.
- Suspicious calls to action.

CRITICAL: You MUST return ONLY a valid JSON object with this exact structure:
{
  "score": number (1-100),
  "riskLevel": "Low" | "Medium" | "High",
  "findings": string[],
  "summary": string
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

/* ── POST /api/analyze ── */
export async function POST(request: NextRequest) {
  try {
    /* 1. Parse & validate body */
    const body = await request.json();
    const content: string | undefined = body?.content;

    if (!content || typeof content !== "string" || content.trim().length === 0) {
      return NextResponse.json(
        { error: "Missing or empty 'content' field in the request body." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    /* 2. Call Groq (Llama 3.3 70B Instruct Turbo) */
    const groq = getClient();

    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Analyze this:\n\n${content}` },
      ],
      temperature: 0.3,
      max_tokens: 512,
      response_format: { type: "json_object" },
    });

    const raw = chatCompletion.choices?.[0]?.message?.content;

    if (!raw) {
      return NextResponse.json(
        { error: "The AI returned an empty response. Please try again." },
        { status: 502, headers: { "Content-Type": "application/json" } }
      );
    }

    /* 3. Parse & return */
    const analysis = JSON.parse(raw);

    return NextResponse.json(analysis, {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("[/api/analyze] Error:", error);

    const message =
      error instanceof SyntaxError
        ? "Failed to parse the AI response as valid JSON."
        : error instanceof Error
          ? error.message
          : "An unexpected error occurred while analyzing the content.";

    return NextResponse.json(
      { error: message },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
