# 数据库设计 v1.0

> **项目**: 去除班味（AI班味检测仪）  
> **数据库**: PostgreSQL 15+  
> **设计日期**: 2026-04-30  
> **设计人**: 后端开发工程师  

---

## 1. 数据库设计原则

1. **统一ID格式**: 所有主键使用 `VARCHAR(32)`，业务ID带前缀（如 `USR_`、`DET_`）
2. **JSON字段策略**: 灵活结构用JSON，高频查询字段独立建表/索引
3. **软删除**: 所有表统一用 `status` 字段控制，不物理删除
4. **时间戳**: 统一包含 `created_at` 和 `updated_at`
5. **索引策略**: 高频查询字段建索引，外键自动建索引
6. **分区策略**: `detection_records` 和 `posts` 按月份分区（后期实施）

---

## 2. 表结构总览

| 表名 | 说明 | 数据量预估 |
|------|------|-----------|
| users | 用户表 | 100万+ |
| detection_records | 检测记录表 | 500万+ |
| plan_templates | 方案模板表 | 100条 |
| user_plans | 用户方案实例表 | 50万+ |
| check_in_records | 打卡记录表 | 200万+ |
| posts | 帖子表 | 200万+ |
| comments | 评论表 | 500万+ |
| likes | 点赞表 | 1000万+ |
| collections | 收藏表 | 100万+ |
| topics | 话题表 | 500条 |
| post_topics | 帖子话题关联表 | 300万+ |
| notifications | 通知表 | 1000万+ |
| share_records | 分享记录表 | 200万+ |
| invite_relations | 邀请关系表 | 50万+ |
| achievements | 成就模板表 | 50条 |
| user_achievements | 用户成就表 | 200万+ |
| reports | 举报表 | 5万+ |

---

## 3. 完整DDL

### 3.1 用户表 (users)

```sql
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    union_id VARCHAR(32) UNIQUE,
    open_id VARCHAR(32) NOT NULL UNIQUE,
    nickname VARCHAR(50) DEFAULT '职场新人',
    avatar_url VARCHAR(500),
    gender SMALLINT DEFAULT 0 CHECK (gender IN (0, 1, 2)), -- 0未知 1男 2女
    profile JSONB DEFAULT '{}', -- 用户画像JSON
    level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 10),
    exp INTEGER DEFAULT 0,
    check_in_streak INTEGER DEFAULT 0,
    total_detections INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    invite_code VARCHAR(20) UNIQUE,
    invited_by VARCHAR(32) REFERENCES users(id) ON DELETE SET NULL,
    status SMALLINT DEFAULT 1 CHECK (status IN (0, 1)), -- 0禁用 1正常
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_users_union_id ON users(union_id);
CREATE INDEX idx_users_invite_code ON users(invite_code);
CREATE INDEX idx_users_invited_by ON users(invited_by);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

-- 注释
COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.profile IS '用户画像：{preferredScene, avgScore, scoreTrend, activeTags, persona, riskLevel}';
```

### 3.2 检测记录表 (detection_records)

