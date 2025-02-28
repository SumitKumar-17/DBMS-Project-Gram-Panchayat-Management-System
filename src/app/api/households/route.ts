import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const household = await prismadb.households.create({
      data: {
        address: body.address,
        income: body.income,
      },
    });

    return NextResponse.json(household);
  } catch (error) {
    console.error("Error creating household:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const households = await prismadb.households.findMany({
      include: {
        citizens: true,
      },
      orderBy: {
        household_id: "desc",
      },
    });

    return NextResponse.json(households);
  } catch (error) {
    console.error("Error fetching households:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
