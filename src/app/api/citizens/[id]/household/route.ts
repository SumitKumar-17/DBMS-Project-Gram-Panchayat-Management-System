import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const citizenId = parseInt(params.id, 10);

    const updatedCitizen = await prismadb.citizens.update({
      where: { citizen_id: citizenId },
      data: {
        household_id: body.household_id,
      },
    });

    return NextResponse.json(updatedCitizen);
  } catch (error) {
    console.error("Error updating citizen household:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