```sql
CREATE TABLE detection_records (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumb_url VARCHAR(500),
    scene_type VARCHAR(20) NOT NULL CHECK (scene_type IN ('DESK', 'SELFIE', 'SCREENSHOT')),
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
    level VARCHAR(20) NOT NULL CHECK (level IN ('FRESH', 'LIGHT', 'HEAVY', 'EXTREME')),
    elements JSONB DEFAULT '[]', -- 识别元素详情
    dimensions JSONB DEFAULT '{}', -- 四维度分数
    comments JSONB DEFAULT '[]', -- 辣评文案数组
    extra_info JSONB DEFAULT '{}', -- 补充信息
    is_shared BOOLEAN DEFAULT FALSE,
    share_count INTEGER DEFAULT 0,
    poster_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN (
        'CREATED', 'UPLOADING', 'QUEUED', 'ANALYZING', 
        'COMPLETED', 'FAILED', 'TIMEOUT', 'REPORTED'
    )),
    ai_task_id VARCHAR(100), -- AI服务任务ID
    ai_cost_ms INTEGER, -- AI处理耗时
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

-- 索引
CREATE INDEX idx_detection_user_id ON detection_records(user_id);
CREATE INDEX idx_detection_status ON detection_records(status);
CREATE INDEX idx_detection_score ON detection_records(score);
CREATE INDEX idx_detection_level ON detection_records(level);
CREATE INDEX idx_detection_scene_type ON detection_records(scene_type);
CREATE INDEX idx_detection_created_at ON detection_records(created_at);
CREATE INDEX idx_detection_user_created ON detection_records(user_id, created_at DESC);
CREATE INDEX idx_detection_status_user ON detection_records(status, user_id);

-- GIN索引用于JSON查询
CREATE INDEX idx_detection_elements ON detection_records USING GIN(elements);
CREATE INDEX idx_detection_dimensions ON detection_records USING GIN(dimensions);

-- 注释
COMMENT ON TABLE detection_records IS 'AI检测记录表';
COMMENT ON COLUMN detection_records.elements IS '识别元素：[{id, name, category, weight, confidence, boundingBox}]';
COMMENT ON COLUMN detection_records.dimensions IS '四维度：{fatigue, chaos, repetition, concentration}';
```

### 3.3 方案模板表 (plan_templates)

```sql
CREATE TABLE plan_templates (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    category VARCHAR(20) NOT NULL CHECK (category IN (
        'DESK_TRANSFORM', 'BODY_MIND', 'EFFICIENCY', 'FISH_ART'
    )),
    icon VARCHAR(100),
    color VARCHAR(20),
    total_days INTEGER NOT NULL DEFAULT 7,
    match_rules JSONB DEFAULT '[]', -- 元素匹配规则
    actions JSONB DEFAULT '[]', -- 行动项列表
    expected_effect JSONB DEFAULT '{}', -- 预期效果
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_plan_category ON plan_templates(category);
CREATE INDEX idx_plan_active ON plan_templates(is_active);
CREATE INDEX idx_plan_sort ON plan_templates(sort_order);

-- 注释
COMMENT ON TABLE plan_templates IS '去班味方案模板表';
```

### 3.4 用户方案实例表 (user_plans)

```sql
CREATE TABLE user_plans (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_template_id VARCHAR(32) NOT NULL REFERENCES plan_templates(id),
    plan_name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'NOT_STARTED' CHECK (status IN (
        'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED', 'ABANDONED', 
        'AT_RISK', 'RECOVERED'
    )),
    current_day INTEGER DEFAULT 0,
    total_days INTEGER NOT NULL,
    completed_days INTEGER DEFAULT 0,
    missed_days INTEGER DEFAULT 0,
    make_up_days INTEGER DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    detect_before_id VARCHAR(32) REFERENCES detection_records(id) ON DELETE SET NULL,
    detect_after_id VARCHAR(32) REFERENCES detection_records(id) ON DELETE SET NULL,
    remind_time TIME, -- 每日提醒时间
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX idx_user_plans_status ON user_plans(status);
CREATE INDEX idx_user_plans_user_status ON user_plans(user_id, status);
CREATE INDEX idx_user_plans_template ON user_plans(plan_template_id);
CREATE INDEX idx_user_plans_created ON user_plans(created_at DESC);

-- 注释
COMMENT ON TABLE user_plans IS '用户选择去班味方案后的执行实例';
```

### 3.5 打卡记录表 (check_in_records)

