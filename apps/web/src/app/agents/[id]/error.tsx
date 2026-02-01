"use client";

export default function AgentDetailError() {
  return (
    <main className="page">
      <div className="container">
        <section className="hero">
          <span className="pill pill-muted">加载失败</span>
          <h1 className="hero-title">无法获取 Agent 详情</h1>
          <p className="hero-subtitle">请稍后重试。</p>
        </section>
      </div>
    </main>
  );
}
