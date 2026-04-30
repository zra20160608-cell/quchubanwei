# 去除班味 - 后端开发记录

## 已完成模块

### 1. 认证模块 (auth/)
- [x] 微信小程序登录 (`POST /api/auth/login`)
- [x] Token刷新 (`POST /api/auth/refresh`)
- [x] JWT认证守卫 (AuthGuard)

### 2. 检测模块 (detect/)
- [x] 获取OSS上传凭证
- [x] 创建检测任务
- [x] 查询检测状态
- [x] 获取检测报告
- [x] 获取检测历史（分页）
- [x] 生成分享海报
- [x] 历史对比
- [x] AI分析流程（图像识别 + 评分 + 辣评生成）
- [x] 使用 TypeORM 实体保存检测记录

### 3. 方案模块 (plan/)
- [x] 获取推荐方案（基于检测元素匹配）
- [x] 选择方案
- [x] 获取我的方案列表
- [x] 获取方案详情
- [x] 打卡
- [x] 获取打卡记录
- [x] 补卡
- [x] 放弃方案
- [x] 完成复测（前后对比）
- [x] 使用 TypeORM 实体

### 4. 社交模块 (social/)
- [x] 帖子CRUD（创建、查询列表、详情、更新、删除）
- [x] 点赞/取消点赞
- [x] 收藏/取消收藏
- [x] 评论（发表评论、删除评论、评论列表含回复）
- [x] 举报帖子
- [x] 搜索（帖子/话题）
- [x] 信息流推荐算法（热度排序 + 时间排序）
- [x] AI内容审核（PENDING -> AI_REVIEWING -> APPROVED/REJECTED/HUMAN_REVIEW）
- [x] 热度分计算算法（互动加权 + 时间衰减）

### 5. 话题模块 (social/)
- [x] 话题列表
- [x] 话题详情（含帖子列表）

### 6. 通知模块 (notification/)
- [x] 通知列表（分页，支持类型/已读筛选）
- [x] 标记单条已读
- [x] 全部已读
- [x] 未读数统计
- [x] 通知类型：LIKE, COMMENT, FOLLOW, SYSTEM, REMIND, ACHIEVEMENT, INVITE

### 7. 分享/裂变模块 (share/)
- [x] 分享记录创建
- [x] 邀请码生成与获取
- [x] 邀请统计
- [x] 我的邀请列表
- [x] 邀请关系建立（verifyAndBindInvite，在ShareService中暴露）

### 8. 用户模块 (user/)
- [x] 获取用户资料
- [x] 更新用户资料
- [x] 用户等级计算（Lv.1-Lv.10）
- [x] 经验值获取规则与addExp方法
- [x] 成就系统（10个成就定义 + 授予逻辑）
- [x] 用户统计（检测次数、发帖数、获赞数、邀请数等）

### 9. AI服务模块 (ai/)
- [x] 图像识别服务封装（visionAnalyze，含缓存）
- [x] 辣评生成服务封装（generateComments，含缓存）
- [x] 内容审核服务封装（moderateContent，敏感词 + 图片审核）
- [x] 结果缓存策略（5分钟TTL内存缓存）

## 数据实体

| 实体 | 文件 | 说明 |
|------|------|------|
| User | `src/entities/user.entity.ts` | 用户主表 |
| DetectionRecord | `src/entities/detection-record.entity.ts` | 检测记录 |
| UserPlan | `src/entities/user-plan.entity.ts` | 用户方案实例 |
| PlanTemplate | `src/entities/plan-template.entity.ts` | 方案模板 |
| CheckInRecord | `src/entities/check-in-record.entity.ts` | 打卡记录 |
| Post | `src/entities/post.entity.ts` | 帖子 |
| Comment | `src/entities/comment.entity.ts` | 评论 |
| Like | `src/entities/like.entity.ts` | 点赞 |
| Collection | `src/entities/collection.entity.ts` | 收藏 |
| Notification | `src/entities/notification.entity.ts` | 通知 |
| ShareRecord | `src/entities/share-record.entity.ts` | 分享记录 |
| InviteRelation | `src/entities/invite-relation.entity.ts` | 邀请关系 |
| UserAchievement | `src/entities/user-achievement.entity.ts` | 用户成就 |
| Report | `src/entities/report.entity.ts` | 举报 |
| Topic | `src/entities/topic.entity.ts` | 话题 |

## 技术栈

- **框架**: NestJS 10.x
- **ORM**: TypeORM 0.3.x
- **数据库**: PostgreSQL
- **认证**: JWT (@nestjs/jwt)
- **缓存**: 内存缓存（AI服务结果，5分钟TTL）

## 待优化项

- [ ] 接入Redis实现点赞/收藏状态持久化缓存
- [ ] 接入阿里云OSS STS真实凭证生成
- [ ] 接入微信auth.code2Session真实登录
- [ ] 接入阿里云CV API真实图像识别
- [ ] 接入真实LLM辣评生成
- [ ] 接入阿里云内容安全真实审核API
- [ ] 帖子信息流加入关注关系过滤
- [ ] 经验值每日上限实现（需要Redis计数）
- [ ] 通知推送（WebSocket / 小程序订阅消息）
- [ ] 图片上传OSS直传
- [ ] 分页性能优化（大表游标分页）
- [ ] 数据库索引优化

## API文档

详见 `docs/api/API.md`

---

*最后更新: 2026-04-30*
