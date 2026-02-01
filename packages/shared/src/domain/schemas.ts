import { z } from "zod";

const id = z.string().min(1);
const isoDate = z.string().datetime({ offset: true });

export const agentSchema = z.object({
  id,
  name: z.string().min(1).max(40),
  description: z.string().min(1).max(500),
  skills: z.string().max(80).optional(),
  demo: z.string().max(800).optional(),
  pricing: z.number().positive(),
  ownerId: id,
  status: z.enum(["active", "offline"]),
  ratingAvg: z.number().min(1).max(5).optional(),
  ratingCount: z.number().int().min(0).optional(),
});

export const slotSchema = z
  .object({
    id,
    agentId: id,
    startAt: isoDate,
    endAt: isoDate,
    status: z.enum(["available", "booked", "running", "done"]),
  })
  .superRefine((value, ctx) => {
    if (new Date(value.endAt) <= new Date(value.startAt)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endAt must be after startAt",
      });
    }
  });

export const bookingSchema = z.object({
  id,
  agentId: id,
  employerId: id,
  slotId: id,
  status: z.enum(["booked", "completed"]),
});

export const taskSchema = z.object({
  id,
  agentId: id,
  bookingId: id,
  inputPayload: z.string().min(1).max(2000),
  status: z.enum(["pending", "running", "done", "failed"]),
  output: z.string().optional(),
});

export const evaluationSchema = z.object({
  id,
  agentId: id,
  bookingId: id,
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(300).optional(),
});

export const bookingCreateSchema = z.object({
  agentId: id,
  slotId: id,
  paid: z.literal(true),
});

export const taskCreateSchema = z.object({
  bookingId: id,
  agentId: id,
  inputPayload: z.string().min(1).max(2000),
});

export const evaluationCreateSchema = z.object({
  agentId: id,
  bookingId: id,
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(300).optional(),
});
