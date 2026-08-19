import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const root = process.cwd();
    const body = await req.json();
    const { action, query, replaceWith, isRegex, matchCase, filePaths } = body;

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    if (action === "search") {
      const caseFlag = matchCase ? "" : "-i";
      const regexFlag = isRegex ? "-E" : "-F";
      const excludes = `--exclude-dir=node_modules --exclude-dir=.git --exclude-dir=.next`;
      
      const safeQuery = query.replace(/"/g, '\\"');
      const command = `grep -rnH ${caseFlag} ${regexFlag} ${excludes} "${safeQuery}" . || true`;

      const { stdout } = await execPromise(command, { cwd: root });
      
      const lines = stdout.split("\n").filter(Boolean);
      const results: { file: string, line: number, text: string }[] = [];

      lines.forEach(line => {
        const match = line.match(/^\.\/(.*?):(\d+):(.*)$/);
        if (match) {
          results.push({
            file: match[1],
            line: parseInt(match[2], 10),
            text: match[3]
          });
        }
      });

      return NextResponse.json({ results });
    }

    if (action === "replace") {
      if (!filePaths || !Array.isArray(filePaths)) {
        return NextResponse.json({ error: "filePaths array is required for replace" }, { status: 400 });
      }

      let replaceCount = 0;

      for (const file of filePaths) {
        const fullPath = path.join(root, file);
        if (fs.existsSync(fullPath)) {
          const content = fs.readFileSync(fullPath, "utf-8");
          
          let regex;
          if (isRegex) {
            regex = new RegExp(query, matchCase ? "g" : "gi");
          } else {
            const escapedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            regex = new RegExp(escapedQuery, matchCase ? "g" : "gi");
          }

          const newContent = content.replace(regex, replaceWith);
          
          if (content !== newContent) {
            fs.writeFileSync(fullPath, newContent, "utf-8");
            replaceCount++;
          }
        }
      }

      return NextResponse.json({ success: true, filesModified: replaceCount });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error: unknown) {
    const err = error as { message?: string };
    const errMessage = error instanceof Error ? error.message : (err?.message || "Unknown error");
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
