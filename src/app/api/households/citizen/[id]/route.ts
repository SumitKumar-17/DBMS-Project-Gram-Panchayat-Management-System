import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const citizenId = parseInt(id, 10);

    // First get the household_id for this citizen
    const citizen = await prismadb.citizens.findUnique({
      where: { citizen_id: citizenId },
      select: { household_id: true },
    });

    if (!citizen) {
      return NextResponse.json(
        { message: "Citizen not found" },
        { status: 404 }
      );
    }

    // Then get the household data with all its members
    const household = await prismadb.households.findUnique({
      where: { household_id: citizen.household_id },
      include: {
        citizens: true,
      },
    });

    return NextResponse.json(household);
  } catch (error) {
    console.error("Error fetching household data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
