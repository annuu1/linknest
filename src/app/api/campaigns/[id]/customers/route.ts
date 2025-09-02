import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const phone = searchParams.get("phone") || "";

  try {
    const client = await clientPromise;
    const db = client.db("test");

    const query: any = { team: new ObjectId(params.id) }; // adjust if relation is different
    if (phone) {
      query.phoneNumber = { $regex: phone, $options: "i" };
    }

    const customers = await db
      .collection("customers")
      .find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .toArray();

    const total = await db.collection("customers").countDocuments(query);

    return NextResponse.json({
      data: customers,
      page,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to fetch customers" }, { status: 500 });
  }
}