```sql
CREATE TABLE check_in_records (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_plan_id VARCHAR(32) NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
    action_id VARCHAR(32) NOT NULL, -- 对应plan_template.actions中的action id
    day_number INTEGER NOT NULL, -- 第几天打卡
    content TEXT, -- 用户填写的内容
    image_url VARCHAR(500), -- 打卡图片
    mood VARCHAR(20), -- 心情: HAPPY NORMAL TIRED EXCITED
    is_make_up BOOLEAN DEFAULT FALSE, -- 是否补卡
    make_up_reason VARCHAR(200), -- 补卡原因
    exp_earned INTEGER DEFAULT 0, -- 本次打卡获得的经验值
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_checkin_user_plan ON check_in_records(user_plan_id);
CREATE INDEX idx_checkin_user ON check_in_records(user_id);
CREATE INDEX idx_checkin_day ON check_in_records(user_plan_id, day_number);
CREATE INDEX idx_checkin_created ON check_in_records(created_at DESC);
CREATE UNIQUE INDEX idx_checkin_unique_day ON check_in_records(user_plan_id, day_number) WHERE is_make_up = FALSE;

-- 注释
COMMENT ON TABLE check_in_records IS '方案打卡记录';
```

### 3.6 帖子表 (posts)

```sql
CREATE TABLE posts (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (type IN ('NORMAL', 'DETECT_REPORT', 'PLAN_PROGRESS', 'CHALLENGE')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'AI_REVIEWING', 'HUMAN_REVIEW', 'APPROVED', 
        'REJECTED', 'APPEAL'
    )),
    text TEXT,
    images JSONB DEFAULT '[]', -- 图片URL数组
    topic_tags JSONB DEFAULT '[]', -- 话题标签
    detect_report_id VARCHAR(32) REFERENCES detection_records(id) ON DELETE SET NULL,
    plan_progress_id VARCHAR(32) REFERENCES user_plans(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    anonymous_name VARCHAR(50), -- 匿名时的随机动物名
    anonymous_avatar VARCHAR(200), -- 匿名头像
    is_pinned BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    collect_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    sort_score DECIMAL(10,4) DEFAULT 0, -- 热度排序分
    ai_review_score DECIMAL(4,3), -- AI审核置信度
    ai_review_result JSONB DEFAULT '{}', -- AI审核详情
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_status ON posts(status);
CREATE INDEX idx_posts_type ON posts(type);
CREATE INDEX idx_posts_anonymous ON posts(is_anonymous);
CREATE INDEX idx_posts_pinned ON posts(is_pinned);
CREATE INDEX idx_posts_sort_score ON posts(sort_score DESC);
CREATE INDEX idx_posts_status_published ON posts(status, published_at DESC);
CREATE INDEX idx_posts_created ON posts(created_at DESC);
CREATE INDEX idx_posts_detect ON posts(detect_report_id);
CREATE INDEX idx_posts_plan ON posts(plan_progress_id);

-- GIN索引
CREATE INDEX idx_posts_images ON posts USING GIN(images);
CREATE INDEX idx_posts_topic_tags ON posts USING GIN(topic_tags);

-- 注释
COMMENT ON TABLE posts IS '圈子帖子表';
```

### 3.7 评论表 (comments)

```sql
CREATE TABLE comments (
    id VARCHAR(32) PRIMARY KEY,
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id VARCHAR(32) REFERENCES comments(id) ON DELETE CASCADE, -- 回复的评论ID
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]', -- 评论图片（表情包等）
    like_count INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

-- 注释
COMMENT ON TABLE comments IS '帖子评论表';
```

### 3.8 点赞表 (likes)

```sql
CREATE TABLE likes (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id VARCHAR(32) NOT NULL, -- 点赞目标ID
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'COMMENT', 'DETECTION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

-- 索引
CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_id, target_type);
CREATE INDEX idx_likes_created ON likes(created_at DESC);

-- 注释
COMMENT ON TABLE likes IS '点赞记录表';
```

### 3.9 收藏表 (collections)

```sql
CREATE TABLE collections (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id VARCHAR(32) NOT NULL, -- 收藏目标ID
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'PLAN', 'DETECTION')),
    folder_name VARCHAR(50) DEFAULT '默认收藏夹',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

-- 索引
CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collections_target ON collections(target_id, target_type);
CREATE INDEX idx_collections_created ON collections(created_at DESC);

-- 注释
COMMENT ON TABLE collections IS '用户收藏记录表';
```

### 3.10 话题表 (topics)

