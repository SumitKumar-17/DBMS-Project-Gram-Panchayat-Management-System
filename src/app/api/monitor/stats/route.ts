import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";
import { DashboardStats } from "@/types/monitor";

export async function GET() {
  try {
    // Get total citizens and gender distribution
    const citizens = await prismadb.citizens.findMany({
      select: {
        gender: true,
      },
    });

    const totalCitizens = citizens.length;
    const genderDistribution = citizens.reduce(
      (acc, curr) => {
        if (curr.gender.toLowerCase() === "male") acc.male++;
        if (curr.gender.toLowerCase() === "female") acc.female++;
        return acc;
      },
      { male: 0, female: 0 },
    );

    // Get vaccination statistics
    const vaccinations = await prismadb.vaccinations.findMany({
      select: {
        vaccine_type: true,
      },
    });

    const vaccineTypes = vaccinations.reduce(
      (acc: { [key: string]: number }, curr) => {
        acc[curr.vaccine_type] = (acc[curr.vaccine_type] || 0) + 1;
        return acc;
      },
      {},
    );

    // Get land statistics
    const landRecords = await prismadb.land_records.findMany({
      select: {
        area_acres: true,
        crop_type: true,
      },
    });

    const totalLand = landRecords.reduce(
      (sum, record) => sum + Number(record.area_acres),
      0,
    );

    const cropDistribution = landRecords.reduce(
      (acc: { [key: string]: number }, curr) => {
        acc[curr.crop_type] =
          (acc[curr.crop_type] || 0) + Number(curr.area_acres);
        return acc;
      },
      {},
    );

    // Get scheme statistics
    const schemeEnrollments = await prismadb.scheme_enrollments.findMany({
      include: {
        welfare_schemes: true,
      },
    });

    const schemeDistribution = schemeEnrollments.reduce(
      (acc: { [key: string]: number }, curr) => {
        const schemeName = curr.welfare_schemes.name;
        acc[schemeName] = (acc[schemeName] || 0) + 1;
        return acc;
      },
      {},
    );

    const stats: DashboardStats = {
      totalCitizens,
      genderDistribution,
      vaccinationStats: {
        totalVaccinations: vaccinations.length,
        vaccineTypes,
      },
      landStats: {
        totalLand,
        cropDistribution,
      },
      schemeStats: {
        totalEnrollments: schemeEnrollments.length,
        schemeDistribution,
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching monitor stats:", error);
    return NextResponse.json(
      { message: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
