# 去除班味 - API 文档

> **版本**: v1.0  
> **基础路径**: `/api`  
> **响应格式**: 统一JSON

## 统一响应格式

```json
{
  "code": 0,
  "message": "success",
  "data": { ... },
  "requestId": "req_xxx"
}
```

## 错误码

| code | 含义 | 说明 |
|------|------|------|
| 0 | 成功 | 请求正常完成 |
| 400 | 参数错误 | 请求参数缺失或格式不正确 |
| 401 | 未授权 | Token无效或过期 |
| 403 | 禁止访问 | 无权限执行此操作 |
| 404 | 资源不存在 | 请求的数据不存在 |
| 429 | 请求过多 | 触发限流，请稍后重试 |
| 500 | 服务器错误 | 服务端内部错误 |

## 分页规范

所有列表接口统一分页参数：`?page=1&limit=20`

统一返回结构：
```json
{
  "code": 0,
  "data": {
    "list": [...],
    "total": 100,
    "hasMore": true,
    "page": 1,
    "limit": 20
  }
}
```

---

## 一、认证模块

### 1.1 微信小程序登录
- **URL**: `POST /api/auth/login`
- **参数**:
  ```json
  { "code": "微信登录码" }
  ```
- **响应**:
  ```json
  {
    "token": "jwt_token",
    "refreshToken": "refresh_token",
    "userInfo": { "id", "nickname", "avatarUrl", "level", "exp" }
  }
  ```

### 1.2 刷新Token
- **URL**: `POST /api/auth/refresh`
- **参数**:
  ```json
  { "refreshToken": "xxx" }
  ```

---

## 二、用户模块

### 2.1 获取用户信息
- **URL**: `GET /api/user/profile`
- **响应**: User对象

### 2.2 更新用户信息
- **URL**: `PUT /api/user/profile`
- **参数**: `{ nickname, avatarUrl, gender }`

### 2.3 用户等级
- **URL**: `GET /api/user/level`
- **响应**:
  ```json
  { "level": 4, "title": "班味斗士", "exp": 650, "nextExp": 1000, "nextTitle": "去味专家", "progress": 16.7 }
  ```

### 2.4 用户成就
- **URL**: `GET /api/user/achievements`
- **响应**:
  ```json
  {
    "list": [
      { "id": "A001", "name": "初次检测", "description": "...", "isEarned": true, "earnedAt": "...", "rewardExp": 20 }
    ],
    "total": 5
  }
  ```

### 2.5 用户统计
- **URL**: `GET /api/user/stats`
- **响应**:
  ```json
  {
    "detectionCount": 15,
    "avgScore": 65.5,
    "streakDays": 7,
    "levelProgress": { "current": 4, "next": 5, "currentExp": 650, "nextExp": 1000, "progress": 16.7 },
    "postCount": 8,
    "likeReceived": 128,
    "inviteCount": 3
  }
  ```

---

## 三、检测模块

### 3.1 获取OSS上传凭证
- **URL**: `GET /api/detect/upload-token?filename=xxx&size=xxx`

### 3.2 创建检测任务
- **URL**: `POST /api/detect`
- **参数**:
  ```json
  { "imageUrl": "...", "sceneType": "DESK", "extraInfo": { "workYears": "3-5", "jobType": "技术" } }
  ```
- **响应**: `{ "taskId": "...", "status": "UPLOADING" }`

### 3.3 查询检测状态
- **URL**: `GET /api/detect/:id/status`

### 3.4 获取检测报告
- **URL**: `GET /api/detect/:id/report`

### 3.5 获取检测历史
- **URL**: `GET /api/detect/history?page=1&limit=20`

### 3.6 生成分享海报
- **URL**: `POST /api/detect/:id/poster`
- **参数**: `{ "style": "default" }`

### 3.7 历史对比
- **URL**: `GET /api/detect/compare?recordIds=DET_001,DET_002`

---

## 四、方案模块

### 4.1 获取推荐方案
- **URL**: `GET /api/plans/recommend?detectId=DET_001`

### 4.2 选择方案
- **URL**: `POST /api/plans`
- **参数**: `{ "planId": "PLAN_001", "detectId": "DET_001" }`

### 4.3 获取我的方案
- **URL**: `GET /api/plans?status=IN_PROGRESS`

### 4.4 获取方案详情
- **URL**: `GET /api/plans/:id`

### 4.5 打卡
- **URL**: `POST /api/plans/:id/check-in`
- **参数**: `{ "actionId": "...", "content": "今天感觉不错", "imageUrl": "..." }`

### 4.6 获取打卡记录
- **URL**: `GET /api/plans/:id/check-ins`

### 4.7 补卡
- **URL**: `POST /api/plans/:id/make-up`
- **参数**: `{ "day": 3 }`

### 4.8 放弃方案
- **URL**: `PUT /api/plans/:id/abandon`
- **参数**: `{ "reason": "太忙了" }`

### 4.9 完成复测
- **URL**: `POST /api/plans/:id/retest`
- **参数**: `{ "detectId": "DET_002" }`

---

## 五、社交模块

### 5.1 获取帖子列表
- **URL**: `GET /api/posts?page=1&limit=20&sort=hot&tag=#工位大赏`
- **排序**: `hot`（热度） / `time`（时间）
- **响应**:
  ```json
  {
    "list": [
      {
        "id": "POST_001",
        "author": { "id": "...", "nickname": "...", "avatarUrl": "..." },
        "text": "...",
        "images": [],
        "topicTags": ["#工位大赏"],
        "likeCount": 128,
        "commentCount": 45,
        "collectCount": 12,
        "viewCount": 1024,
        "isLiked": false,
        "isCollected": false,
        "publishedAt": "..."
      }
    ],
    "total": 100,
    "hasMore": true
  }
  ```