```sql
CREATE TABLE topics (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    description VARCHAR(200),
    icon VARCHAR(200),
    color VARCHAR(20),
    post_count INTEGER DEFAULT 0,
    follow_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_hot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_topics_hot ON topics(is_hot);
CREATE INDEX idx_topics_sort ON topics(sort_order);

-- 注释
COMMENT ON TABLE topics IS '圈子话题标签表';
```

### 3.11 帖子话题关联表 (post_topics)

```sql
CREATE TABLE post_topics (
    id VARCHAR(32) PRIMARY KEY,
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    topic_id VARCHAR(32) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, topic_id)
);

-- 索引
CREATE INDEX idx_post_topics_topic ON post_topics(topic_id);
CREATE INDEX idx_post_topics_post ON post_topics(post_id);

-- 注释
COMMENT ON TABLE post_topics IS '帖子与话题的多对多关联表';
```

### 3.12 通知表 (notifications)

```sql
CREATE TABLE notifications (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN (
        'LIKE', 'COMMENT', 'FOLLOW', 'SYSTEM', 
        'REMIND', 'ACHIEVEMENT', 'INVITE'
    )),
    title VARCHAR(100),
    content VARCHAR(500),
    related_id VARCHAR(32), -- 关联业务ID
    related_type VARCHAR(20), -- 关联业务类型
    sender_id VARCHAR(32) REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    extra JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

-- 注释
COMMENT ON TABLE notifications IS '用户通知表';
```

### 3.13 分享记录表 (share_records)

```sql
CREATE TABLE share_records (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    share_type VARCHAR(20) NOT NULL CHECK (share_type IN ('POSTER', 'LINK', 'CARD')),
    share_channel VARCHAR(20) NOT NULL CHECK (share_channel IN (
        'WECHAT_FRIEND', 'WECHAT_MOMENT', 'WEIBO', 'XIAOHONGSHU'
    )),
    content_type VARCHAR(20) NOT NULL CHECK (content_type IN (
        'DETECT_REPORT', 'POST', 'PLAN', 'INVITE'
    )),
    content_id VARCHAR(32),
    scene VARCHAR(50), -- 小程序场景值
    invite_code VARCHAR(20),
    parent_invite_code VARCHAR(20),
    click_count INTEGER DEFAULT 0,
    convert_count INTEGER DEFAULT 0,
    new_user_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_share_user ON share_records(user_id);
CREATE INDEX idx_share_invite ON share_records(invite_code);
CREATE INDEX idx_share_parent ON share_records(parent_invite_code);
CREATE INDEX idx_share_content ON share_records(content_id, content_type);
CREATE INDEX idx_share_created ON share_records(created_at DESC);

-- 注释
COMMENT ON TABLE share_records IS '分享裂变追踪表';
```

### 3.14 邀请关系表 (invite_relations)

```sql
CREATE TABLE invite_relations (
    id VARCHAR(32) PRIMARY KEY,
    inviter_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'INVALID')),
    reward_status VARCHAR(20) DEFAULT 'NONE' CHECK (reward_status IN ('NONE', 'GRANTED', 'CLAIMED')),
    reward_type VARCHAR(20), -- 奖励类型
    reward_value INTEGER, -- 奖励数值
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(inviter_id, invitee_id)
);

-- 索引
CREATE INDEX idx_invite_inviter ON invite_relations(inviter_id);
CREATE INDEX idx_invite_invitee ON invite_relations(invitee_id);
CREATE INDEX idx_invite_code ON invite_relations(invite_code);
CREATE INDEX idx_invite_status ON invite_relations(status);

-- 注释
COMMENT ON TABLE invite_relations IS '用户邀请关系表';
```

### 3.15 成就模板表 (achievements)

```sql
CREATE TABLE achievements (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    icon VARCHAR(200),
    color VARCHAR(20),
    category VARCHAR(20) NOT NULL CHECK (category IN (
        'DETECTION', 'SOCIAL', 'PLAN', 'INVITE', 'SPECIAL'
    )),
    trigger_type VARCHAR(20) NOT NULL, -- 触发类型
    trigger_condition JSONB NOT NULL, -- 触发条件
    exp_reward INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_active ON achievements(is_active);

-- 注释
COMMENT ON TABLE achievements IS '成就徽章模板表';
```

