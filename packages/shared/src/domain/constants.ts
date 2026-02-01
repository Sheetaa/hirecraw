import type { BookingStatus, SlotStatus, TaskStatus } from "./types";

export const slotStatusTransitions: Record<SlotStatus, SlotStatus[]> = {
  available: ["booked"],
  booked: ["running", "done"],
  running: ["done"],
  done: [],
};

export const bookingStatusTransitions: Record<BookingStatus, BookingStatus[]> = {
  booked: ["completed"],
  completed: [],
};

export const taskStatusTransitions: Record<TaskStatus, TaskStatus[]> = {
  pending: ["running", "done", "failed"],
  running: ["done", "failed"],
  done: [],
  failed: [],
};

export const errorCodes = {
  invalidPayload: "invalid_payload",
  slotAlreadyBooked: "slot_already_booked",
  slotNotAvailable: "slot_not_available",
  paidNotTrue: "paid_not_true",
  bookingNotFound: "booking_not_found",
  taskNotFound: "task_not_found",
  taskAlreadySubmitted: "task_already_submitted",
  taskNotDone: "task_not_done",
  evaluationExists: "evaluation_exists",
} as const;
