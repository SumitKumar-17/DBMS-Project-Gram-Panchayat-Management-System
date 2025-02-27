import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function clearDatabase() {
  console.log("Clearing existing data...");
  // Delete in correct order based on foreign key dependencies
  await prisma.census_data.deleteMany({}); // Delete first as it references citizens
  await prisma.vaccinations.deleteMany({});
  await prisma.scheme_enrollments.deleteMany({});
  await prisma.land_records.deleteMany({});
  await prisma.panachayat_employees.deleteMany({});
  await prisma.citizens.deleteMany({});
  await prisma.government_monitor.deleteMany({});
  await prisma.welfare_schemes.deleteMany({});
  await prisma.households.deleteMany({});
  await prisma.assets.deleteMany({});
  console.log("Database cleared successfully!");
}

async function main() {
  try {
    await clearDatabase();

    console.log("Creating new test data...");

    // Create households
    const household1 = await prisma.households.create({
      data: {
        address: "123 Rural Street, Village 1",
        income: 25000.0,
      },
    });

    const household2 = await prisma.households.create({
      data: {
        address: "456 Farm Road, Village 2",
        income: 35000.0,
      },
    });

    // Create citizens
    const hashedPassword = await bcrypt.hash("password123", 10);

    const citizen1 = await prisma.citizens.create({
      data: {
        name: "John Doe",
        gender: "male",
        dob: new Date("1990-01-15"),
        household_id: household1.household_id,
        educational_qualification: "High School",
        email: "john@example.com",
        password: hashedPassword,
      },
    });

    const citizen2 = await prisma.citizens.create({
      data: {
        name: "Jane Smith",
        gender: "female",
        dob: new Date("1985-03-20"),
        household_id: household2.household_id,
        educational_qualification: "Bachelor's Degree",
        email: "jane@example.com",
        password: hashedPassword,
      },
    });

    // Create employee (who is also a citizen)
    const employee = await prisma.citizens.create({
      data: {
        name: "Bob Wilson",
        gender: "male",
        dob: new Date("1980-07-10"),
        household_id: household1.household_id,
        educational_qualification: "Master's Degree",
        email: "bob@example.com",
        password: hashedPassword,
      },
    });

    await prisma.panachayat_employees.create({
      data: {
        citizen_id: employee.citizen_id,
        role: "Health Officer",
      },
    });

    // Create government monitor
    await prisma.government_monitor.create({
      data: {
        email: "monitor@gov.in",
        password: hashedPassword,
      },
    });

    // Create welfare schemes
    const scheme1 = await prisma.welfare_schemes.create({
      data: {
        name: "Rural Housing Scheme",
        description: "Financial assistance for building houses",
      },
    });

    const scheme2 = await prisma.welfare_schemes.create({
      data: {
        name: "Farmer Support Program",
        description: "Subsidies for agricultural equipment",
      },
    });

    // Create scheme enrollments
    await prisma.scheme_enrollments.create({
      data: {
        citizen_id: citizen1.citizen_id,
        scheme_id: scheme1.scheme_id,
        enrollment_date: new Date("2023-01-01"),
      },
    });

    await prisma.scheme_enrollments.create({
      data: {
        citizen_id: citizen2.citizen_id,
        scheme_id: scheme2.scheme_id,
        enrollment_date: new Date("2023-02-15"),
      },
    });

    // Create land records
    await prisma.land_records.create({
      data: {
        citizen_id: citizen1.citizen_id,
        area_acres: 5.5,
        crop_type: "Rice",
      },
    });

    await prisma.land_records.create({
      data: {
        citizen_id: citizen2.citizen_id,
        area_acres: 3.2,
        crop_type: "Wheat",
      },
    });

    // Create vaccination records
    await prisma.vaccinations.create({
      data: {
        citizen_id: citizen1.citizen_id,
        vaccine_type: "COVID-19",
        date_administered: new Date("2023-03-10"),
      },
    });

    await prisma.vaccinations.create({
      data: {
        citizen_id: citizen2.citizen_id,
        vaccine_type: "Influenza",
        date_administered: new Date("2023-04-05"),
      },
    });

    // Create census data
    await prisma.census_data.create({
      data: {
        household_id: household1.household_id,
        citizen_id: citizen1.citizen_id,
        event_type: "Registration",
        event_date: new Date("2023-01-01"),
      },
    });

    await prisma.census_data.create({
      data: {
        household_id: household2.household_id,
        citizen_id: citizen2.citizen_id,
        event_type: "Registration",
        event_date: new Date("2023-01-01"),
      },
    });

    // Create assets
    await prisma.assets.create({
      data: {
        type: "Community Center",
        location: "Village 1 Center",
        installation_date: new Date("2022-01-01"),
      },
    });

    await prisma.assets.create({
      data: {
        type: "Water Pump",
        location: "Village 2 North",
        installation_date: new Date("2022-06-15"),
      },
    });

    console.log("\nTest data created successfully!");
    console.log("\nTest Accounts:");
    console.log("-------------");
    console.log("Regular Citizens:");
    console.log("- Email: john@example.com / Password: password123");
    console.log("- Email: jane@example.com / Password: password123");
    console.log("\nEmployee (Health Officer):");
    console.log("- Email: bob@example.com / Password: password123");
    console.log("\nGovernment Monitor:");
    console.log("- Email: monitor@gov.in / Password: password123");
  } catch (error) {
    console.error("Error seeding data:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
