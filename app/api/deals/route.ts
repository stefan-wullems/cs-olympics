import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { DealInputSchema } from "@/lib/validation";

interface Deal {
  id: number;
  csm: string;
  customer: string;
  notes?: string;
  type: string;
  medal: string;
  date: string;
  isDeal?: boolean;
}

const redis = Redis.fromEnv();
const DEALS_KEY = "cs-olympics-deals";

export async function GET() {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const deals = await redis.get<Deal[]>(DEALS_KEY);
    return NextResponse.json(deals || []);
  } catch (error) {
    console.error("Failed to fetch deals:", error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Forbidden - Admin access required" }, { status: 403 });
  }

  try {
    const body = await request.json();

    // Validate input
    const validationResult = DealInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const newDeal: Deal = {
      ...validationResult.data,
      id: Date.now(),
    };

    const deals = (await redis.get<Deal[]>(DEALS_KEY)) || [];
    deals.push(newDeal);
    await redis.set(DEALS_KEY, deals);

    return NextResponse.json(newDeal, { status: 201 });
  } catch (error) {
    console.error("Failed to add deal:", error);
    return NextResponse.json({ error: "Failed to add deal" }, { status: 500 });
  }
}
