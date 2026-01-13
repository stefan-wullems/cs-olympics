import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { auth } from "@/auth";

interface Deal {
  id: number;
  csm: string;
  customer: string;
  type: string;
  medal: string;
  date: string;
}

const redis = Redis.fromEnv();
const DEALS_KEY = "cs-olympics-deals";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const dealId = parseInt(id, 10);

    if (isNaN(dealId)) {
      return NextResponse.json({ error: "Invalid deal ID" }, { status: 400 });
    }

    const deals = (await redis.get<Deal[]>(DEALS_KEY)) || [];
    const filteredDeals = deals.filter((deal) => deal.id !== dealId);

    if (deals.length === filteredDeals.length) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    await redis.set(DEALS_KEY, filteredDeals);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete deal:", error);
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
