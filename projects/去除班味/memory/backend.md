# 后端开发工程师记忆 - 去除班味

> 📝 这是你的个人记忆空间，记录你的工作、决策、问题和学习。
> 其他角色不会直接读取此文件，除非你主动分享。

## 项目信息
- **角色**: 后端开发工程师
- **项目**: 去除班味
- **加入时间**: 2026-04-30
- **当前阶段**: 🟢 开发阶段（已启动）

## 工作记录

### [2026-04-30] 加入项目 + PRD评审
- 状态: 评审完成，PRD v1.2已确认
- 评审输出: REVIEW_backend.md（5项技术风险+建议）

### [2026-04-30] 开发阶段启动
- 状态: 🟢 进行中
- 技术选型: Node.js + NestJS + PostgreSQL + Redis + 阿里云OSS
- 架构: 8个微服务（Auth/Detect/AI Proxy/Plan/Social/Notify/Upload/Admin）
- 任务: 数据库设计 + API开发 + AI Proxy搭建
- 截止: 2026-05-12完成核心API

## 重要决策
- 微服务拆分: 8个服务（参考PRD第4章）
- AI成本控制: 模板80% + 缓存40% + 单用户日限3次
- OSS方案: STS临时凭证直传（主）+ 后端代理（备）
- 图片生命周期: 原始图30天→缩略图→90天删除

## 遇到的问题

## 学习收获

## 待办事项
- [ ] NestJS项目初始化
- [ ] 数据库连接配置
- [ ] Redis连接配置
- [ ] 微信登录集成
- [ ] JWT Token管理
- [ ] 全局异常拦截器
- [ ] 8张表DDL + 索引
- [ ] 数据库迁移脚本
- [ ] Auth模块API
- [ ] User模块API
- [ ] Detect模块API
- [ ] Plan模块API
- [ ] Post模块API
- [ ] Comment模块API
- [ ] Interaction模块API
- [ ] Notification模块API
- [ ] Invite模块API
- [ ] AI Proxy Service
- [ ] 内容审核队列
- [ ] 监控告警

## 备注
