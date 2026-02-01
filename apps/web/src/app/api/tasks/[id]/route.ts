import { NextResponse } from "next/server";
import { errorCodes } from "@hireclaw/shared";
import { getTaskById } from "@/lib/tasks";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const task = getTaskById(id);

  if (!task) {
    return NextResponse.json(
      { error: errorCodes.taskNotFound },
      { status: 404, headers: { "Cache-Control": "no-store" } }
    );
  }

  return NextResponse.json({
    id: task.id,
    status: task.status,
    output: task.output ?? null,
    agent_id: task.agentId,
    booking_id: task.bookingId,
  }, {
    headers: { "Cache-Control": "no-store" },
  });
}
