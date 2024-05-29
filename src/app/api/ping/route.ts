// example next js api route
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  return NextResponse.json({ message: "pong" });
}
