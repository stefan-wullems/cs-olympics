import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";

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
  try {
    const { id } = await params;
    const dealId = parseInt(id, 10);
    const deals = (await redis.get<Deal[]>(DEALS_KEY)) || [];
    const filteredDeals = deals.filter((deal) => deal.id !== dealId);
    await redis.set(DEALS_KEY, filteredDeals);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete deal:", error);
    return NextResponse.json({ error: "Failed to delete deal" }, { status: 500 });
  }
}
