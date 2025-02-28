import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const citizenId = parseInt(params.id, 10);

    // Update the citizen's household_id
    const updatedCitizen = await prismadb.citizens.update({
      where: { citizen_id: citizenId },
      data: {
        household_id: body.new_household_id,
      },
    });

    // Create a census record for the transfer
    await prismadb.census_data.create({
      data: {
        household_id: body.new_household_id,
        citizen_id: citizenId,
        event_type: "Transfer",
        event_date: new Date(),
      },
    });

    return NextResponse.json(updatedCitizen);
  } catch (error) {
    console.error("Error transferring citizen:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
