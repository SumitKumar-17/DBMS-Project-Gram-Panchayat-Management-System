import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const citizenId = parseInt(id, 10);

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
