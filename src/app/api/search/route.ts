import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";
import fs from "fs";
import path from "path";
import { syncWorkspaceToDisk } from "@/lib/workspace-sync";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, query, replaceWith, isRegex, matchCase, filePaths, projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }
    
    // Sync to disk to ensure we have the latest files to search
    const root = await syncWorkspaceToDisk(projectId);

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
        // turbopackIgnore tells Next.js not to bundle the dynamic path
        const fullPath = path.join(/*turbopackIgnore: true*/ root, file);
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

      // Sync changes back to Supabase!
      // In a real app we might only sync the modified files, but this handles it simply
      const { syncDiskToWorkspace } = await import("@/lib/workspace-sync");
      await syncDiskToWorkspace(projectId);

      return NextResponse.json({ success: true, filesModified: replaceCount });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });

  } catch (error: unknown) {
    const err = error as { message?: string };
    const errMessage = error instanceof Error ? error.message : (err?.message || "Unknown error");
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
