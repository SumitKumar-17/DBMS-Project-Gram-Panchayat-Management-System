import { NextRequest, NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const householdId = parseInt(id, 10);
    const body = await req.json();

    const updatedHousehold = await prismadb.households.update({
      where: { household_id: householdId },
      data: {
        address: body.address,
        income: body.income,
      },
    });

    return NextResponse.json(updatedHousehold);
  } catch (error) {
    console.error("Error updating household:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
