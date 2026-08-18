import { exec } from "child_process";
import { NextResponse } from "next/server";
import { promisify } from "util";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

async function runGit(command: string) {
  const root = process.cwd();
  // Using 15 second timeout for git ops
  const { stdout, stderr } = await execPromise(command, { cwd: root, timeout: 15000 });
  return { stdout: stdout.trim(), stderr: stderr.trim() };
}

export async function POST(req: Request) {
  try {
    const root = process.cwd();
    const gitDir = path.join(root, ".git");
    const isRepo = fs.existsSync(gitDir);

    const body = await req.json();
    const { action, payload } = body;

    if (!isRepo && action !== "init") {
      return NextResponse.json({ isRepo: false });
    }

    switch (action) {
      case "status": {
        let branch = "";
        try {
          const b = await runGit("git branch --show-current");
          branch = b.stdout;
        } catch { /* detached head or no commits */ }

        const { stdout: statusOut } = await runGit("git status --porcelain");
        const lines = statusOut.split("\n").filter(Boolean);

        const changes = lines.map(line => {
          const staging = line.charAt(0);
          const working = line.charAt(1);
          const file = line.substring(3).trim();
          return { staging, working, file };
        });

        return NextResponse.json({ isRepo: true, branch, changes });
      }

      case "init": {
        await runGit("git init");
        return NextResponse.json({ success: true });
      }

      case "add": {
        if (payload.file === "all") {
          await runGit("git add .");
        } else {
          await runGit(`git add "${payload.file}"`);
        }
        return NextResponse.json({ success: true });
      }

      case "unstage": {
        if (payload.file === "all") {
          await runGit("git reset");
        } else {
          await runGit(`git reset HEAD "${payload.file}"`);
        }
        return NextResponse.json({ success: true });
      }

      case "restore": {
        // Discard local changes completely
        await runGit(`git checkout -- "${payload.file}"`);
        return NextResponse.json({ success: true });
      }

      case "commit": {
        const msg = payload.message.replace(/"/g, '\\"');
        await runGit(`git commit -m "${msg}"`);
        return NextResponse.json({ success: true });
      }

      case "branch": {
        if (payload.type === "switch") {
          await runGit(`git checkout "${payload.name}"`);
        } else if (payload.type === "create") {
          await runGit(`git checkout -b "${payload.name}"`);
        }
        return NextResponse.json({ success: true });
      }

      case "branches": {
        const { stdout } = await runGit("git branch");
        const branches = stdout.split("\n")
          .filter(Boolean)
          .map(b => b.replace("*", "").trim());
        return NextResponse.json({ branches });
      }

      case "log": {
        try {
          // hash|message|author|relative_date
          const { stdout } = await runGit('git log --pretty=format:"%h|%s|%an|%ar" -n 20');
          const logs = stdout.split("\n").filter(Boolean).map(line => {
            const [hash, message, author, date] = line.split("|");
            return { hash, message, author, date };
          });
          return NextResponse.json({ logs });
        } catch {
          return NextResponse.json({ logs: [] });
        }
      }

      case "show": {
        // Get original file content from HEAD
        try {
          const { stdout } = await runGit(`git show HEAD:"${payload.file}"`);
          return NextResponse.json({ content: stdout });
        } catch {
          return NextResponse.json({ content: "" }); // New file, no head content
        }
      }

      // Remote operations
      case "remotes": {
        try {
          const { stdout } = await runGit("git remote -v");
          // Parse first remote url
          const match = stdout.match(/origin\s+(https:\/\/[^\s]+)\s+\(fetch\)/);
          return NextResponse.json({ remote: match ? match[1] : null });
        } catch {
          return NextResponse.json({ remote: null });
        }
      }

      case "addRemote": {
        try {
          await runGit(`git remote add origin "${payload.url}"`);
        } catch {
          await runGit(`git remote set-url origin "${payload.url}"`);
        }
        return NextResponse.json({ success: true });
      }

      case "aheadBehind": {
        try {
          const { stdout } = await runGit("git rev-list --left-right --count HEAD...@{u}");
          const [ahead, behind] = stdout.split(/\s+/).map(Number);
          return NextResponse.json({ ahead, behind });
        } catch {
          return NextResponse.json({ ahead: 0, behind: 0 }); // No upstream or error
        }
      }

      case "fetch": {
        const cmd = payload.token && payload.url
          ? `git fetch "${payload.url.replace(/^https:\/\//, `https://${payload.token}@`)}"`
          : "git fetch";
        await runGit(cmd);
        return NextResponse.json({ success: true });
      }

      case "pull": {
        const cmd = payload.token && payload.url && payload.branch
          ? `git pull "${payload.url.replace(/^https:\/\//, `https://${payload.token}@`)}" ${payload.branch}`
          : `git pull`;
        // We use --no-rebase or default pull strategy. If there's a conflict, git will exit with error but leave UU files.
        try {
          await runGit(cmd);
          return NextResponse.json({ success: true });
        } catch (error: unknown) {
          const err = error as { message?: string };
          // If conflict occurs, it's still technically a "success" from the workflow perspective, the user just needs to resolve.
          if (err.message?.includes("Automatic merge failed") || err.message?.includes("CONFLICT")) {
            return NextResponse.json({ success: true, conflict: true });
          }
          throw error;
        }
      }

      case "push": {
        const cmd = payload.token && payload.url && payload.branch
          ? `git push "${payload.url.replace(/^https:\/\//, `https://${payload.token}@`)}" ${payload.branch}`
          : `git push`;
        await runGit(cmd);
        return NextResponse.json({ success: true });
      }

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }
  } catch (error: unknown) {
    const err = error as { message?: string };
    const errMessage = error instanceof Error ? error.message : (err?.message || "Unknown error");
    // Ensure we don't leak token in error messages
    const safeError = errMessage.replace(/https:\/\/[^@]+@/g, "https://***@");
    return NextResponse.json({ error: safeError }, { status: 500 });
  }
}