### 5.2 获取帖子详情
- **URL**: `GET /api/posts/:id`

### 5.3 发布帖子
- **URL**: `POST /api/posts`
- **参数**:
  ```json
  {
    "content": "今天检测出89分...",
    "images": ["url1", "url2"],
    "tags": ["#工位大赏"],
    "isAnonymous": false,
    "detectId": "DET_001"
  }
  ```
- **响应**: `{ "id": "POST_xxx", "status": "AI_REVIEWING" }`

### 5.4 更新帖子
- **URL**: `PUT /api/posts/:id`
- **参数**: `{ "content", "images", "tags", "isAnonymous" }`

### 5.5 删除帖子
- **URL**: `DELETE /api/posts/:id`

### 5.6 点赞 / 取消点赞
- **URL**: `POST /api/posts/:id/like`
- **响应**: `{ "isLiked": true, "likeCount": 129 }`

### 5.7 收藏 / 取消收藏
- **URL**: `POST /api/posts/:id/collect`
- **参数**: `{ "folderName": "默认收藏夹" }`
- **响应**: `{ "isCollected": true, "collectCount": 13 }`

### 5.8 获取评论列表
- **URL**: `GET /api/posts/:id/comments?page=1&limit=20`
- **响应**:
  ```json
  {
    "list": [
      {
        "id": "CMT_001",
        "author": { "id", "nickname", "avatarUrl" },
        "content": "...",
        "likeCount": 5,
        "replyCount": 2,
        "replies": [...],
        "createdAt": "..."
      }
    ]
  }
  ```

### 5.9 发表评论
- **URL**: `POST /api/posts/:id/comments`
- **参数**: `{ "content": "...", "parentId": "CMT_001" }`

### 5.10 删除评论
- **URL**: `DELETE /api/comments/:id`

### 5.11 举报帖子
- **URL**: `POST /api/posts/:id/report`
- **参数**: `{ "reasonType": "SPAM", "reasonText": "广告内容" }`

### 5.12 搜索
- **URL**: `GET /api/search?q=工位&type=post&page=1&limit=20`
- **type**: `post` / `topic`

---

## 六、话题模块

### 6.1 获取话题列表
- **URL**: `GET /api/topics?page=1&limit=50`
- **响应**:
  ```json
  {
    "list": [
      { "id": "T001", "name": "#工位大赏", "displayName": "工位大赏", "description": "...", "postCount": 1250, "viewCount": 50000 }
    ]
  }
  ```

### 6.2 获取话题详情
- **URL**: `GET /api/topics/:id?page=1&limit=20`
- **响应**: 包含话题信息和帖子列表

---

## 七、通知模块

### 7.1 获取通知列表
- **URL**: `GET /api/notifications?page=1&limit=20&type=LIKE&isRead=false`
- **类型**: `LIKE` / `COMMENT` / `FOLLOW` / `SYSTEM` / `REMIND` / `ACHIEVEMENT` / `INVITE`

### 7.2 标记单条已读
- **URL**: `PUT /api/notifications/:id/read`

### 7.3 全部已读
- **URL**: `PUT /api/notifications/read-all`

### 7.4 获取未读数
- **URL**: `GET /api/notifications/unread-count`
- **响应**: `{ "count": 5 }`

---

## 八、分享/裂变模块

### 8.1 记录分享
- **URL**: `POST /api/share/record`
- **参数**:
  ```json
  { "type": "DETECT_REPORT", "channel": "wechat", "contentType": "POST", "contentId": "POST_001" }
  ```

### 8.2 获取邀请码
- **URL**: `GET /api/invite/code`
- **响应**: `{ "inviteCode": "BWXXXXXX" }`

### 8.3 获取邀请统计
- **URL**: `GET /api/invite/stats`
- **响应**:
  ```json
  { "inviteCount": 10, "rewardCount": 8, "totalRewardExp": 240 }
  ```

### 8.4 获取我的邀请列表
- **URL**: `GET /api/invite/list?page=1&limit=20`
- **响应**:
  ```json
  {
    "list": [
      { "id": "...", "invitee": { "id", "nickname", "avatarUrl" }, "isRewarded": true, "rewardExp": 30, "createdAt": "..." }
    ]
  }
  ```

---

## 九、AI服务模块

### 9.1 图像识别
- **URL**: `POST /api/ai/vision/analyze`
- **参数**:
  ```json
  { "imageUrl": "...", "sceneType": "DESK", "detectElements": ["E001", "E003"] }
  ```
- **响应**:
  ```json
  {
    "elements": [
      { "id": "E001", "name": "外卖盒", "category": "工位环境", "confidence": 0.92, "weight": 15, "boundingBox": [...] }
    ]
  }
  ```

### 9.2 辣评生成
- **URL**: `POST /api/ai/comment/generate`
- **参数**:
  ```json
  { "score": 72, "level": "班味浓郁", "elements": [...] }
  ```
- **响应**:
  ```json
  { "comments": ["班味浓郁，建议直接申请工伤", "..."], "score": 72, "level": "班味浓郁" }
  ```

### 9.3 内容审核
- **URL**: `POST /api/ai/moderate`
- **参数**:
  ```json
  { "text": "...", "images": ["url1"] }
  ```
- **响应**:
  ```json
  {
    "riskLevel": "low",
    "confidence": 0.15,
    "matchedWords": [],
    "suggestion": "PASS"
  }
  ```

---

## 十、热度排序算法

信息流默认使用热度排序，热度分计算公式：

```
sortScore = (likeCount * 2 + commentCount * 3 + collectCount * 4 + shareCount * 5 + viewCount * 0.1) * decayFactor

decayFactor = 0.9 ^ (hoursSincePublish / 24)
```

---

*文档最后更新: 2026-04-30*
