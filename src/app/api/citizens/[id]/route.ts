import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { CitizenDetails } from "@/types/models";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const citizenId = parseInt(params.id);
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
