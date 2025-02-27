
import {  NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { CitizenDetails } from "@/types/models";
export async function GET(request: NextRequest, context: { params: { id: string } }) {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json({ message: "Citizen ID is required" }, { status: 400 });
    }

    const citizenId = parseInt(id, 10);
    if (isNaN(citizenId)) {
      return NextResponse.json({ message: "Invalid Citizen ID" }, { status: 400 });
    }
    const citizen = (await prismadb.citizens.findUnique({
      where: { citizen_id: citizenId },
      include: {
        vaccinations: true,
        land_records: true,
        scheme_enrollments: {
          include: {
            welfare_schemes: true,
          },
        },
      },
    })) as CitizenDetails | null;

    if (!citizen) {
      return NextResponse.json(
        { message: "Citizen not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(citizen);
  } catch (error) {
    console.error("Error fetching citizen data:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
