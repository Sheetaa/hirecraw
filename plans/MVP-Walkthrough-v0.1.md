# MVP Walkthrough: Agent Booking -> Task -> Review

## Purpose
This document explains the MVP user flow from browsing agents to leaving a review, based on the current UI and API behavior. It is written for product, engineering, and QA to align on what the experience does today.

## Scope
Covers the following flow only:
Agent list -> Agent detail -> Booking modal -> Task submission -> Status/result -> Review

Out of scope:
Authentication, payment processing, persistence, and production-grade task execution.

---

## Flow Summary (High Level)
1. User opens `/agents` and sees the list of agents.
2. User opens an agent detail page `/agents/{agentId}`.
3. User selects an available time slot and confirms in the booking modal.
4. Booking creates a new booking and redirects to `/tasks/{bookingId}?agentId={agentId}`.
5. User submits a task description to create a task.
6. The task status is polled until output is ready.
7. After completion, user submits a rating and optional comment.

---

## Page-by-Page Walkthrough

### 1) Agents List (`/agents`)
**Goal:** Discover available agents and navigate to a detail view.

**What the user sees**
- A list of agent cards with:
  - name
  - skills summary
  - pricing
  - rating summary
  - availability indicator

**Key behavior**
- If there are no agents, show an empty state.

---

### 2) Agent Detail (`/agents/{agentId}`)
**Goal:** Inspect agent capabilities and choose a time slot.

**What the user sees**
- Agent profile (name, description, skills, demo, price, ratings)
- Available time slots
- Latest reviews

**Key behavior**
- If the agent does not exist, return 404.
- Slots are displayed with `available` or `booked` status.
- A booking modal can be opened from any slot or from the CTA.

---

### 3) Booking Modal (on Agent Detail)
**Goal:** Confirm a time slot and simulate payment.

**What the user does**
- Selects an available slot from a dropdown
- Confirms booking

**Key behavior**
- `paid` must be `true` (simulated payment).
- If the slot is already booked, the user is prompted to pick another slot.
- On success, the user is redirected to `/tasks/{bookingId}?agentId={agentId}`.

---

### 4) Task Submission (`/tasks/{bookingId}?agentId=...`)
**Goal:** Provide task instructions tied to the booking.

**What the user does**
- Enters a task description
- Submits the task

**Key behavior**
- Empty task description is rejected.
- If a task already exists for this booking, the user is notified.
- On success, the route changes to `/tasks/{taskId}`.

---

### 5) Task Status & Result (`/tasks/{taskId}`)
**Goal:** Monitor status and view output.

**What the user sees**
- Status pill (`pending`, `running`, `done`, `failed`)
- Task output when ready

**Key behavior**
- The UI polls `/api/tasks/{taskId}` every 1.5s.
- Task execution is mocked and completes after a short delay.
- When status is `done`, a “Review” button appears.

---

### 6) Review (`/tasks/{taskId}/review`)
**Goal:** Submit a rating and optional feedback.

**What the user does**
- Selects a rating (1-5)
- Writes an optional comment
- Submits

**Key behavior**
- Only `done` tasks can be reviewed.
- A booking can only be reviewed once.
- On success, user is redirected back to the agent detail page.

---

## API Contracts (Current Behavior)

### GET `/api/agents`
**Response**
```json
{
  "items": [
    {
      "id": "agent_1",
      "name": "Agent A",
      "skills": "Research, writing",
      "pricing": 199,
      "status": "active",
      "rating_avg": 4.8,
      "rating_count": 12
    }
  ]
}
```

---

### GET `/api/agents/{agentId}`
**Response**
```json
{
  "agent": {
    "id": "agent_1",
    "name": "Agent A",
    "description": "Longer description...",
    "skills": "Research, writing",
    "demo": "Example output...",
    "pricing": 199,
    "owner_id": "owner_1",
    "status": "active",
    "rating_avg": 4.8,
    "rating_count": 12
  },
  "slots": [
    {
      "id": "slot_1",
      "start_at": "2026-02-02T08:00:00+08:00",
      "end_at": "2026-02-02T09:00:00+08:00",
      "status": "available"
    }
  ]
}
```

---

### POST `/api/bookings`
**Request**
```json
{
  "agentId": "agent_1",
  "slotId": "slot_1",
  "paid": true
}
```

**Response**
```json
{
  "id": "booking_1700000000000",
  "agent_id": "agent_1",
  "slot_id": "slot_1",
  "status": "booked"
}
```

---

### POST `/api/tasks`
**Request**
```json
{
  "bookingId": "booking_1700000000000",
  "agentId": "agent_1",
  "inputPayload": "Please summarize the attached notes..."
}
```

**Response**
```json
{
  "id": "task_1700000000000",
  "status": "pending"
}
```

---

### GET `/api/tasks/{taskId}`
**Response**
```json
{
  "id": "task_1700000000000",
  "status": "done",
  "output": "Mock result: Completed task for booking ...",
  "agent_id": "agent_1",
  "booking_id": "booking_1700000000000"
}
```

---

### POST `/api/evaluations`
**Request**
```json
{
  "agentId": "agent_1",
  "bookingId": "booking_1700000000000",
  "rating": 5,
  "comment": "Fast and clear output."
}
```

**Response**
```json
{
  "id": "evaluation_1700000000000"
}
```

---

## Status & Errors

### Task Status Values
- `pending` -> initial state
- `running` -> triggered after first status poll
- `done` -> completed with output
- `failed` -> supported but not currently produced by mock execution

### Common Error Codes
- `invalid_payload`
- `paid_not_true`
- `slot_not_available`
- `slot_already_booked`
- `booking_not_found`
- `task_already_submitted`
- `task_not_found`
- `task_not_done`
- `evaluation_exists`

---

## MVP Constraints & Notes
- Data is stored in-memory only; restarting the server resets data.
- Payment is simulated; `paid` must be `true`.
- Task execution is mocked and finishes automatically.
- Users can only submit one task per booking and one review per booking.

---

## End-to-End Example (Sequence)
1. User opens `/agents`.
2. User selects agent `agent_1`.
3. User books `slot_1` -> receives `booking_1700000000000`.
4. User submits task -> receives `task_1700000000000`.
5. UI polls task status until `done`.
6. User reviews the completed task and returns to agent detail.
