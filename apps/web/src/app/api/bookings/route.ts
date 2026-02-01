import { NextResponse } from "next/server";
import { bookingCreateSchema, errorCodes } from "@hireclaw/shared";
import { getAgentById } from "@/lib/agents";
import { createBooking, findSlotById, lockSlot } from "@/lib/bookings";
import { validatePaid } from "@/lib/payment";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bookingCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: errorCodes.invalidPayload }, { status: 400 });
  }

  if (!validatePaid(parsed.data.paid)) {
    return NextResponse.json({ error: errorCodes.paidNotTrue }, { status: 400 });
  }

  const agent = getAgentById(parsed.data.agentId);
  const slot = findSlotById(parsed.data.slotId);

  if (!agent || !slot || slot.agentId !== agent.id) {
    return NextResponse.json({ error: errorCodes.slotNotAvailable }, { status: 422 });
  }

  if (slot.status !== "available") {
    return NextResponse.json({ error: errorCodes.slotAlreadyBooked }, { status: 409 });
  }

  lockSlot(slot.id);

  const booking = createBooking({
    agentId: agent.id,
    slotId: slot.id,
    employerId: "employer_1",
  });

  return NextResponse.json({
    id: booking.id,
    agent_id: booking.agentId,
    slot_id: booking.slotId,
    status: booking.status,
  });
}
