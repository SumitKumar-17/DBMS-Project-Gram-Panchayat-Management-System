import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { AuthResponse } from "@/types/auth";
import prismadb from "@/lib/prismadb";

export async function POST(request: Request) {
  try {
    const {
      name,
      email,
      password,
      gender,
      dob,
      household_id,
      educational_qualification,
      isEmployee,
      role,
    } = await request.json();

    // Validate input
    if (
      !name ||
      !email ||
      !password ||
      !gender ||
      !dob ||
      !household_id ||
      !educational_qualification
    ) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prismadb.citizens.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create citizen
    const citizen = await prismadb.citizens.create({
      data: {
        name,
        email,
        password: hashedPassword,
        gender,
        dob: new Date(dob),
        household_id,
        educational_qualification,
      },
    });

    // If registering as employee, create employee record
    if (isEmployee && role) {
      await prismadb.panachayat_employees.create({
        data: {
          citizen_id: citizen.citizen_id,
          role,
        },
      });
    }

    return NextResponse.json<AuthResponse>(
      {
        code: 0,
        message: "User created successfully",
        data: {
          id: citizen.citizen_id,
          name: citizen.name,
          email: citizen.email,
          userType: isEmployee ? "employee" : "citizen",
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { message: "Internal server error", code: -1 },
      { status: 500 }
    );
  }
}
