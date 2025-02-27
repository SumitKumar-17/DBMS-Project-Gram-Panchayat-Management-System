import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const schemeEnrollments = await prismadb.scheme_enrollments.findMany({
      include: {
        citizens: {
          select: {
            name: true,
          },
        },
        welfare_schemes: true,
      },
    });
    return NextResponse.json(schemeEnrollments);
  } catch (error) {
    console.error("Error fetching scheme enrollments:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { citizen_id, scheme_id } = body;

    const enrollment = await prismadb.scheme_enrollments.create({
      data: {
        citizen_id: parseInt(citizen_id),
        scheme_id: parseInt(scheme_id),
        enrollment_date: new Date(),
      },
    });

    return NextResponse.json(enrollment);
  } catch (error) {
    console.error("Error creating scheme enrollment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
