import type { Task } from "@hireclaw/shared";
import { store } from "./store";

const executionStore = new Map<
  string,
  {
    doneAt: number;
    output: string;
    timer: ReturnType<typeof setTimeout> | null;
  }
>();

const MIN_DELAY_MS = 1200;
const MAX_DELAY_MS = 2800;

function buildMockOutput(task: Task): string {
  return `Mock result: Completed task for booking ${task.bookingId}. Input summary: ${task.inputPayload}`;
}

function computeDelay(task: Task): number {
  const hash = Array.from(task.id).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const span = MAX_DELAY_MS - MIN_DELAY_MS;
  return MIN_DELAY_MS + (hash % (span + 1));
}

function completeTask(task: Task, output: string) {
  task.status = "done";
  task.output = output;
}

function reconcileExecution(task: Task) {
  if (task.status === "done") {
    executionStore.delete(task.id);
    return;
  }

  const existing = executionStore.get(task.id);
  if (existing && Date.now() >= existing.doneAt) {
    completeTask(task, existing.output);
    executionStore.delete(task.id);
  }
}

function scheduleExecution(task: Task, options: { promoteToRunning?: boolean } = {}) {
  if (task.status === "done") {
    return;
  }

  if (options.promoteToRunning !== false && task.status === "pending") {
    task.status = "running";
  }

  if (executionStore.has(task.id)) {
    reconcileExecution(task);
    return;
  }

  const delay = computeDelay(task);
  const output = buildMockOutput(task);
  const doneAt = Date.now() + delay;

  const timer = setTimeout(() => {
    completeTask(task, output);
    executionStore.delete(task.id);
  }, delay);

  executionStore.set(task.id, { doneAt, output, timer });
}

for (const task of store.tasks) {
  scheduleExecution(task);
}

export function getTaskById(taskId: string): Task | undefined {
  const task = store.tasks.find((item) => item.id === taskId);
  if (task) {
    scheduleExecution(task);
    reconcileExecution(task);
  }
  return task;
}

export function getTaskByBookingId(bookingId: string): Task | undefined {
  const task = store.tasks.find((item) => item.bookingId === bookingId);
  if (task) {
    scheduleExecution(task);
    reconcileExecution(task);
  }
  return task;
}

export function createTask(input: {
  agentId: string;
  bookingId: string;
  inputPayload: string;
}): Task {
  const task: Task = {
    id: `task_${Date.now()}`,
    agentId: input.agentId,
    bookingId: input.bookingId,
    inputPayload: input.inputPayload,
    status: "pending",
  };

  store.tasks.push(task);
  scheduleExecution(task, { promoteToRunning: false });
  return task;
}
