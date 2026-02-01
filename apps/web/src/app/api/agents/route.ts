import { NextResponse } from "next/server";
import { getAgents } from "@/lib/agents";

export async function GET() {
  const items = getAgents().map((agent) => ({
    id: agent.id,
    name: agent.name,
    skills: agent.skills,
    pricing: agent.pricing,
    status: agent.status,
    rating_avg: agent.ratingAvg ?? null,
    rating_count: agent.ratingCount ?? 0,
  }));

  return NextResponse.json({ items });
}
