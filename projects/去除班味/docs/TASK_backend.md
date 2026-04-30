# 后端开发任务 - 去除班味 v1.2

## 当前状态
PRD v1.2已确认，架构设计确定，立即启动数据库设计和API开发。

## 技术栈
- 语言：Node.js + TypeScript
- 框架：NestJS
- 数据库：PostgreSQL（主库）+ Redis（缓存/队列）
- 消息队列：Redis Stream
- OSS：阿里云OSS + CDN
- AI代理：自研AI Proxy Service

## 开发任务清单

### P0 - 基础设施（截止2026-05-02）
- [ ] 项目初始化（NestJS + TypeScript + ESLint + Prettier）
- [ ] 数据库连接配置（PostgreSQL + TypeORM）
- [ ] Redis连接配置（缓存 + 分布式锁）
- [ ] 微信登录集成（openid/unionid获取）
- [ ] JWT Token管理（accessToken + refreshToken）
- [ ] 全局异常拦截器（统一错误响应格式）
- [ ] 日志系统（Winston + ELK）
- [ ] 接口限流（RateLimiterRedis）

### P1 - 数据库设计（截止2026-05-05）
- [ ] 用户表DDL + 索引
- [ ] 检测记录表DDL + 索引
- [ ] 方案记录表DDL + 索引
- [ ] 帖子表DDL + 索引
- [ ] 评论表DDL + 索引
- [ ] 通知表DDL + 索引
- [ ] 成就表DDL（从users.achievements拆分）
- [ ] 帖子标签关联表DDL（从posts.topic_tags拆分）
- [ ] 数据库迁移脚本

### P1 - API开发（截止2026-05-12）
- [ ] Auth模块（登录/登出/Token刷新）
- [ ] User模块（用户信息/统计/等级/成就）
- [ ] Detect模块（上传凭证/创建任务/查询状态/报告/历史/海报）
- [ ] Plan模块（推荐/选择/打卡/补卡/复测）
- [ ] Post模块（发布/列表/详情/审核/搜索/举报）
- [ ] Comment模块（评论/楼中楼/删除）
- [ ] Interaction模块（点赞/收藏/分享记录）
- [ ] Notification模块（列表/已读/未读数）
- [ ] Invite模块（邀请码/统计/列表）

### P2 - AI集成（截止2026-05-15）
- [ ] AI Proxy Service搭建
- [ ] 图像识别接口封装（阿里云CV API）
- [ ] 浓度评分规则引擎
- [ ] 辣评模板库（命中率≥80%）
- [ ] 辣评LLM接口（GPT-4o/Claude）
- [ ] 方案推荐引擎
- [ ] AI结果缓存层（perceptual hash索引）
- [ ] 降级策略（规则引擎兜底）

### P2 - 运维功能（截止2026-05-20）
- [ ] 内容审核队列（Redis Stream）
- [ ] 人工复审接口
- [ ] OSS生命周期策略（30天转缩略图/90天删除）
- [ ] 数据备份脚本
- [ ] 监控告警（Prometheus + Grafana）

## 交付物路径
- 源代码：`/projects/去除班味/src/backend/`
- API文档：`/projects/去除班味/docs/API.md`
- 数据库设计：`/projects/去除班味/docs/DB_DESIGN.md`
