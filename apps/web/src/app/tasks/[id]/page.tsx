"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

type TaskResponse = {
  id: string;
  status: string;
  output?: string | null;
  agent_id?: string | null;
  booking_id?: string | null;
};

export default function TaskPage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const router = useRouter();

  const rawId = params.id;
  const [taskId, setTaskId] = useState<string | null>(
    rawId.startsWith("task_") ? rawId : null
  );
  const [status, setStatus] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [taskAgentId, setTaskAgentId] = useState<string | null>(
    searchParams.get("agentId")
  );
  const [inputPayload, setInputPayload] = useState("");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [statusError, setStatusError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const bookingId = rawId.startsWith("booking_") ? rawId : null;
  const agentId = searchParams.get("agentId");

  const loadTask = async (id: string) => {
    try {
      const response = await fetch(`/api/tasks/${id}`);
      if (!response.ok) {
        setStatusError("任务不存在或已失效");
        return;
      }
      const data = (await response.json()) as TaskResponse;
      setStatusError(null);
      setStatus(data.status);
      setOutput(data.output ?? null);
      if (data.agent_id) {
        setTaskAgentId(data.agent_id);
      }
    } catch {
      setStatusError("网络异常，请稍后重试");
    }
  };

  useEffect(() => {
    if (!taskId) {
      return;
    }

    let cancelled = false;

    const tick = async () => {
      if (cancelled) {
        return;
      }
      await loadTask(taskId);
    };

    tick();

    const interval = setInterval(() => {
      if (status === "done" || status === "failed" || statusError) {
        return;
      }
      void tick();
    }, 1500);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [taskId, status]);

  const statusInfo = (() => {
    switch (status) {
      case "done":
        return { label: "执行完成", pillClass: "pill pill-success" };
      case "running":
        return { label: "执行中", pillClass: "pill pill-warning" };
      case "failed":
        return { label: "执行失败", pillClass: "pill pill-danger" };
      case "pending":
      default:
        return { label: "已排队", pillClass: "pill pill-warning" };
    }
  })();

  const handleSubmit = async () => {
    if (isSubmitting) {
      return;
    }

    if (!bookingId) {
      setSubmitError("预订不存在或已失效");
      return;
    }
    if (!agentId) {
      setSubmitError("缺少 Agent 信息，无法提交任务");
      return;
    }
    if (!inputPayload.trim()) {
      setSubmitError("任务描述不能为空");
      return;
    }

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bookingId,
          agentId,
          inputPayload: inputPayload.trim(),
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        if (payload?.error === "task_already_submitted" && payload?.existingTaskId) {
          setTaskId(payload.existingTaskId);
          router.replace(`/tasks/${payload.existingTaskId}`);
          return;
        }
        setSubmitError(
          payload?.error === "task_already_submitted"
            ? "任务已提交，请勿重复"
            : payload?.error === "invalid_payload"
            ? "提交数据无效，请检查后重试"
            : "提交失败，请稍后重试"
        );
        return;
      }

      setTaskId(payload.id);
      router.replace(`/tasks/${payload.id}`);
    } catch {
      setSubmitError("网络异常，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="pill">任务提交</span>
          <h1 className="hero-title">提交任务需求</h1>
          <p className="hero-subtitle">
            请描述你的任务目标与交付要求。提交后将进入执行状态。
          </p>
        </section>

        <section className="grid">
          {bookingId && (
            <div className="card">
              <div className="card-title">任务描述</div>
              <textarea
                className="textarea"
                rows={6}
                placeholder="请描述你希望 Agent 完成的任务..."
                value={inputPayload}
                onChange={(event) => setInputPayload(event.target.value)}
              />
              {submitError && <p className="error-text">{submitError}</p>}
              <div className="modal-actions">
                <button className="cta" onClick={handleSubmit} disabled={isSubmitting}>
                  {isSubmitting ? "提交中..." : "提交任务"}
                </button>
              </div>
            </div>
          )}

          <div className="card">
            <div className="card-title">任务状态</div>
            {taskId ? (
              <div className="status-stack">
                <div className="status-line">
                  <span className={statusInfo.pillClass}>{status ?? "pending"}</span>
                  <span className="muted">{statusInfo.label}</span>
                </div>
                {statusError ? (
                  <p className="error-text">{statusError}</p>
                ) : status ? (
                  <div className="result-box">
                    <div className="result-title">任务输出</div>
                    <div className="result-content">
                      {output ?? "暂无输出，任务仍在处理中。"}
                    </div>
                    {status === "done" && taskAgentId && (
                      <button
                        className="cta"
                        onClick={() => router.push(`/tasks/${taskId}/review`)}
                      >
                        去评价
                      </button>
                    )}
                  </div>
                ) : (
                  <p className="muted">正在获取任务状态...</p>
                )}
              </div>
            ) : (
              <p className="muted">提交后将在此展示执行状态与结果。</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
