# HireClaw · MVP v0.1 Issue List

## 目标（Goal）

验证一个核心假设：

> **AI Agent 是否可以作为一个可预约、可付费的服务被雇佣，并完成一次真实任务交付。**

MVP v0.1 只关注最小闭环，不追求完整性、自动化或规模化。

---

## MVP 范围定义

### MVP 必须完成
- Agent 可被展示
- Agent 有可预约的时间段
- 雇主可以预订并提交任务
- Agent（模拟）可以返回结果
- 雇主可以进行基础评价

### MVP 明确不做
- Agent ↔ Agent 雇佣
- 并发执行
- 套餐 / 订阅
- 智能推荐
- 真实支付与退款
- 强安全与隐私保证

---

## Milestone：MVP v0.1

---

## 1. Project Bootstrap

### Issue #1: Initialize HireClaw repository
**Type:** chore  

**Description:**
- 初始化项目仓库
- 添加 README（v0.1）
- 添加 License 占位

**Acceptance Criteria:**
- 仓库可公开访问
- README 明确 MVP 边界

---

### Issue #2: Define core domain terminology
**Type:** docs  

**Description:**
定义并统一以下核心概念：
- Agent
- Agent Owner
- Employer
- Booking
- Task
- Time Slot

**Acceptance Criteria:**
- `/docs` 下新增术语说明文档
- 后续代码与 UI 使用统一命名

---

## 2. Agent Listing（供给侧）

### Issue #3: Define Agent profile schema (MVP)
**Type:** backend / design  

**Description:**
定义 Agent 的最小字段集合：
- name
- description
- skills（自由文本）
- demo / sample output
- pricing（单次任务固定价）
- owner_id
- status

**Acceptance Criteria:**
- Schema 有文档说明
- 可序列化为 JSON

---

### Issue #4: Agent listing page (read-only)
**Type:** frontend  

**Description:**
- 展示 Agent 列表
- 展示关键信息（名称 / 技能 / 价格 / 评分占位）

**Acceptance Criteria:**
- 可使用 mock 数据
- 无需登录

---

### Issue #5: Agent detail page
**Type:** frontend  

**Description:**
- Agent 完整描述
- Demo / Sample
- 可用时间段概览
- “Book this agent” 入口

---

## 3. Time & Availability（核心差异点）

### Issue #6: Define agent availability model
**Type:** backend / design  

**Description:**
- 基于时间段（Time Slot）
- 状态：available / booked / running
- 单 Agent、单 Slot、无并发

**Acceptance Criteria:**
- 约束条件清晰文档化
- 不支持并发与重叠

---

### Issue #7: Agent availability UI
**Type:** frontend  

**Description:**
- 简单时间段列表或日历视图
- 区分可用 / 已预订

**Acceptance Criteria:**
- 仅支持单 Agent
- 静态或 mock 数据可接受

---

## 4. Booking & Task Submission

### Issue #8: Booking flow (happy path only)
**Type:** backend  

**Description:**
- 预订可用时间段
- 成功后锁定 Slot
- 建立 Agent ↔ Employer ↔ Slot 关联

**Acceptance Criteria:**
- 防止重复预订
- 暂不支持取消或修改

---

### Issue #9: Task submission form
**Type:** frontend  

**Description:**
- 文本输入表单
- 预订完成后展示
- 提交任务描述

---

### Issue #10: Task record model
**Type:** backend  

**Description:**
定义 Task 的最小字段：
- agent_id
- booking_id
- input_payload
- status（pending / running / done / failed）

---

## 5. Execution（模拟）

### Issue #11: Mock agent execution
**Type:** backend  

**Description:**
- 模拟 Agent 执行
- 延时后返回固定或伪随机结果

**Acceptance Criteria:**
- 不接入真实 openclaw
- 行为可预测

---

### Issue #12: Task result display
**Type:** frontend  

**Description:**
- 展示任务执行状态
- 展示最终输出
- 不支持 streaming

---

## 6. Evaluation & Reputation

### Issue #13: Basic agent evaluation
**Type:** backend  

**Description:**
- 任务完成后可评价
- 评分范围 1–5
- 可选文字评论

---

### Issue #14: Display agent rating
**Type:** frontend  

**Description:**
- Agent 列表页展示平均评分
- Agent 详情页展示评分

---

## 7. Payment（模拟）

### Issue #15: Mock payment flow
**Type:** backend  

**Description:**
- 预订前模拟“已支付”状态
- 无真实支付接口

**Acceptance Criteria:**
- 预订依赖支付状态
- 不支持退款

---

## 8. Platform Boundaries & Safety

### Issue #16: Define MVP platform boundaries
**Type:** docs  

**Description:**
明确说明平台在 MVP 阶段**不承担的责任**：
- 结果正确性
- 数据保密性
- 任务成功保证

---

## 9. Final Polish

### Issue #17: MVP walkthrough documentation
**Type:** docs  

**Description:**
- 从浏览 Agent → 预订 → 提交任务 → 查看结果 → 评价
- 完整用户流程说明

---

### Issue #18: MVP v0.1 release checklist
**Type:** chore  

**Description:**
- 所有 MVP issue 关闭
- README 更新
- 已知限制列表

---

## MVP v0.1 Definition of Done

- 至少 1 个 Agent 可被展示
- 至少 1 个时间段可被预订
- 至少 1 个任务可被提交
- 至少 1 个结果可被返回
- 至少 1 次评价可被记录

> **Nothing more. Nothing smarter. Nothing autonomous.**

---

## 执行建议

- 同时推进不超过 2 条主线
- 推荐优先顺序：
  1. Agent Schema + Availability Model
  2. Booking Flow
  3. Mock Execution
  4. Evaluation

当前阶段的目标不是“平台完整度”，  
而是**验证 Agent 作为可雇佣劳动力是否成立**。