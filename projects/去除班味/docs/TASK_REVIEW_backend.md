# PRD v1.1 评审任务 - 后端开发工程师

## 任务
读取 `/Users/zhangyaoyao/.openclaw/workspace/projects/去除班味/docs/PRD.md`，对PRD v1.1进行后端实现维度评审。

## 评审重点
1. **第11章 数据模型设计**：
   - 5张核心表结构是否合理？
   - JSON字段的使用是否恰当？
   - 索引设计是否满足查询需求？
2. **第14章 接口设计**：
   - RESTful规范是否统一？
   - 24个接口的权限控制设计
   - 分页、缓存策略
3. **AI服务集成**：
   - 图像识别/评分/辣评生成/方案生成 4个AI接口的调用流程
   - 降级策略和熔断机制
   - 成本控制和模板兜底
4. **第12章 状态机**：
   - 检测任务状态机的持久化方案
   - 帖子审核状态机的队列设计
5. **分享裂变追踪**：inviteCode链路的数据一致性

## 输出要求
请输出评审报告到 `/Users/zhangyaoyao/.openclaw/workspace/projects/去除班味/docs/REVIEW_backend.md`，包含：
1. 技术风险点（3-5个）
2. 数据库优化建议（索引、分表、归档策略）
3. 架构建议（微服务拆分、缓存策略、消息队列）
4. AI服务集成方案
5. 安全与性能建议
6. 对PRD的明确反馈（通过/有条件通过/需修改）

## 参考信息
- 技术路线：Node.js微服务 + PostgreSQL + Redis + OSS
- AI服务：阿里云/腾讯云CV API + GPT-4o/Claude API
- 并发预期：初期DAU 5万，峰值QPS预估
