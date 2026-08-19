import { NextRequest, NextResponse } from "next/server";
import { getLanguageById } from "@/components/editor/editor-config";
import { rateLimit } from "@/lib/rate-limit";

// Force Node.js runtime for this route
export const runtime = "nodejs";

const MAX_CODE_LENGTH = 65536; // 64KB max source size
const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";
const RATE_LIMIT_MAX = parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || "100", 10);
const RATE_LIMIT_WINDOW = parseInt(process.env.RATE_LIMIT_WINDOW_MS || "60000", 10);

export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting (Abuse Protection)
    const ip = req.headers.get("x-forwarded-for") || req.ip || "127.0.0.1";
    const rateLimitResult = rateLimit(ip, RATE_LIMIT_MAX, RATE_LIMIT_WINDOW);
    
    if (!rateLimitResult.success) {
      return NextResponse.json({ 
        error: "Rate Limit Exceeded",
        details: "You are making too many execution requests. Please wait a moment."
      }, { 
        status: 429,
        headers: {
          "X-RateLimit-Limit": RATE_LIMIT_MAX.toString(),
          "X-RateLimit-Remaining": rateLimitResult.remaining.toString(),
          "X-RateLimit-Reset": rateLimitResult.reset.toString()
        }
      });
    }

    // 2. Body parsing and validation
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON payload" }, { status: 400 });
    }

    const { code, language } = body;

    if (!code || typeof code !== "string") {
      return NextResponse.json({ error: "No code provided or invalid format" }, { status: 400 });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return NextResponse.json({ error: "Source code exceeds maximum allowed size (64KB)" }, { status: 400 });
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json({ error: "No language provided or invalid format" }, { status: 400 });
    }

    const langConfig = getLanguageById(language);
    
    // Validate language via allowlist (config)
    if (!langConfig || langConfig.executionStatus !== "READY") {
      return NextResponse.json({ 
        error: "Execution Request Failed",
        details: `Language '${language}' is unsupported or missing configuration.`
      }, { status: 500 });
    }

    // Convert string ID back to number for Judge0
    const languageId = parseInt(langConfig.executor || "", 10);
    
    if (isNaN(languageId)) {
      return NextResponse.json({ 
        error: "Execution Request Failed",
        details: `Language '${language}' has an invalid executor ID mapping.`
      }, { status: 500 });
    }

    const payload = {
      source_code: code,
      language_id: languageId,
      wall_time_limit: 10,
      cpu_time_limit: 5,
      memory_limit: 128000,
      max_file_size: 1024,
      enable_network: false,
    };

    const abortController = new AbortController();
    const timeout = setTimeout(() => abortController.abort(), 15000); // 15s wait for API

    try {
      // Base64 false, wait true (blocks until execution finishes for max 10-15s)
      const response = await fetch(`${JUDGE0_API_URL}/submissions?base64_encoded=false&wait=true`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
        signal: abortController.signal
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        return NextResponse.json({ 
          error: "Rate Limit Exceeded",
          details: "Too many execution requests to the public sandbox. Please wait a moment and try again."
        }, { status: 429 });
      }

      if (!response.ok) {
        const errorText = await response.text();
        return NextResponse.json({ 
          error: "Execution Provider Error",
          details: `The execution service returned an error (${response.status}): ${errorText.substring(0, 500)}`
        }, { status: 503 });
      }

      const data = await response.json();
      
      // Judge0 returns status inside data.status
      const stdout = data.stdout || "";
      let stderr = data.stderr || "";
      const compileOutput = data.compile_output || "";
      
      // Merge compile output if there is any
      if (compileOutput) {
        stderr = compileOutput + "\n" + stderr;
      }

      // Status mapping
      // 3 = Accepted (Finished)
      // 4 = Wrong Answer
      // 5 = Time Limit Exceeded
      // 6 = Compilation Error
      // 7 = Runtime Error (SIGSEGV)
      // 8 = Runtime Error (SIGXFSZ)
      // 9 = Runtime Error (SIGFPE)
      // 10 = Runtime Error (SIGABRT)
      // 11 = Runtime Error (NZEC)
      // 12 = Runtime Error (Other)
      // 13 = Internal Error
      // 14 = Exec Format Error
      
      let exitCode = 0;
      if (data.status && data.status.id !== 3) {
        exitCode = data.status.id;
        stderr += `\n[Execution Status]: ${data.status.description || "Error"}`;
      }

      return NextResponse.json({
        stdout: stdout.trim(),
        stderr: stderr.trim(),
        exitCode,
        timeMs: parseFloat(data.time || "0") * 1000 
      });

    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") {
        return NextResponse.json({
          stdout: "",
          stderr: "[Execution Error]: Request to the execution service timed out.",
          exitCode: 124,
          timeMs: 15000
        });
      }
      throw err;
    }

  } catch (error: unknown) {
    console.error("Execution error:", error);
    return NextResponse.json({ 
      error: "Execution Request Failed",
      details: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}
