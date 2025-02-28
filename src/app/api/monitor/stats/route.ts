import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    // Fetch total citizens and gender distribution
    const citizenStats = await prismadb.citizens.groupBy({
      by: ["gender"],
      _count: {
        citizen_id: true,
      },
    });

    // Fetch household stats
    const householdStats = await prismadb.households.aggregate({
      _count: {
        household_id: true,
      },
      _avg: {
        income: true,
      },
    });

    // Get income distribution in ranges
    const incomeRanges = [
      { min: 0, max: 50000, label: "0-50K" },
      { min: 50000, max: 100000, label: "50K-1L" },
      { min: 100000, max: 200000, label: "1L-2L" },
      { min: 200000, max: 500000, label: "2L-5L" },
      { min: 500000, max: Infinity, label: "5L+" },
    ];

    const incomeDistribution = await Promise.all(
      incomeRanges.map(async (range) => {
        const count = await prismadb.households.count({
          where: {
            income: {
              gte: range.min,
              ...(range.max !== Infinity ? { lt: range.max } : {}),
            },
          },
        });
        return { range: range.label, count };
      })
    );

    // Fetch asset stats
    const assetStats = await prismadb.assets.aggregate({
      _count: {
        asset_id: true,
      },
    });

    const assetDistribution = await prismadb.assets.groupBy({
      by: ["type"],
      _count: {
        asset_id: true,
      },
    });

    // Get recent installations
    const recentInstallations = await prismadb.assets.findMany({
      orderBy: {
        installation_date: "desc",
      },
      take: 5,
      select: {
        type: true,
        location: true,
        installation_date: true,
      },
    });

    // Fetch vaccination stats
    const vaccinationStats = await prismadb.vaccinations.aggregate({
      _count: {
        vaccination_id: true,
      },
    });

    const vaccineTypes = await prismadb.vaccinations.groupBy({
      by: ["vaccine_type"],
      _count: {
        vaccination_id: true,
      },
    });

    // Fetch land stats
    const landStats = await prismadb.land_records.aggregate({
      _sum: {
        area_acres: true,
      },
    });

    const cropDistribution = await prismadb.land_records.groupBy({
      by: ["crop_type"],
      _count: {
        land_id: true,
      },
    });

    // Fetch scheme stats
    const schemeStats = await prismadb.scheme_enrollments.aggregate({
      _count: {
        enrollment_id: true,
      },
    });

    const schemeDistribution = await prismadb.scheme_enrollments.groupBy({
      by: ["scheme_id"],
      _count: {
        enrollment_id: true,
      },
      orderBy: {
        _count: {
          enrollment_id: "desc",
        },
      },
    });

    // Format the response
    const stats = {
      totalCitizens: citizenStats.reduce(
        (acc, curr) => acc + curr._count.citizen_id,
        0
      ),
      genderDistribution: {
        male:
          citizenStats.find((s) => s.gender === "Male")?._count.citizen_id || 0,
        female:
          citizenStats.find((s) => s.gender === "Female")?._count.citizen_id ||
          0,
      },
      vaccinationStats: {
        totalVaccinations: vaccinationStats._count.vaccination_id,
        vaccineTypes: Object.fromEntries(
          vaccineTypes.map((v) => [v.vaccine_type, v._count.vaccination_id])
        ),
      },
      landStats: {
        totalLand: Number(landStats._sum.area_acres) || 0,
        cropDistribution: Object.fromEntries(
          cropDistribution.map((c) => [c.crop_type, c._count.land_id])
        ),
      },
      schemeStats: {
        totalEnrollments: schemeStats._count.enrollment_id,
        schemeDistribution: Object.fromEntries(
          schemeDistribution.map((s) => [
            s.scheme_id.toString(),
            s._count.enrollment_id,
          ])
        ),
      },
      householdStats: {
        totalHouseholds: householdStats._count.household_id,
        averageIncome: Math.round(Number(householdStats._avg.income) || 0),
        incomeDistribution,
      },
      assetStats: {
        totalAssets: assetStats._count.asset_id,
        assetDistribution: assetDistribution.map((a) => ({
          type: a.type,
          count: a._count.asset_id,
        })),
        recentInstallations: recentInstallations.map((i) => ({
          type: i.type,
          location: i.location,
          installationDate: i.installation_date.toISOString(),
        })),
      },
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("Error fetching monitor stats:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
