import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/execution-engine";
import { rateLimit } from "@/lib/rate-limit";

export const runtime = "nodejs";

const MAX_CODE_LENGTH = 128 * 1024; // 128KB max source
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateLimitResult = rateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    
    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        error: "Rate Limit Exceeded",
        details: "You are making too many execution requests. Please wait a moment."
      }, { status: 429 });
    }

    // 2. Request Payload Parsing
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { code, language, stdin, files } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "No code provided or invalid format" }, { status: 400 });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: "Source code exceeds maximum allowed size (128KB)" }, { status: 400 });
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json({ error: "No language provided or invalid format" }, { status: 400 });
    }

    // 3. Delegate to Central Execution Engine
    const result = await executeCode({
      code,
      language,
      stdin: typeof stdin === "string" ? stdin : "",
      files: Array.isArray(files) ? files : []
    });

    return NextResponse.json(result);

  } catch (error: unknown) {
    console.error("Execution API error:", error);
    return NextResponse.json({ 
      error: "Execution Request Failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
