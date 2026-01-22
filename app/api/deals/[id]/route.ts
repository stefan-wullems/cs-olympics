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

export async function PUT(
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

    const body = await request.json();

    // Validate input
    const validationResult = DealInputSchema.safeParse(body);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: "Invalid data", details: validationResult.error.flatten() },
        { status: 400 }
      );
    }

    const deals = (await redis.get<Deal[]>(DEALS_KEY)) || [];
    const dealIndex = deals.findIndex((deal) => deal.id === dealId);

    if (dealIndex === -1) {
      return NextResponse.json({ error: "Deal not found" }, { status: 404 });
    }

    const updatedDeal: Deal = {
      ...validationResult.data,
      id: dealId,
    };

    deals[dealIndex] = updatedDeal;
    await redis.set(DEALS_KEY, deals);

    return NextResponse.json(updatedDeal);
  } catch (error) {
    console.error("Failed to update deal:", error);
    return NextResponse.json({ error: "Failed to update deal" }, { status: 500 });
  }
}
