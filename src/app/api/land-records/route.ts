import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const landRecords = await prismadb.land_records.findMany({
      include: {
        citizens: {
          select: {
            name: true,
          },
        },
      },
    });
    return NextResponse.json(landRecords);
  } catch (error) {
    console.error("Error fetching land records:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { citizen_id, area_acres, crop_type } = body;

    const landRecord = await prismadb.land_records.create({
      data: {
        citizen_id: parseInt(citizen_id),
        area_acres: parseFloat(area_acres),
        crop_type,
      },
    });

    return NextResponse.json(landRecord);
  } catch (error) {
    console.error("Error creating land record:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
