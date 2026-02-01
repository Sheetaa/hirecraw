import { NextResponse } from "next/server";
import { errorCodes, taskCreateSchema } from "@hireclaw/shared";
import { getBookingById } from "@/lib/bookings";
import { createTask, getTaskByBookingId } from "@/lib/tasks";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = taskCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: errorCodes.invalidPayload }, { status: 400 });
  }

  const booking = getBookingById(parsed.data.bookingId);
  if (!booking) {
    return NextResponse.json({ error: errorCodes.bookingNotFound }, { status: 404 });
  }

  if (booking.agentId !== parsed.data.agentId) {
    return NextResponse.json({ error: errorCodes.slotNotAvailable }, { status: 422 });
  }

  const existingTask = getTaskByBookingId(parsed.data.bookingId);
  if (existingTask) {
    return NextResponse.json(
      { error: errorCodes.taskAlreadySubmitted, existingTaskId: existingTask.id },
      { status: 409 }
    );
  }

  const task = createTask({
    agentId: parsed.data.agentId,
    bookingId: parsed.data.bookingId,
    inputPayload: parsed.data.inputPayload,
  });

  return NextResponse.json({ id: task.id, status: task.status });
}
