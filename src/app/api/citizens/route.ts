import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import bcrypt from "bcrypt";

export async function GET() {
  try {
    const citizens = await prismadb.citizens.findMany({
      select: {
        citizen_id: true,
        name: true,
        gender: true,
        dob: true,
        educational_qualification: true,
        household_id: true,
      },
    });

    return NextResponse.json(citizens);
  } catch (error) {
    console.error("Error fetching citizens:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const hashedPassword = await bcrypt.hash(body.password, 10);

    const citizen = await prismadb.citizens.create({
      data: {
        name: body.name,
        gender: body.gender,
        dob: new Date(body.dob),
        educational_qualification: body.educational_qualification,
        email: body.email,
        password: hashedPassword,
        household_id: body.household_id,
      },
    });

    // Remove password from response
    const { password, ...citizenWithoutPassword } = citizen;
    return NextResponse.json(citizenWithoutPassword);
  } catch (error) {
    console.error("Error creating citizen:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
