import Link from "next/link";
import { notFound } from "next/navigation";
import { getAgentById, getSlotsByAgentId } from "@/lib/agents";
import { getEvaluationsByAgentId } from "@/lib/evaluations";
import BookingPanel from "./BookingPanel";

export const dynamic = "force-dynamic";

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agent = getAgentById(id);

  if (!agent) {
    notFound();
  }

  const agentSlots = getSlotsByAgentId(agent.id);
  const evaluations = getEvaluationsByAgentId(agent.id);

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="pill">Agent 详情</span>
          <h1 className="hero-title">{agent.name}</h1>
          <p className="hero-subtitle">{agent.description}</p>
          <div className="tag">
            <span className="price">¥{agent.pricing}</span>
            <span className="muted">
              {agent.ratingAvg ? `${agent.ratingAvg.toFixed(1)} / 5` : "暂无评价"}
              {agent.ratingCount ? ` · ${agent.ratingCount} 次` : ""}
            </span>
          </div>
        </section>

        <section className="grid">
          <div className="card">
            <div className="card-title">技能与边界</div>
            <p className="muted">{agent.skills}</p>
            <div className="card-title">Demo / Sample</div>
            <p className="muted">{agent.demo}</p>
          </div>

          <BookingPanel agentId={agent.id} slots={agentSlots} />
        </section>

        <section className="grid" style={{ marginTop: "24px" }}>
          <div className="card">
            <div className="card-title">最新评价</div>
            {evaluations.length === 0 ? (
              <p className="muted">暂无评价</p>
            ) : (
              evaluations.slice(0, 5).map((evaluation) => (
                <div className="slot-row" key={evaluation.id}>
                  <div className="slot-meta">
                    <strong>{evaluation.rating} / 5</strong>
                    <span className="muted">
                      {evaluation.comment || "无文字反馈"}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        <section className="hero" style={{ marginTop: "32px" }}>
          <Link className="cta cta-outline" href="/agents">
            返回列表
          </Link>
        </section>
      </div>
    </main>
  );
}
