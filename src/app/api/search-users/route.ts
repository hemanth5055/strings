import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("q");
  if (!query || query.trim() === "") {
    return NextResponse.json([]);
  }
  try {
    const users = await prisma.user.findMany({
      where: {
        username: {
          contains: query,
          mode: "insensitive",
        },
      },
      select: {
        id: true,
        name: true,
        username: true,
        image: true,
        isVerified: true,
      },
    });
    return NextResponse.json(users);
  } catch (error) {
    console.error("Error in search-users API:", error);
    return NextResponse.json([], { status: 500 });
  }
}
