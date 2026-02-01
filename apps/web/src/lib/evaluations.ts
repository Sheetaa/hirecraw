import type { Agent, Evaluation } from "@hireclaw/shared";
import { store } from "./store";

export function getEvaluationByBookingId(
  bookingId: string
): Evaluation | undefined {
  return store.evaluations.find((evaluation) => evaluation.bookingId === bookingId);
}

export function getEvaluationsByAgentId(agentId: string): Evaluation[] {
  return store.evaluations
    .filter((evaluation) => evaluation.agentId === agentId)
    .slice()
    .reverse();
}

function updateAgentRating(agent: Agent) {
  const agentEvaluations = store.evaluations.filter(
    (evaluation) => evaluation.agentId === agent.id
  );

  if (agentEvaluations.length === 0) {
    agent.ratingAvg = undefined;
    agent.ratingCount = 0;
    return;
  }

  const total = agentEvaluations.reduce((sum, evaluation) => sum + evaluation.rating, 0);
  agent.ratingCount = agentEvaluations.length;
  agent.ratingAvg = Number((total / agent.ratingCount).toFixed(1));
}

export function createEvaluation(input: {
  agentId: string;
  bookingId: string;
  rating: number;
  comment?: string;
}): Evaluation {
  const evaluation: Evaluation = {
    id: `evaluation_${Date.now()}`,
    agentId: input.agentId,
    bookingId: input.bookingId,
    rating: input.rating,
    comment: input.comment,
  };

  store.evaluations.push(evaluation);

  const agent = store.agents.find((item) => item.id === input.agentId);
  if (agent) {
    updateAgentRating(agent);
  }

  return evaluation;
}
