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

export async function GET() {
  try {
    const deals = await redis.get<Deal[]>(DEALS_KEY);
    return NextResponse.json(deals || []);
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const newDeal: Deal = await request.json();
    const deals = (await redis.get<Deal[]>(DEALS_KEY)) || [];
    deals.push(newDeal);
    await redis.set(DEALS_KEY, deals);
    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error("Failed to add deal:", error);
    return NextResponse.json({ error: "Failed to add deal" }, { status: 500 });
  }
}
