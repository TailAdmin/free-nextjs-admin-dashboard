import { NextResponse } from "next/server";
import { User } from "@/types/User";
import GetUsers from "lib/GetUsers";

export async function GET(request: Request) {
  const users: User[] = GetUsers();
  return NextResponse.json(users);
}