### 3.16 用户成就表 (user_achievements)

```sql
CREATE TABLE user_achievements (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(32) NOT NULL REFERENCES achievements(id),
    progress INTEGER DEFAULT 0, -- 当前进度
    target_value INTEGER, -- 目标值
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

-- 索引
CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_achieved ON user_achievements(is_achieved);

-- 注释
COMMENT ON TABLE user_achievements IS '用户获得的成就记录';
```

### 3.17 举报表 (reports)

```sql
CREATE TABLE reports (
    id VARCHAR(32) PRIMARY KEY,
    reporter_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id VARCHAR(32) NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'COMMENT', 'USER')),
    reason VARCHAR(50) NOT NULL,
    detail TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'RESOLVED', 'REJECTED')),
    result VARCHAR(200), -- 处理结果说明
    handler_id VARCHAR(32), -- 处理人
    handled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 索引
CREATE INDEX idx_reports_target ON reports(target_id, target_type);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);

-- 注释
COMMENT ON TABLE reports IS '内容举报表';
```

---

## 4. 扩展设计

### 4.1 自动更新时间戳函数

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 为所有需要自动更新的表创建触发器
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_detection_records_updated_at BEFORE UPDATE ON detection_records 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_templates_updated_at BEFORE UPDATE ON plan_templates 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_comments_updated_at BEFORE UPDATE ON comments 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 4.2 ID生成函数

```sql
CREATE OR REPLACE FUNCTION generate_id(prefix TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN prefix || '_' || TO_CHAR(NOW(), 'YYMMDD') || '_' || 
           SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
END;
$$ LANGUAGE plpgsql;
```

---

## 5. Redis缓存策略

### 5.1 缓存Key命名规范

```
bw:{module}:{sub_module}:{identifier}
```

### 5.2 缓存策略表

| Key | 类型 | TTL | 说明 |
|-----|------|-----|------|
| bw:user:{userId} | String | 1h | 用户基本信息 |
| bw:user:stats:{userId} | String | 30m | 用户统计数据 |
| bw:user:level:{userId} | String | 1h | 用户等级信息 |
| bw:user:achievements:{userId} | List | 1h | 用户成就列表 |
| bw:token:{token} | String | 2h | JWT Token黑名单 |
| bw:rate_limit:{ip} | String | 1m | IP限流计数 |
| bw:rate_limit:{userId}:{action} | String | 1m | 用户行为限流 |
| bw:detection:status:{taskId} | String | 5m | 检测任务状态 |
| bw:detection:report:{detectionId} | String | 1h | 检测报告缓存 |
| bw:detection:history:{userId}:{page} | List | 30m | 检测历史列表 |
| bw:detection:ai_result:{hash} | String | 24h | AI分析结果缓存（按图片特征hash） |
| bw:plan:template:{planId} | String | 24h | 方案模板详情 |
| bw:plan:recommend:{userId}:{detectId} | List | 30m | 推荐方案列表 |
| bw:plan:user_plans:{userId} | List | 30m | 用户方案列表 |
| bw:plan:active:{userId} | String | 30m | 用户进行中方案 |
| bw:post:{postId} | String | 30m | 帖子详情 |
| bw:post:feed:{type}:{page} | List | 5m | 帖子流（热门/最新/关注） |
| bw:post:topic:{topicId}:{page} | List | 5m | 话题帖子流 |
| bw:post:user:{userId}:{page} | List | 5m | 用户帖子列表 |
| bw:post:comments:{postId}:{page} | List | 5m | 帖子评论列表 |
| bw:post:hot_comments:{postId} | List | 5m | 热门评论 |
| bw:post:like_count:{postId} | String | 5m | 点赞数（准实时） |
| bw:post:comment_count:{postId} | String | 5m | 评论数 |
| bw:post:share_count:{postId} | String | 5m | 分享数 |
| bw:post:collect_count:{postId} | String | 5m | 收藏数 |
| bw:post:view_count:{postId} | String | 5m | 浏览数 |
| bw:post:user_liked:{userId} | Set | 1h | 用户点赞过的帖子ID集合 |
| bw:post:user_collected:{userId} | Set | 1h | 用户收藏过的帖子ID集合 |
| bw:post:trending | SortedSet | 10m | 热门帖子排行榜 |
| bw:topic:list | List | 1h | 话题列表 |
| bw:topic:hot | List | 30m | 热门话题 |
| bw:topic:{topicId} | String | 1h | 话题详情 |
| bw:notification:unread:{userId} | String | 5m | 未读通知数 |
| bw:notification:list:{userId}:{page} | List | 5m | 通知列表 |
| bw:share:invite:{inviteCode} | String | 24h | 邀请码信息 |
| bw:share:stats:{userId} | String | 30m | 用户分享统计 |
| bw:leaderboard:{type}:{period} | SortedSet | 10m | 排行榜 |
| bw:search:hot | List | 1h | 热门搜索 |
| bw:config:{key} | String | 24h | 系统配置 |
| bw:ban_list:user | Set | 1h | 用户封禁列表 |
| bw:ban_list:ip | Set | 1h | IP封禁列表 |

