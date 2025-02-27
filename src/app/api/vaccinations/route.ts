import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const vaccinations = await prismadb.vaccinations.findMany({
      include: {
        citizens: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        date_administered: "desc",
      },
    });
    return NextResponse.json(vaccinations);
  } catch (error) {
    console.error("Error fetching vaccinations:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { citizen_id, vaccine_type, date_administered } = body;

    const vaccination = await prismadb.vaccinations.create({
      data: {
        citizen_id: parseInt(citizen_id),
        vaccine_type,
        date_administered: new Date(date_administered),
      },
    });

    return NextResponse.json(vaccination);
  } catch (error) {
    console.error("Error creating vaccination:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
