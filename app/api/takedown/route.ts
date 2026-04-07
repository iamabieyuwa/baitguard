import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const SYSTEM_PROMPT = `You are a Legal & Cybersecurity Compliance AI. Generate a formal, professional 'Abuse Report' (takedown notice) to be sent to a hosting provider or registrar.
The draft should firmly request the suspension or takedown of the provided malicious URL based on the described threat findings.
It should be formatted as a ready-to-send email template.

CRITICAL: Return ONLY a valid JSON object matching this exact structure:
{
  "subject": "The email subject line",
  "body": "The full multi-line email template body, clearly stating the URL, the threat, and requesting immediate takedown. Use placeholders like [Your Name] for the sender."
}`;

let _client: Groq | null = null;
function getClient(): Groq {
  if (!_client) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("GROQ_API_KEY is not set.");
    _client = new Groq({ apiKey });
  }
  return _client;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body?.url;
    const threatDetails = body?.threatDetails;

    if (!url || !threatDetails) {
      return NextResponse.json(
        { error: "Missing 'url' or 'threatDetails' in request body." },
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const groq = getClient();
    const chatCompletion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Malicious URL: ${url}\nThreat Details: ${threatDetails}\nGenerate the abuse report.` },
      ],
      temperature: 0.1,
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const raw = chatCompletion.choices?.[0]?.message?.content;
    if (!raw) {
      return NextResponse.json({ error: "Empty response." }, { status: 502, headers: { "Content-Type": "application/json" } });
    }

    const result = JSON.parse(raw);
    return NextResponse.json(result, { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (error: unknown) {
    console.error("[/api/takedown] Error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected error" },
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
