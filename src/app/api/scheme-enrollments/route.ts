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
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log("Parsed body:", body);
    const { citizen_id, scheme_id } = body;

    console.log("Creating scheme enrollment:", body);
    //first check if the scehms id and citizen id are valid
    const citizen = await prismadb.citizens.findFirst({
      where: {
        citizen_id: parseInt(citizen_id),
      },
    });

    if (!citizen) {
      return NextResponse.json(
        { message: "Citizen not found" },
        { status: 404 },
      );
    }

    const scheme = await prismadb.welfare_schemes.findFirst({
      where: {
        scheme_id: parseInt(scheme_id),
      },
    });

    if (!scheme) {
      return NextResponse.json(
        { message: "Scheme not found" },
        { status: 204 },
      );
    }

    //Neccessary checks to check if that citizen is already enrolled in that scheme
    const existingEnrollment = await prismadb.scheme_enrollments.findFirst({
      where: {
        citizen_id: parseInt(citizen_id),
        scheme_id: parseInt(scheme_id),
      },
    });

    if (existingEnrollment) {
      return NextResponse.json(
        { message: "Citizen already enrolled in the scheme" },
        { status: 203 },
      );
    }

    const enrollment = await prismadb.scheme_enrollments.create({
      data: {
        citizen_id: parseInt(citizen_id),
        scheme_id: parseInt(scheme_id),
        enrollment_date: new Date(),
      },
    });

    console.log("Scheme enrollment created:", enrollment);

    return NextResponse.json({
      code: 0,
      message: "Scheme enrollment created successfully",
    });
  } catch (error) {
    console.error("Error creating scheme enrollment:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 },
    );
  }
}
