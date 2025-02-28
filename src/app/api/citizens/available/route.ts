import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const citizens = await prismadb.citizens.findMany({
      where: {
        household_id: null,
      },
      select: {
        citizen_id: true,
        name: true,
        email: true,
        gender: true,
        dob: true,
        educational_qualification: true,
      },
    });

    return NextResponse.json(citizens);
  } catch (error) {
    console.error("Error fetching available citizens:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