### 5.3 缓存更新策略

**主动更新:**
- 用户资料修改 → 立即删除 `bw:user:{userId}`
- 帖子发布/删除 → 删除相关feed缓存
- 点赞/取消 → 更新计数 + 删除用户点赞集合
- 评论发布 → 更新评论计数 + 删除评论列表缓存

**被动更新:**
- 缓存未命中时从DB读取，写入缓存
- 使用Cache-Aside模式

**批量更新:**
- 定时任务每10分钟刷新热门帖子排行榜
- 每小时刷新热门话题

### 5.4 计数器设计（准实时）

使用Redis计数 + 定时回写DB:

```
# 点赞计数
INCR bw:post:like_count:{postId}
# 每5分钟批量回写
# 使用SortedSet记录需要回写的postId
ZADD bw:counter:pending:like {timestamp} {postId}
```

---

## 6. 分区与分表策略（后期实施）

### 6.1 detection_records 按月分区

```sql
-- 后期实施分区
CREATE TABLE detection_records_partitioned (
    LIKE detection_records INCLUDING ALL
) PARTITION BY RANGE (created_at);

-- 每月创建分区
CREATE TABLE detection_records_y2026m05 PARTITION OF detection_records_partitioned
    FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
```

### 6.2 posts 按月分区

```sql
CREATE TABLE posts_partitioned (
    LIKE posts INCLUDING ALL
) PARTITION BY RANGE (created_at);
```

### 6.3 comments 按月分区

```sql
CREATE TABLE comments_partitioned (
    LIKE comments INCLUDING ALL
) PARTITION BY RANGE (created_at);
```

### 6.4 notifications 按用户ID哈希分表

```sql
-- 按 user_id 哈希分成8个表
CREATE TABLE notifications_0 (LIKE notifications INCLUDING ALL);
CREATE TABLE notifications_1 (LIKE notifications INCLUDING ALL);
-- ...
```

---

## 7. 初始化数据

### 7.1 默认话题

```sql
INSERT INTO topics (id, name, description, icon, color, sort_order, is_hot) VALUES
('TOP_001', '工位大赏', '晒出你的工位，看看谁的最有班味', 'desk', '#FF6B6B', 1, TRUE),
('TOP_002', '班味超标', '班味浓度爆表，快来吐槽', 'fire', '#E74C3C', 2, TRUE),
('TOP_003', '去班味打卡', '每日去班味行动打卡', 'check', '#27AE60', 3, TRUE),
('TOP_004', '摸鱼艺术', '分享你的摸鱼技巧', 'fish', '#3498DB', 4, FALSE),
('TOP_005', '护眼行动', '保护眼睛，远离班味', 'eye', '#9B59B6', 5, FALSE),
('TOP_006', '工位改造', '改造工位，提升幸福感', 'tool', '#F39C12', 6, FALSE),
('TOP_007', '深夜加班', '深夜还在加班的打工人', 'moon', '#2C3E50', 7, FALSE),
('TOP_008', '周末充电', '周末如何去除班味', 'battery', '#1ABC9C', 8, FALSE);
```

