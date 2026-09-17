import { NextResponse } from 'next/server';
import { syncWorkspaceToDisk } from '@/lib/workspace-sync';

export const runtime = "nodejs";

// Next.js fast refresh clears global variables sometimes, but we use this for the singleton
if (!(global as any).ptys) {
  (global as any).ptys = {};
  (global as any).ptyOutputs = {};
}

const ptys: Record<string, any> = (global as any).ptys;
const ptyOutputs: Record<string, string> = (global as any).ptyOutputs;

// Dynamic import for node-pty to avoid Next.js build issues with native modules
let pty: any;
try {
  pty = require('node-pty');
} catch (e) {
  console.warn("node-pty not available. Local terminal execution will be disabled.");
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, terminalId, projectId, cols, rows, data } = body;

    // Security constraints
    const terminalServiceUrl = process.env.TERMINAL_SERVICE_URL;
    const allowLocalTerminal = process.env.ALLOW_LOCAL_TERMINAL === "true" || process.env.NODE_ENV === "development";

    if (terminalServiceUrl) {
      // Abstract terminal proxy logic goes here in the future
      return NextResponse.json({ 
        error: "External Terminal Service routing not yet implemented in this prototype."
      }, { status: 501 });
    }

    if (!allowLocalTerminal) {
      if (action === 'start') {
        ptyOutputs[terminalId] = "\x1b[1;31mError: Raw terminal access is disabled for security reasons in this environment.\x1b[0m\r\n\x1b[1;33mPlease set up an isolated WebContainer or configure TERMINAL_SERVICE_URL.\x1b[0m\r\n";
        return NextResponse.json({ success: true });
      }
      if (action === 'poll') {
        const output = ptyOutputs[terminalId] || "";
        ptyOutputs[terminalId] = "";
        return NextResponse.json({ output });
      }
      return NextResponse.json({ success: false });
    }

    if (!pty) {
       return NextResponse.json({ error: 'node-pty not available' }, { status: 500 });
    }

    if (action === 'start') {
      const cwd = projectId ? await syncWorkspaceToDisk(projectId) : process.cwd();
      
      if (ptys[terminalId]) {
         ptys[terminalId].kill();
      }

      const ptyProcess = pty.spawn('bash', [], {
        name: 'xterm-color',
        cols: cols || 80,
        rows: rows || 30,
        cwd: cwd,
        env: process.env
      });

      ptys[terminalId] = ptyProcess;
      ptyOutputs[terminalId] = '';

      ptyProcess.onData((output: string) => {
        ptyOutputs[terminalId] += output;
      });

      return NextResponse.json({ success: true });
    }

    if (action === 'input') {
      if (ptys[terminalId]) {
        ptys[terminalId].write(data);
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'poll') {
      const output = ptyOutputs[terminalId] || '';
      ptyOutputs[terminalId] = '';
      return NextResponse.json({ output });
    }
    
    if (action === 'resize') {
       if (ptys[terminalId]) {
         try { ptys[terminalId].resize(cols, rows); } catch (e) {}
       }
       return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Unknown error' }, { status: 500 });
  }
}
