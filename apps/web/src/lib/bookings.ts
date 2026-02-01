import type { Booking, Slot } from "@hireclaw/shared";
import { store } from "./store";

export function getBookingById(bookingId: string): Booking | undefined {
  return store.bookings.find((booking) => booking.id === bookingId);
}

export function findSlotById(slotId: string): Slot | undefined {
  return store.slots.find((slot) => slot.id === slotId);
}

export function lockSlot(slotId: string): Slot | undefined {
  const slot = findSlotById(slotId);
  if (!slot) {
    return undefined;
  }

  slot.status = "booked";
  return slot;
}

export function createBooking(input: {
  agentId: string;
  slotId: string;
  employerId: string;
}): Booking {
  const booking: Booking = {
    id: `booking_${Date.now()}`,
    agentId: input.agentId,
    slotId: input.slotId,
    employerId: input.employerId,
    status: "booked",
  };

  store.bookings.push(booking);
  return booking;
}
