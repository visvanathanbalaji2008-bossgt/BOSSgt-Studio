import { NextRequest, NextResponse } from "next/server";
import { executeCode } from "@/lib/execution-engine";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { code, sourceCode, language, stdin, files } = body;
    const codeToRun = code || sourceCode;

    if (!codeToRun || typeof codeToRun !== "string") {
      return NextResponse.json({ error: "No code or sourceCode provided" }, { status: 400 });
    }

    if (!language || typeof language !== "string") {
      return NextResponse.json({ error: "No language specified" }, { status: 400 });
    }

    const result = await executeCode({
      code: codeToRun,
      language,
      stdin: typeof stdin === "string" ? stdin : "",
      files: Array.isArray(files) ? files : []
    });

    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Execution failed" }, { status: 500 });
  }
}
