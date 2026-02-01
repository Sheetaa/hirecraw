# MVP-技术方案设计-v0.1

## 目标

以最小闭环验证 Agent 可预约、可付费、可交付的服务模式。

## 范围

### 必须包含
- Agent 列表与详情接口
- 时间段可预约模型
- 预订与任务提交
- 任务执行模拟
- 结果展示与评价
- 支付模拟

### 明确不做
- Agent <-> Agent 雇佣
- 并发执行
- 套餐/订阅
- 智能推荐
- 真实支付与退款
- 强安全与隐私保证

## 页面与路由

- `/agents` Agent 列表
- `/agents/:id` Agent 详情 + 预订弹窗
- `/tasks/:id` 任务提交 + 状态/结果
- `/tasks/:id/review` 评价

## 项目结构与技术栈

### 技术栈

- Monorepo
- 前端：React + Next.js
- 后端：MVP 阶段可先用 Next.js API Routes 或独立 API 服务

### 目录结构建议

```
repo/
  apps/
    web/                # Next.js 应用（前端 + 轻量 API）
  packages/
    shared/             # 共享类型、校验与常量
  plans/                # 规划文档
```

## 核心数据模型

### Agent
- id
- name
- description
- skills
- demo
- pricing
- owner_id
- status
- rating_avg
- rating_count

### Slot
- id
- agent_id
- start_at
- end_at
- status: available / booked / running / done

### Booking
- id
- agent_id
- employer_id
- slot_id
- status: booked / completed

### Task
- id
- agent_id
- booking_id
- input_payload
- status: pending / running / done / failed
- output

### Evaluation
- id
- agent_id
- booking_id
- rating
- comment

## 接口契约

### GET `/agents`

**响应示例**
```json
{
  "items": [
    {
      "id": "agent_1",
      "name": "InsightCrawler",
      "skills": "market research, summaries",
      "pricing": 49,
      "rating_avg": 4.6,
      "rating_count": 12,
      "status": "available"
    }
  ]
}
```

### GET `/agents/:id`

**响应示例**
```json
{
  "id": "agent_1",
  "name": "InsightCrawler",
  "description": "Deep market research agent",
  "skills": "market research, summaries",
  "demo": "Sample output...",
  "pricing": 49,
  "owner_id": "owner_1",
  "status": "available",
  "rating_avg": 4.6,
  "rating_count": 12,
  "slots": [
    {
      "id": "slot_1",
      "start_at": "2026-02-02T09:00:00Z",
      "end_at": "2026-02-02T10:00:00Z",
      "status": "available"
    }
  ]
}
```

### POST `/bookings`

**请求**
```json
{
  "agent_id": "agent_1",
  "slot_id": "slot_1",
  "paid": true
}
```

**响应**
```json
{
  "id": "booking_1",
  "agent_id": "agent_1",
  "slot_id": "slot_1",
  "status": "booked"
}
```

### POST `/tasks`

**请求**
```json
{
  "booking_id": "booking_1",
  "agent_id": "agent_1",
  "input_payload": "Please analyze X..."
}
```

**响应**
```json
{
  "id": "task_1",
  "status": "pending"
}
```

### GET `/tasks/:id`

**响应**
```json
{
  "id": "task_1",
  "status": "done",
  "output": "Mock result..."
}
```

### POST `/evaluations`

**请求**
```json
{
  "agent_id": "agent_1",
  "booking_id": "booking_1",
  "rating": 5,
  "comment": "Great result."
}
```

**响应**
```json
{
  "id": "evaluation_1"
}
```

## 错误码

- 400: 参数不合法（paid != true）
- 404: 资源不存在（agent/slot/booking/task）
- 409: 冲突（slot 已被预订/重复评价）
- 422: 业务条件不满足（slot 不属于 agent/任务未完成不可评价）

## 状态流转

- Slot: available -> booked -> done
- Booking: booked -> completed
- Task: pending -> running -> done
- Evaluation: created

## 校验规则

- Slot 时间不重叠，end_at > start_at
- booking 前 slot 必须 available
- paid 必须为 true
- task 绑定 booking 与 agent
- 评价必须在任务 done 后

## 执行与支付模拟

- Task 提交后触发延时执行，写入 output 并标记 done
- 支付仅通过字段 `paid: true` 模拟

## 前端处理建议

- 表单提交后按钮 loading + disabled
- 5xx 提示服务暂时不可用并保留输入
- 网络超时提示并提供重试
