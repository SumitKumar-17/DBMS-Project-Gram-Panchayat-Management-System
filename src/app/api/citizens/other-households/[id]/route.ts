import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const householdId = parseInt(params.id, 10);

    const citizens = await prismadb.citizens.findMany({
      where: {
        household_id: {
          not: householdId,
        },
      },
      select: {
        citizen_id: true,
        name: true,
        email: true,
        gender: true,
        dob: true,
        educational_qualification: true,
        household_id: true,
      },
    });

    return NextResponse.json(citizens);
  } catch (error) {
    console.error("Error fetching citizens from other households:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
