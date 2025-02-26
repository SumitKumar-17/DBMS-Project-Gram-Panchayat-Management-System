import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your_secret_key"; 

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsedData = loginUserSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json({ code: -1, message: "Invalid Input Data", errors: parsedData.error.errors });
    }

    const { email, password, role } = parsedData.data;

    if(role && role !== "citizen" && role !== "panchayat_employee") {

      const user = await prismadb.citizen.findUnique({
        where: { email },
      });
      
      if (!user) {
        return NextResponse.json({ code: -1, message: "User not found" });
      }

     const  passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      return NextResponse.json({ code: -1, message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.citizen_id, email: user.email, role: role || "citizen" }, SECRET_KEY, {
      expiresIn: "1h",
    });

    return NextResponse.json({
      code: 0,
      message: "Login successful",
      token,
      user: { id: user.citizen_id, email: user.email, role: role || "citizen" },
    });
      
    } else if(role === "government_monitor") {
      const user = await prismadb.government_Monitor.findUnique({
        where: { email },
      });
      
      if (!user) {
        return NextResponse.json({ code: -1, message: "User not found" });
      }

      const passwordValid = await bcrypt.compare(password, user.password);

      if (!passwordValid) {
        return NextResponse.json({ code: -1, message: "Invalid credentials" });
      }

      const token = jwt.sign({ id: user.monitor_id, email: user.email, role: role }, SECRET_KEY, {
        expiresIn: "1h",
      });

      return NextResponse.json({
        code: 0,
        message: "Login successful",
        token,
        user: { id: user.monitor_id, email: user.email, role: role },
      });
    }
  } catch (error: any) {
    return NextResponse.json({
      code: -1,
      message: "Internal Server Error",
      error: error.message,
    });
  }
}
