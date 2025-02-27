import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const citizens = await prismadb.citizens.findMany({
      select: {
        citizen_id: true,
        name: true,
        gender: true,
        dob: true,
        educational_qualification: true,
        household_id: true,
      },
    });

    return NextResponse.json(citizens);
  } catch (error) {
    console.error("Error fetching citizens:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
