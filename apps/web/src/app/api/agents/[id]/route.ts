import { NextResponse } from "next/server";
import { getAgentById, getSlotsByAgentId } from "@/lib/agents";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const agent = getAgentById(params.id);

  if (!agent) {
    return NextResponse.json({ error: "agent_not_found" }, { status: 404 });
  }

  const agentSlots = getSlotsByAgentId(agent.id).map((slot) => ({
    id: slot.id,
    start_at: slot.startAt,
    end_at: slot.endAt,
    status: slot.status,
  }));

  return NextResponse.json({
    agent: {
      id: agent.id,
      name: agent.name,
      description: agent.description,
      skills: agent.skills,
      demo: agent.demo,
      pricing: agent.pricing,
      owner_id: agent.ownerId,
      status: agent.status,
      rating_avg: agent.ratingAvg ?? null,
      rating_count: agent.ratingCount ?? 0,
    },
    slots: agentSlots,
  });
}
