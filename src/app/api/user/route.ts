// users data router
import type { NextRequest } from "next/server";
import { getAppServerSession } from "@/entities/session/get-app-session.server";
import { UserData } from "@/types/user";
import { userdata } from "@/app/api/user/userdata";

export async function GET(request: NextRequest) {
  const userId = request.nextUrl.searchParams.get("userId");
  if (request.method !== "GET") {
    return new Response(JSON.stringify({ message: "Unsupported method" }), {
      status: 405,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
//  const session = await getSession();
  const session = await getAppServerSession();

  console.log(`session:${session}`);

  if (!session ||!session.user) {
    return new Response(JSON.stringify({ message: "Not authenticated" }), {
      status: 401,
      headers: {
        "Content-Type": "application/json",
      },
    });
  }

 
  const userEmail = session.user.email;
  try {
    const user: UserData | undefined = userdata.find(
      (user: UserData) => user.email === userEmail,
    );
    if (!user) {
      return new Response(JSON.stringify({ message: "Users data not found" }), {
        status: 404,
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
    return new Response(JSON.stringify(user), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("Data reading error:", error);
    return new Response(
      JSON.stringify({ message: "Users data reading error " }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
  }
}
