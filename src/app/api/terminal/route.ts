import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";
import path from "path";
import fs from "fs";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const { command, cwd } = await req.json();
    
    // Fallback to project root if no cwd is provided
    const currentCwd = cwd || process.cwd();
    
    if (!command || typeof command !== "string") {
      return NextResponse.json({ error: "Invalid command" }, { status: 400 });
    }

    const trimmedCommand = command.trim();

    // Custom handling for 'cd' to track cwd changes on the backend
    if (trimmedCommand.startsWith("cd ")) {
      const targetDir = trimmedCommand.slice(3).trim();
      
      try {
        const newCwd = path.resolve(currentCwd, targetDir);
        // Verify directory exists
        const stat = fs.statSync(/*turbopackIgnore: true*/ newCwd);
        if (!stat.isDirectory()) {
          throw new Error(`cd: ${targetDir}: Not a directory`);
        }
        return NextResponse.json({ stdout: "", stderr: "", exitCode: 0, newCwd });
      } catch (err: unknown) {
        const errMessage = err instanceof Error ? err.message : "Unknown error";
        return NextResponse.json({ 
          stdout: "", 
          stderr: errMessage.includes("ENOENT") ? `cd: ${targetDir}: No such file or directory` : errMessage, 
          exitCode: 1, 
          newCwd: currentCwd 
        });
      }
    }

    // Execute standard shell commands
    try {
      // 10 second timeout for terminal commands
      const { stdout, stderr } = await execPromise(command, { cwd: currentCwd, timeout: 10000 });
      return NextResponse.json({ stdout, stderr, exitCode: 0, newCwd: currentCwd });
    } catch (error: unknown) {
      const execError = error as { stdout?: string, stderr?: string, code?: number, message?: string };
      return NextResponse.json({ 
        stdout: execError.stdout || "", 
        stderr: execError.stderr || execError.message || "Unknown execution error", 
        exitCode: execError.code || 1, 
        newCwd: currentCwd 
      });
    }

  } catch (error: unknown) {
    const errMessage = error instanceof Error ? error.message : "Unknown server error";
    return NextResponse.json(
      { error: "Terminal API Error", details: errMessage },
      { status: 500 }
    );
  }
}
