# BOSSgt Studio — Neural Forge Cloud IDE

[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.1-blue)](https://nextjs.org/)
[![TypeScript 5](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![200 Languages](https://img.shields.io/badge/Languages-200%20Distinct-indigo)](https://ce.judge0.com)

A powerful multi-language web coding environment with real-time editing, isolated execution, persistent cloud projects, and GitHub integration.

## 🚀 Features

- **Monaco Code Editor**: Professional-grade editing surface with syntax highlighting and tab management.
- **200 Distinct Programming Languages**: Extensive language catalog supported by an isolated sandboxed execution gateway.
- **Persistent Cloud Projects**: Database-backed project and file persistence with local fallback storage.
- **Astra Futuristic UI**: High-performance responsive workstation interface with dark mode.
- **Secure Authentication**: Built-in Supabase session control and protected route middleware.

## 🛠️ Environment Configuration

Copy `.env.example` to `.env.local` and set your credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

## 💻 Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to access BOSSgt Studio locally.

## 🧪 Automated Language Tests

```bash
npm run test:languages
```

## 📦 Production Build & Deployment

```bash
npm run build
npm run start
```

Deploy directly to **Vercel** by connecting your GitHub repository and setting environment variables in the project dashboard.
