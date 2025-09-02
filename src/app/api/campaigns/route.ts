import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("test");

    const campaigns = await db.collection("campaigns").find({}).toArray();

    return NextResponse.json(campaigns);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch campaigns" }, { status: 500 });
  }
}