### 7.2 默认成就

```sql
INSERT INTO achievements (id, name, description, icon, color, category, trigger_type, trigger_condition, exp_reward, sort_order) VALUES
('ACH_001', '初次检测', '完成第一次班味检测', 'detect', '#FF6B6B', 'DETECTION', 'COUNT', '{"field": "total_detections", "value": 1}', 20, 1),
('ACH_002', '班味学徒', '累计完成10次检测', 'apprentice', '#F39C12', 'DETECTION', 'COUNT', '{"field": "total_detections", "value": 10}', 50, 2),
('ACH_003', '去味练习生', '累计完成50次检测', 'practice', '#F1C40F', 'DETECTION', 'COUNT', '{"field": "total_detections", "value": 50}', 100, 3),
('ACH_004', '班味斗士', '累计完成100次检测', 'fighter', '#E67E22', 'DETECTION', 'COUNT', '{"field": "total_detections", "value": 100}', 200, 4),
('ACH_005', '发帖新星', '发布第一条帖子', 'star', '#3498DB', 'SOCIAL', 'COUNT', '{"field": "total_posts", "value": 1}', 30, 5),
('ACH_006', '社交达人', '累计获得100个赞', 'popular', '#E74C3C', 'SOCIAL', 'COUNT', '{"field": "total_likes", "value": 100}', 50, 6),
('ACH_007', '打卡初学者', '完成第一次方案打卡', 'beginner', '#27AE60', 'PLAN', 'COUNT', '{"field": "check_in_count", "value": 1}', 20, 7),
('ACH_008', '坚持之星', '连续打卡7天', 'streak', '#F1C40F', 'PLAN', 'STREAK', '{"field": "check_in_streak", "value": 7}', 100, 8),
('ACH_009', '邀请好友', '成功邀请1位好友', 'invite', '#9B59B6', 'INVITE', 'COUNT', '{"field": "invite_count", "value": 1}', 50, 9),
('ACH_010', '去味大师', '等级达到Lv.8', 'master', '#C0392B', 'SPECIAL', 'LEVEL', '{"field": "level", "value": 8}', 500, 10);
```

---

## 8. 数据库ER图

```
[users] 1 ────────< [detection_records]
  │
  ├─< [user_plans] >─── [plan_templates]
  │    │
  │    └─< [check_in_records]
  │
  ├─< [posts] >─── [post_topics] >─── [topics]
  │    │
  │    ├─< [comments]
  │    ├─< [likes]
  │    └─< [collections]
  │
  ├─< [notifications]
  │
  ├─< [share_records]
  │
  ├─< [invite_relations]
  │
  ├─< [user_achievements] >─── [achievements]
  │
  └─< [reports]
```

---

## 9. 性能优化要点

1. **连接池**: PgBouncer，连接池大小 = (CPU核心数 * 2) + 有效磁盘数
2. **读写分离**: 后期实施，主库写，从库读
3. **慢查询监控**: log_min_duration_statement = 1000ms
4. **自动VACUUM**: 保持开启，调整阈值
5. **WAL优化**: wal_buffers = 16MB，checkpoint_completion_target = 0.9
6. **内存配置**: shared_buffers = 25% RAM，effective_cache_size = 50% RAM
7. **JSON查询**: 使用GIN索引，避免全表扫描
8. **定期归档**: detection_records、posts 历史数据定期归档到冷存储

---

## 10. 版本记录

| 版本 | 日期 | 修改内容 |
|------|------|----------|
| v1.0 | 2026-04-30 | 初始版本，包含17个核心表 |
