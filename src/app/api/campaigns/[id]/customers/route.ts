import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "10");
  const phone = searchParams.get("phone") || "";

  try {
    const client = await clientPromise;
    const db = client.db("test");

    const pipeline: any[] = [
      { $match: { campaignId: new ObjectId(id) } }, // filter by campaign
      {
        $lookup: {
          from: "customers",
          localField: "customerId",
          foreignField: "_id",
          as: "customer",
        },
      },
      { $unwind: "$customer" }, // flatten
    ];

    // Optional phone filter
    if (phone) {
      pipeline.push({
        $match: { "customer.phoneNumber": { $regex: phone, $options: "i" } },
      });
    }

    // Count total
    const total = await db.collection("messages").aggregate(pipeline).toArray();
    const totalCount = total.length;

    // Pagination
    pipeline.push({ $skip: (page - 1) * limit });
    pipeline.push({ $limit: limit });

    const results = await db.collection("messages").aggregate(pipeline).toArray();

    // Map to only return customer info (you can also include message info if you want)
    const customers = results.map((msg) => ({
      ...msg.customer,
      messageStatus: msg.status,
      sentAt: msg.sentAt,
    }));

    return NextResponse.json({
      data: customers,
      page,
      total: totalCount,
      totalPages: Math.ceil(totalCount / limit),
    });
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    );
  }
}
