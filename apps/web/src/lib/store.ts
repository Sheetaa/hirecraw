import type { Agent, Booking, Evaluation, Slot, Task } from "@hireclaw/shared";

type Store = {
  agents: Agent[];
  slots: Slot[];
  bookings: Booking[];
  tasks: Task[];
  evaluations: Evaluation[];
};

function createInitialStore(): Store {
  return {
    agents: [
      {
        id: "agent_1",
        name: "InsightCrawler",
        description: "Deep market research agent for crisp, sourced summaries.",
        skills: "market research, summaries, competitor scans",
        demo: "Sample: 5-point market landscape with sources and risks.",
        pricing: 49,
        ownerId: "owner_1",
        status: "active",
        ratingAvg: 4.6,
        ratingCount: 12,
      },
      {
        id: "agent_2",
        name: "SpecForge",
        description: "Product spec drafting with structured deliverables.",
        skills: "PRDs, user stories, acceptance criteria",
        demo: "Sample: PRD outline + user story matrix.",
        pricing: 59,
        ownerId: "owner_2",
        status: "active",
        ratingAvg: 4.8,
        ratingCount: 7,
      },
    ],
    slots: [
      {
        id: "slot_1",
        agentId: "agent_1",
        startAt: "2026-02-02T09:00:00Z",
        endAt: "2026-02-02T10:00:00Z",
        status: "available",
      },
      {
        id: "slot_2",
        agentId: "agent_1",
        startAt: "2026-02-02T11:00:00Z",
        endAt: "2026-02-02T12:00:00Z",
        status: "booked",
      },
      {
        id: "slot_3",
        agentId: "agent_2",
        startAt: "2026-02-03T09:30:00Z",
        endAt: "2026-02-03T10:30:00Z",
        status: "booked",
      },
      {
        id: "slot_4",
        agentId: "agent_2",
        startAt: "2026-02-03T14:00:00Z",
        endAt: "2026-02-03T15:00:00Z",
        status: "available",
      },
    ],
    bookings: [
      {
        id: "booking_1",
        agentId: "agent_1",
        employerId: "employer_1",
        slotId: "slot_2",
        status: "booked",
      },
      {
        id: "booking_2",
        agentId: "agent_2",
        employerId: "employer_2",
        slotId: "slot_3",
        status: "booked",
      },
    ],
    tasks: [
      {
        id: "task_1",
        agentId: "agent_1",
        bookingId: "booking_1",
        inputPayload: "Summarize the Q1 market outlook for AI copilots.",
        status: "done",
        output:
          "Mock result: AI copilot demand is growing in SMB segments, with pricing pressure expected by mid-year.",
      },
      {
        id: "task_2",
        agentId: "agent_2",
        bookingId: "booking_2",
        inputPayload: "Draft a PRD outline for a payroll onboarding flow.",
        status: "pending",
      },
    ],
    evaluations: [],
  };
}

const globalStore = globalThis as typeof globalThis & {
  __hireclawStore?: Store;
};

export const store = globalStore.__hireclawStore ?? createInitialStore();
if (!store.evaluations) {
  store.evaluations = [];
}
globalStore.__hireclawStore = store;
