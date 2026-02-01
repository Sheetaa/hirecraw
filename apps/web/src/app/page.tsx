import Link from "next/link";

export default function Home() {
  return (
    <main className="page">
      <div className="container hero">
        <span className="pill">MVP Sandbox</span>
        <h1 className="hero-title">HireClaw: 预约 AI Agent 的最短路径</h1>
        <p className="hero-subtitle">
          这里是 MVP 试运行入口。你可以浏览 Agent、查看可预约时间段，并体验
          预订与任务提交的最小闭环。
        </p>
        <div>
          <Link className="cta" href="/agents">
            进入 Agent 列表
          </Link>
        </div>
      </div>
    </main>
  );
}
