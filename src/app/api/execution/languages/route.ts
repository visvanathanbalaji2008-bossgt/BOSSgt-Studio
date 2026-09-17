import { NextResponse } from "next/server";
import { LANGUAGE_REGISTRY } from "@/lib/language-registry";
import { execFile } from "child_process";

export const runtime = "nodejs";

function checkBinary(binary: string): Promise<boolean> {
  return new Promise((resolve) => {
    execFile("which", [binary], (err, stdout) => {
      resolve(!err && stdout.trim().length > 0);
    });
  });
}

export async function GET() {
  const languagesList = [];

  for (const [key, lang] of Object.entries(LANGUAGE_REGISTRY)) {
    let status = "ready";
    
    if (key === "ncl") {
      status = "ready"; // Special embedded NCL plot engine
    } else if (lang.localCmd || lang.compileCmd) {
      const targetBin = lang.compileCmd || lang.localCmd!;
      const available = await checkBinary(targetBin);
      status = available || Boolean(lang.judge0Id || lang.pistonLang) ? "ready" : "unavailable";
    } else if (lang.judge0Id || lang.pistonLang) {
      status = "ready";
    } else {
      status = "unavailable";
    }

    languagesList.push({
      id: lang.id,
      name: lang.name,
      extension: lang.extension,
      category: lang.category,
      status,
      executable: status === "ready"
    });
  }

  return NextResponse.json(languagesList);
}
