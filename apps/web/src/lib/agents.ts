import type { Agent, Slot } from "@hireclaw/shared";
import { store } from "./store";

export type AgentSummary = Pick<
  Agent,
  "id" | "name" | "skills" | "pricing" | "status" | "ratingAvg" | "ratingCount"
>;

export function getAgents(): AgentSummary[] {
  return store.agents.map((agent) => ({
    id: agent.id,
    name: agent.name,
    skills: agent.skills,
    pricing: agent.pricing,
    status: agent.status,
    ratingAvg: agent.ratingAvg,
    ratingCount: agent.ratingCount,
  }));
}

export function getAgentById(agentId: string): Agent | undefined {
  return store.agents.find((agent) => agent.id === agentId);
}

export function getSlotsByAgentId(agentId: string): Slot[] {
  return store.slots
    .filter((slot) => slot.agentId === agentId)
    .sort((a, b) => a.startAt.localeCompare(b.startAt));
}
