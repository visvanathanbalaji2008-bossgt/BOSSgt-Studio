import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BOSSgt Studio",
  description: "Professional browser-based development environment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className="h-full antialiased font-sans"
    >
      <body className="h-screen w-screen flex flex-col overflow-hidden text-sm">
        {children}
      </body>
    </html>
  );
}

