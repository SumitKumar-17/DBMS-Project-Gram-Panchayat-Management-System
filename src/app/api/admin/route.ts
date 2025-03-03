import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const assets = await prismadb.assets.findMany();
    const census_data = await prismadb.census_data.findMany();
    const citizens = await prismadb.citizens.findMany();
    const government_monitor = await prismadb.government_monitor.findMany();
    const households = await prismadb.households.findMany();
    const land_records = await prismadb.land_records.findMany();
    const panachayat_employees = await prismadb.panachayat_employees.findMany();
    const scheme_enrollments = await prismadb.scheme_enrollments.findMany();
    const vaccinations = await prismadb.vaccinations.findMany();
    const welfare_schemes = await prismadb.welfare_schemes.findMany();

    return NextResponse.json({
      assets,
      census_data,
      citizens,
      government_monitor,
      households,
      land_records,
      panachayat_employees,
      scheme_enrollments,
      vaccinations,
      welfare_schemes,
    });
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}
