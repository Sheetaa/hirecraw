"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type TaskResponse = {
  id: string;
  status: string;
  output?: string | null;
  agent_id?: string | null;
  booking_id?: string | null;
};

export default function TaskReviewPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const taskId = params.id;

  const [rating, setRating] = useState("5");
  const [comment, setComment] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [task, setTask] = useState<TaskResponse | null>(null);

  useEffect(() => {
    const loadTask = async () => {
      try {
        const response = await fetch(`/api/tasks/${taskId}`);
        if (!response.ok) {
          setError("任务不存在或已失效");
          return;
        }
        const data = (await response.json()) as TaskResponse;
        setError(null);
        setTask(data);
      } catch {
        setError("网络异常，请稍后重试");
      }
    };

    void loadTask();
  }, [taskId]);

  const handleSubmit = async () => {
    if (!task?.booking_id || !task.agent_id) {
      setError("缺少任务信息，无法评价");
      return;
    }

    if (task.status !== "done") {
      setError("任务未完成，无法评价");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/evaluations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: task.agent_id,
          bookingId: task.booking_id,
          rating: Number(rating),
          comment: comment.trim() || undefined,
        }),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        setError(
          payload?.error === "evaluation_exists"
            ? "该任务已评价"
            : payload?.error === "task_not_done"
            ? "任务未完成，无法评价"
            : "提交失败，请稍后重试"
        );
        return;
      }

      router.push(`/agents/${task.agent_id}`);
    } catch {
      setError("网络异常，请稍后重试");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="pill">评价服务</span>
          <h1 className="hero-title">评价本次任务</h1>
          <p className="hero-subtitle">
            你的评价将影响 Agent 的后续信誉与排序。
          </p>
        </section>

        <section className="grid">
          <div className="card">
            <div className="card-title">评分</div>
            <select
              className="select"
              value={rating}
              onChange={(event) => setRating(event.target.value)}
            >
              <option value="5">5 - 非常满意</option>
              <option value="4">4 - 满意</option>
              <option value="3">3 - 一般</option>
              <option value="2">2 - 不满意</option>
              <option value="1">1 - 很差</option>
            </select>

            <div className="card-title">反馈</div>
            <textarea
              className="textarea"
              rows={5}
              placeholder="可选，写下你的反馈..."
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
            {error && <p className="error-text">{error}</p>}
            <div className="modal-actions">
              <button
                className="cta"
                onClick={handleSubmit}
                disabled={isSubmitting || !task || task.status !== "done"}
              >
                {isSubmitting ? "提交中..." : "提交评价"}
              </button>
            </div>
          </div>

          <div className="card">
            <div className="card-title">任务状态</div>
            {task ? (
              <p className="muted">
                当前状态：{task.status === "done" ? "执行完成" : "未完成"}
              </p>
            ) : (
              <p className="muted">正在加载任务信息...</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
