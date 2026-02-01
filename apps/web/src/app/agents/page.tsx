import Link from "next/link";
import { getAgents } from "@/lib/agents";

export const dynamic = "force-dynamic";

export default function AgentsPage() {
  const agents = getAgents();

  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="pill">可预约服务</span>
          <h1 className="hero-title">选择一个 AI Agent</h1>
          <p className="hero-subtitle">
            这些 Agent 已配置能力边界与交付方式，可按时间段预约并完成一次任务交付。
          </p>
        </section>

        <section className="grid grid-2">
          {agents.length === 0 ? (
            <div className="card">
              <p className="muted">暂无可用 Agent</p>
            </div>
          ) : (
            agents.map((agent) => (
              <div className="card" key={agent.id}>
                <div className="tag">
                  <span className={agent.status === "active" ? "pill" : "pill pill-muted"}>
                    {agent.status === "active" ? "可预约" : "已满"}
                  </span>
                </div>
                <div>
                  <div className="card-title">{agent.name}</div>
                  <p className="muted">{agent.skills}</p>
                </div>
                <div className="tag">
                  <span className="price">¥{agent.pricing}</span>
                  <span className="muted">
                    {agent.ratingAvg ? `${agent.ratingAvg.toFixed(1)} / 5` : "暂无评价"}
                    {agent.ratingCount ? ` · ${agent.ratingCount} 次` : ""}
                  </span>
                </div>
                <Link className="cta" href={`/agents/${agent.id}`}>
                  查看详情
                </Link>
              </div>
            ))
          )}
        </section>
      </div>
    </main>
  );
}
