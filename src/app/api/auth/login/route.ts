import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AuthResponse } from "@/types/auth";
import prismadb from "@/lib/prismadb";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, password, userType } = body;

    if (!email || !password || !userType) {
      return NextResponse.json<AuthResponse>({
        code: -1,
        message: "Missing required fields",
      });
    }

    switch (userType) {
      case "citizen":
      case "employee": {
        const citizen = await prismadb.citizens.findUnique({
          where: { email },
          include: {
            panachayat_employees: true,
          },
        });

        if (!citizen) {
          return NextResponse.json<AuthResponse>({
            code: -1,
            message: "Invalid credentials",
          });
        }

        const passwordMatch = await bcrypt.compare(password, citizen.password);
        if (!passwordMatch) {
          return NextResponse.json<AuthResponse>({
            code: -1,
            message: "Invalid credentials",
          });
        }

        const isEmployee = citizen.panachayat_employees.length > 0;
        if (userType === "employee" && !isEmployee) {
          return NextResponse.json<AuthResponse>({
            code: -1,
            message: "User is not a panchayat employee",
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            userId: citizen.citizen_id,
            email: citizen.email,
            userType: isEmployee ? "employee" : "citizen",
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        return NextResponse.json<AuthResponse>({
          code: 0,
          message: "Login successful",
          data: {
            id: citizen.citizen_id,
            email: citizen.email,
            name: citizen.name,
            userType: isEmployee ? "employee" : "citizen",
          },
          token,
        });
      }

      case "monitor": {
        const monitor = await prismadb.government_monitor.findUnique({
          where: { email },
        });

        if (!monitor) {
          return NextResponse.json<AuthResponse>({
            code: -1,
            message: "Invalid credentials",
          });
        }

        const passwordMatch = await bcrypt.compare(password, monitor.password);
        if (!passwordMatch) {
          return NextResponse.json<AuthResponse>({
            code: -1,
            message: "Invalid credentials",
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          {
            userId: monitor.monitor_id,
            email: monitor.email,
            userType: "monitor",
          },
          JWT_SECRET,
          { expiresIn: "24h" }
        );

        return NextResponse.json<AuthResponse>({
          code: 0,
          message: "Login successful",
          data: {
            id: monitor.monitor_id,
            email: monitor.email,
            userType: "monitor",
          },
          token,
        });
      }

      default:
        return NextResponse.json<AuthResponse>({
          code: -1,
          message: "Invalid user type",
        });
    }
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json<AuthResponse>({
      code: -1,
      message: "Internal server error",
    });
  }
}
