export type ID = string;

export type AgentStatus = "active" | "offline";
export type SlotStatus = "available" | "booked" | "running" | "done";
export type BookingStatus = "booked" | "completed";
export type TaskStatus = "pending" | "running" | "done" | "failed";

export interface Agent {
  id: ID;
  name: string;
  description: string;
  skills?: string;
  demo?: string;
  pricing: number;
  ownerId: ID;
  status: AgentStatus;
  ratingAvg?: number;
  ratingCount?: number;
}

export interface Slot {
  id: ID;
  agentId: ID;
  startAt: string;
  endAt: string;
  status: SlotStatus;
}

export interface Booking {
  id: ID;
  agentId: ID;
  employerId: ID;
  slotId: ID;
  status: BookingStatus;
}

export interface Task {
  id: ID;
  agentId: ID;
  bookingId: ID;
  inputPayload: string;
  status: TaskStatus;
  output?: string;
}

export interface Evaluation {
  id: ID;
  agentId: ID;
  bookingId: ID;
  rating: number;
  comment?: string;
}
