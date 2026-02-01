import { NextResponse } from "next/server";
import { errorCodes, evaluationCreateSchema } from "@hireclaw/shared";
import { getBookingById } from "@/lib/bookings";
import { getEvaluationByBookingId, createEvaluation } from "@/lib/evaluations";
import { getTaskByBookingId } from "@/lib/tasks";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = evaluationCreateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: errorCodes.invalidPayload }, { status: 400 });
  }

  const booking = getBookingById(parsed.data.bookingId);
  if (!booking || booking.agentId !== parsed.data.agentId) {
    return NextResponse.json({ error: errorCodes.bookingNotFound }, { status: 404 });
  }

  const task = getTaskByBookingId(parsed.data.bookingId);
  if (!task || task.status !== "done") {
    return NextResponse.json({ error: errorCodes.taskNotDone }, { status: 422 });
  }

  const existing = getEvaluationByBookingId(parsed.data.bookingId);
  if (existing) {
    return NextResponse.json(
      { error: errorCodes.evaluationExists, existingEvaluationId: existing.id },
      { status: 409 }
    );
  }

  const evaluation = createEvaluation({
    agentId: parsed.data.agentId,
    bookingId: parsed.data.bookingId,
    rating: parsed.data.rating,
    comment: parsed.data.comment,
  });

  return NextResponse.json({ id: evaluation.id });
}
