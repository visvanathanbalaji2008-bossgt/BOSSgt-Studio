import { NextResponse } from "next/server";

export const runtime = "edge";

const JUDGE0_API_URL = process.env.JUDGE0_API_URL || "https://ce.judge0.com";

export async function GET() {
  try {
    const response = await fetch(`${JUDGE0_API_URL}/languages`);
    if (!response.ok) {
      throw new Error("Failed to fetch languages");
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch languages from Judge0", error);
    return NextResponse.json(
      { error: "Failed to fetch languages" },
      { status: 500 }
    );
  }
}
