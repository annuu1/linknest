import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { flag, name } = body;

    const client = await clientPromise;
    const db = client.db("test");

    const updateFields: any = {};
    if (flag) updateFields.flag = flag;
    if (name) updateFields.name = name;

    const result = await db.collection("customers").findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateFields },
      { returnDocument: "after" }
    );

    return NextResponse.json(result?.value);
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to update customer" }, { status: 500 });
  }
}
