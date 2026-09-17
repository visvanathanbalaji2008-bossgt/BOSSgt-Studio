import { NextResponse } from "next/server";
import { exec } from "child_process";
import { promisify } from "util";
import { syncWorkspaceToDisk, syncDiskToWorkspace } from "@/lib/workspace-sync";
import fs from "fs";
import path from "path";

const execPromise = promisify(exec);

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, payload, projectId } = body;

    if (!projectId) {
      return NextResponse.json({ error: "projectId is required" }, { status: 400 });
    }

    // Always sync Supabase state to disk before running git commands
    const cwd = await syncWorkspaceToDisk(projectId);

    // Helper to run git
    const runGit = async (cmd: string) => {
      try {
        const { stdout } = await execPromise(`git ${cmd}`, { cwd });
        return stdout.trim();
      } catch (err: any) {
        throw new Error(err.message || err.stderr || "Git command failed");
      }
    };

    if (action === "init") {
      await runGit("init");
      await syncDiskToWorkspace(projectId);
      return NextResponse.json({ success: true });
    }

    if (action === "status") {
      const isRepo = fs.existsSync(path.join(cwd, ".git"));
      if (!isRepo) return NextResponse.json({ isRepo: false });

      const branch = await runGit("branch --show-current").catch(() => "");
      const statusOut = await runGit("status --porcelain").catch(() => "");
      
      const changes = statusOut.split("\n").filter(Boolean).map(line => {
        const status = line.substring(0, 2);
        const file = line.substring(3);
        return { file, status };
      });

      return NextResponse.json({ isRepo: true, branch, changes });
    }

    if (action === "remotes") {
      const remote = await runGit("remote get-url origin").catch(() => null);
      return NextResponse.json({ remote });
    }

    if (action === "aheadBehind") {
      const ab = await runGit("rev-list --left-right --count HEAD...origin/$(git branch --show-current)").catch(() => "0\t0");
      const [ahead, behind] = ab.split("\t");
      return NextResponse.json({ ahead: parseInt(ahead || "0"), behind: parseInt(behind || "0") });
    }

    if (action === "log") {
      const logOut = await runGit('log -n 50 --pretty=format:"%H|%s|%an|%ar"').catch(() => "");
      const logs = logOut.split("\n").filter(Boolean).map(line => {
        const [hash, message, author, date] = line.split("|");
        return { hash, message, author, date };
      });
      return NextResponse.json({ logs });
    }

    if (["add", "commit", "push", "pull", "checkout"].includes(action)) {
      if (action === "add") await runGit(`add "${payload.file || '.'}"`);
      if (action === "commit") await runGit(`commit -m "${payload.message}"`);
      if (action === "push") await runGit(`push ${payload.remote || 'origin'} ${payload.branch || 'main'}`);
      if (action === "pull") await runGit(`pull ${payload.remote || 'origin'} ${payload.branch || 'main'}`);
      
      if (["checkout", "pull"].includes(action)) {
         await syncDiskToWorkspace(projectId);
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
