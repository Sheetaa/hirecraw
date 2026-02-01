"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { Slot } from "@hireclaw/shared";

type BookingPanelProps = {
  agentId: string;
  slots: Slot[];
};

function formatSlotRange(startAt: string, endAt: string) {
  const formatter = new Intl.DateTimeFormat("zh-CN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${formatter.format(new Date(startAt))} - ${formatter.format(new Date(endAt))}`;
}

export default function BookingPanel({ agentId, slots }: BookingPanelProps) {
  const router = useRouter();
  const [selectedSlotId, setSelectedSlotId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedSlot = useMemo(
    () => slots.find((slot) => slot.id === selectedSlotId) ?? null,
    [slots, selectedSlotId]
  );

  const availableSlots = slots.filter((slot) => slot.status === "available");

  const openModal = (slotId?: string) => {
    if (slotId) {
      setSelectedSlotId(slotId);
    }
    setError(null);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setError(null);
  };

  const confirmBooking = async () => {
    if (isSubmitting) {
      return;
    }

    if (!selectedSlotId) {
      setError("请先选择一个可预约时段");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentId, slotId: selectedSlotId, paid: true }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          payload?.error === "slot_already_booked"
            ? "该时段已被预订，请选择其他时间"
            : payload?.error === "slot_not_available"
            ? "该时段不可预约，请选择其他时间"
            : payload?.error === "paid_not_true"
            ? "支付未完成，无法预订"
            : payload?.error === "invalid_payload"
            ? "提交数据无效，请重试"
            : "预订失败，请稍后重试";
        setError(message);
        return;
      }

      setIsOpen(false);
      setSelectedSlotId(null);
      router.push(`/tasks/${payload.id}?agentId=${agentId}`);
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card">
      <div className="card-title">可预约时间</div>
      {slots.length === 0 ? (
        <p className="muted">当前暂无可预约时段</p>
      ) : (
        slots.map((slot) => (
          <div className="slot-row" key={slot.id}>
            <div className="slot-meta">
              <div>{formatSlotRange(slot.startAt, slot.endAt)}</div>
              <span
                className={
                  slot.status === "available" ? "pill" : "pill pill-muted"
                }
              >
                {slot.status === "available" ? "可预约" : "已预订"}
              </span>
            </div>
            <button
              className={
                slot.status === "available" ? "cta" : "cta cta-outline"
              }
              disabled={slot.status !== "available"}
              onClick={() => openModal(slot.id)}
            >
              选择该时段
            </button>
          </div>
        ))
      )}

      {availableSlots.length > 0 && (
        <button className="cta cta-outline" onClick={() => openModal()}>
          预约可用时段
        </button>
      )}

      {isOpen && (
        <div className="modal-backdrop" role="dialog" aria-modal="true">
          <div className="modal">
            <div className="card-title">确认预订</div>
            <p className="muted">本阶段仅模拟支付</p>
            <div className="modal-body">
              <label className="tag">选择时段</label>
              <select
                className="select"
                value={selectedSlotId ?? ""}
                onChange={(event) => setSelectedSlotId(event.target.value)}
              >
                <option value="" disabled>
                  请选择一个时段
                </option>
                {availableSlots.map((slot) => (
                  <option key={slot.id} value={slot.id}>
                    {formatSlotRange(slot.startAt, slot.endAt)}
                  </option>
                ))}
              </select>
            </div>
            {selectedSlot && (
              <div className="modal-summary">
                <span className="tag">预订时段</span>
                <strong>{formatSlotRange(selectedSlot.startAt, selectedSlot.endAt)}</strong>
              </div>
            )}
            {error && <p className="error-text">{error}</p>}
            <div className="modal-actions">
              <button className="cta cta-outline" onClick={closeModal}>
                取消
              </button>
              <button className="cta" onClick={confirmBooking} disabled={isSubmitting}>
                {isSubmitting ? "处理中..." : "确认预订"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
