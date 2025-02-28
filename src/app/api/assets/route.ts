import { NextResponse } from "next/server";
import prismadb from "@/lib/prismadb";

export async function GET() {
  try {
    const assets = await prismadb.assets.findMany({
      orderBy: {
        asset_id: "desc",
      },
    });

    return NextResponse.json(assets);
  } catch (error) {
    console.error("Error fetching assets:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // If asset_id is provided, update existing asset
    if (body.asset_id) {
      const asset = await prismadb.assets.update({
        where: { asset_id: body.asset_id },
        data: {
          type: body.type,
          location: body.location,
        },
      });
      return NextResponse.json(asset);
    }

    // Otherwise create new asset
    const asset = await prismadb.assets.create({
      data: {
        type: body.type,
        location: body.location,
        installation_date: new Date(),
      },
    });

    return NextResponse.json(asset);
  } catch (error) {
    console.error("Error managing asset:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
