-- 去除班味 - 数据库DDL
-- 版本: v1.2
-- 数据库: PostgreSQL 14+

-- 扩展
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- 用于文本搜索

-- ============================================
-- 1. 用户表
-- ============================================
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,                          -- 小程序openid
    union_id VARCHAR(32) UNIQUE,
    nickname VARCHAR(50),
    avatar_url VARCHAR(500),
    gender SMALLINT DEFAULT 0,                           -- 0未知 1男 2女
    profile JSONB DEFAULT '{}',                          -- 用户画像
    level INT DEFAULT 1,
    exp INT DEFAULT 0,
    check_in_streak INT DEFAULT 0,
    total_detections INT DEFAULT 0,
    total_posts INT DEFAULT 0,
    total_likes INT DEFAULT 0,
    invite_code VARCHAR(20) UNIQUE,
    invited_by VARCHAR(32) REFERENCES users(id),
    status SMALLINT DEFAULT 1,                           -- 0禁用 1正常
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- 用户表索引
CREATE INDEX idx_users_invite_code ON users(invite_code);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_created_at ON users(created_at);

-- ============================================
-- 2. 成就表（从users.achievements拆分）
-- ============================================
CREATE TABLE user_achievements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_code VARCHAR(50) NOT NULL,               -- 成就编码
    achievement_name VARCHAR(100),
    icon_url VARCHAR(500),
    description TEXT,
    unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, achievement_code)
);

CREATE INDEX idx_ua_user_id ON user_achievements(user_id);

-- ============================================
-- 3. 检测记录表
-- ============================================
CREATE TABLE detection_records (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumb_url VARCHAR(500),
    scene_type VARCHAR(20) NOT NULL,                     -- DESK/SELFIE/SCREENSHOT
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    level VARCHAR(20) NOT NULL,
    elements JSONB DEFAULT '[]',                         -- 识别元素详情
    dimensions JSONB DEFAULT '{}',                       -- 四维度分数
    comments JSONB DEFAULT '[]',                         -- 辣评文案
    extra_info JSONB DEFAULT '{}',                       -- 补充信息
    is_shared BOOLEAN DEFAULT FALSE,
    share_count INT DEFAULT 0,
    poster_url VARCHAR(500),
    perceptual_hash VARCHAR(64),                         -- 图片感知哈希，用于缓存
    status VARCHAR(20) DEFAULT 'COMPLETED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 检测记录表索引
CREATE INDEX idx_dr_user_id_created_at ON detection_records(user_id, created_at DESC);
CREATE INDEX idx_dr_score ON detection_records(score);
CREATE INDEX idx_dr_perceptual_hash ON detection_records(perceptual_hash);
CREATE INDEX idx_dr_created_at ON detection_records(created_at DESC);

-- ============================================
-- 4. 方案模板表
-- ============================================
CREATE TABLE plan_templates (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    category VARCHAR(20) NOT NULL,                         -- DESK_TRANSFORM/BODY_MIND/EFFICIENCY/FISH_ART/SOCIAL
    tags JSONB DEFAULT '[]',
    difficulty INT DEFAULT 1 CHECK (difficulty >= 1 AND difficulty <= 5),
    duration INT DEFAULT 7,                              -- 建议执行天数
    cover_image VARCHAR(500),
    description TEXT,
    actions JSONB DEFAULT '[]',                          -- 行动项列表
    expected_effect JSONB DEFAULT '{}',
    match_rules JSONB DEFAULT '[]',                      -- 匹配规则
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- 5. 用户方案记录表
-- ============================================
CREATE TABLE user_plans (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(32) NOT NULL REFERENCES plan_templates(id),
    plan_name VARCHAR(100),                                -- 方案名称快照
    category VARCHAR(20),
    status VARCHAR(20) DEFAULT 'NOT_STARTED',             -- NOT_STARTED/IN_PROGRESS/COMPLETED/ABANDONED/AT_RISK
    current_day INT DEFAULT 0,
    total_days INT DEFAULT 7,
    completed_days INT DEFAULT 0,
    missed_days INT DEFAULT 0,
    make_up_days INT DEFAULT 0,
    started_at TIMESTAMP WITH TIME ZONE,
    ended_at TIMESTAMP WITH TIME ZONE,
    completed_at TIMESTAMP WITH TIME ZONE,
    detect_before_id VARCHAR(32) REFERENCES detection_records(id),
    detect_after_id VARCHAR(32) REFERENCES detection_records(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_up_user_id_status ON user_plans(user_id, status);
CREATE INDEX idx_up_plan_id ON user_plans(plan_id);
CREATE INDEX idx_up_user_id_created_at ON user_plans(user_id, created_at DESC);

-- ============================================
-- 6. 打卡记录表
-- ============================================
CREATE TABLE check_in_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_plan_id VARCHAR(32) NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
    action_id VARCHAR(32) NOT NULL,
    day INT NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',                  -- PENDING/COMPLETED/MISSED/MAKE_UP
    content TEXT,
    image_url VARCHAR(500),
    check_in_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cir_user_plan_id ON check_in_records(user_plan_id);
CREATE INDEX idx_cir_user_plan_day ON check_in_records(user_plan_id, day);

-- ============================================
-- 7. 帖子表
-- ============================================
CREATE TABLE posts (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,                             -- DETECT_RESULT/PLAN_PROGRESS/COMPARISON/TEXT_IMAGE/TOPIC_CHALLENGE
    status VARCHAR(20) DEFAULT 'PENDING',                  -- PENDING/AI_REVIEWING/APPROVED/REJECTED/HUMAN_REVIEW
    text TEXT,
    images JSONB DEFAULT '[]',
    detect_report_id VARCHAR(32) REFERENCES detection_records(id),
    plan_progress_id VARCHAR(32) REFERENCES user_plans(id),
    is_anonymous BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,
    like_count INT DEFAULT 0,
    comment_count INT DEFAULT 0,
    collect_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    view_count INT DEFAULT 0,
    sort_score DECIMAL(10,4) DEFAULT 0,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_deleted BOOLEAN DEFAULT FALSE
);

CREATE INDEX idx_posts_status_sort_score ON posts(status, sort_score DESC);
CREATE INDEX idx_posts_user_id ON posts(user_id, created_at DESC);
CREATE INDEX idx_posts_published_at ON posts(published_at DESC);
CREATE INDEX idx_posts_is_deleted ON posts(is_deleted);

-- 为文本搜索创建GIN索引
CREATE INDEX idx_posts_text_trgm ON posts USING GIN (text gin_trgm_ops);

-- ============================================
-- 8. 帖子标签关联表（从posts.topic_tags拆分）
-- ============================================
CREATE TABLE post_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    UNIQUE(post_id, tag_name)
);

CREATE INDEX idx_pt_post_id ON post_tags(post_id);
CREATE INDEX idx_pt_tag_name ON post_tags(tag_name);

-- ============================================
-- 9. 评论表
-- ============================================
CREATE TABLE comments (
    id VARCHAR(32) PRIMARY KEY,
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id VARCHAR(32) REFERENCES comments(id),
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    is_hot BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'VISIBLE',                 -- VISIBLE/HIDDEN/DELETED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_comments_post_id ON comments(post_id, created_at DESC);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);

-- ============================================
-- 10. 点赞表
-- ============================================
CREATE TABLE likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(20) NOT NULL,                      -- POST/COMMENT
    target_id VARCHAR(32) NOT NULL,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(target_type, target_id, user_id)
);

CREATE INDEX idx_likes_target ON likes(target_type, target_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);

-- ============================================
-- 11. 收藏表
-- ============================================
CREATE TABLE collects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX idx_collects_user_id ON collects(user_id);
CREATE INDEX idx_collects_post_id ON collects(post_id);

-- ============================================
-- 12. 通知表
-- ============================================
CREATE TABLE notifications (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL,                             -- LIKE/COMMENT/FOLLOW/SYSTEM/REMIND/ACHIEVEMENT/INVITE
    title VARCHAR(100),
    content VARCHAR(500),
    related_id VARCHAR(32),
    related_type VARCHAR(20),
    sender_id VARCHAR(32) REFERENCES users(id),
    is_read BOOLEAN DEFAULT FALSE,
    extra JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read, created_at DESC);
CREATE INDEX idx_notifications_user_type ON notifications(user_id, type, created_at DESC);

-- ============================================
-- 13. 分享记录表
-- ============================================
CREATE TABLE share_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    share_type VARCHAR(20) NOT NULL,                        -- POSTER/LINK/CARD
    share_channel VARCHAR(30) NOT NULL,                       -- WECHAT_FRIEND/WECHAT_MOMENT/WEIBO/XIAOHONGSHU
    content_type VARCHAR(20) NOT NULL,                     -- DETECT_REPORT/POST/PLAN/INVITE
    content_id VARCHAR(32) NOT NULL,
    sharer_user_id VARCHAR(32) REFERENCES users(id),
    scene VARCHAR(50),
    invite_code VARCHAR(20),
    parent_invite_code VARCHAR(20),
    click_count INT DEFAULT 0,
    convert_count INT DEFAULT 0,
    new_user_count INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_sr_invite_code ON share_records(invite_code);
CREATE INDEX idx_sr_sharer ON share_records(sharer_user_id);

-- ============================================
-- 14. 邀请关系表
-- ============================================
CREATE TABLE invite_relations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    inviter_id VARCHAR(32) NOT NULL REFERENCES users(id),
    invitee_id VARCHAR(32) NOT NULL REFERENCES users(id),
    invite_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING',                -- PENDING/COMPLETED/INVALID
    reward_status VARCHAR(20) DEFAULT 'NONE',              -- NONE/GRANTED/CLAIMED
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(invitee_id)
);

CREATE INDEX idx_ir_inviter ON invite_relations(inviter_id);
CREATE INDEX idx_ir_invitee ON invite_relations(invitee_id);
CREATE INDEX idx_ir_code ON invite_relations(invite_code);

-- ============================================
-- 15. 对比报告表
-- ============================================
CREATE TABLE comparison_reports (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    original_detect_id VARCHAR(32) REFERENCES detection_records(id),
    new_detect_id VARCHAR(32) REFERENCES detection_records(id),
    original_score INT,
    new_score INT,
    change INT,
    change_percent DECIMAL(5,2),
    dimension_changes JSONB DEFAULT '[]',
    grade VARCHAR(20),                                     -- BRONZE/SILVER/GOLD/KING
    best_improvement VARCHAR(50),
    share_poster_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_cr_user_id ON comparison_reports(user_id, created_at DESC);

-- ============================================
-- 触发器：自动更新updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plan_templates_updated_at BEFORE UPDATE ON plan_templates
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_plans_updated_at BEFORE UPDATE ON user_plans
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 分区策略（按月分区 detection_records）
-- ============================================
-- detection_records 预估月增40万条，建议按月份分区
-- 执行以下命令按月创建分区表：

-- CREATE TABLE detection_records_2026_04 PARTITION OF detection_records
--     FOR VALUES FROM ('2026-04-01') TO ('2026-05-01');
-- CREATE TABLE detection_records_2026_05 PARTITION OF detection_records
--     FOR VALUES FROM ('2026-05-01') TO ('2026-06-01');
-- ...以此类推

-- ============================================
-- 初始数据：方案模板
-- ============================================
INSERT INTO plan_templates (id, name, category, tags, difficulty, duration, description, actions, expected_effect, match_rules) VALUES
('PLAN_001', '5分钟工位急救术', 'DESK_TRANSFORM', '["桌面美学", "断舍离"]', 2, 7, '快速整理工位，找回工作仪式感', '[{"id":"A001","day":1,"title":"清空桌面","description":"把所有东西放到箱子里，只留必需品","duration":"5分钟","checkInType":"PHOTO","icon":"broom"},{"id":"A002","day":2,"title":"分类收纳","description":"用收纳盒分类文件和杂物","duration":"5分钟","checkInType":"PHOTO","icon":"box"},{"id":"A003","day":3,"title":"添加绿植","description":"放一盆小绿植在桌面","duration":"2分钟","checkInType":"CONFIRM","icon":"plant"}]', '{"reduceScore":15,"improveDimensions":["混乱指数","班味浓度"]}', '[{"elementId":"E003","minScore":0,"weight":10},{"elementId":"E001","minScore":0,"weight":8}]'),
('PLAN_002', '打工人自救指南：从颈椎到心灵', 'BODY_MIND', '["护眼", "颈椎拯救"]', 3, 14, '全方位身心调节，告别职业病', '[{"id":"A004","day":1,"title":"颈椎放松操","description":"每2小时做一组颈椎操","duration":"3分钟","checkInType":"CONFIRM","icon":"neck"},{"id":"A005","day":2,"title":"20-20-20护眼","description":"每20分钟看20英尺外20秒","duration":"1分钟","checkInType":"CONFIRM","icon":"eye"}]', '{"reduceScore":20,"improveDimensions":["疲惫指数","班味浓度"]}', '[{"elementId":"E007","minScore":0,"weight":10},{"elementId":"E008","minScore":0,"weight":12}]'),
('PLAN_003', '到点下班秘籍', 'EFFICIENCY', '["番茄工作法", "不加班"]', 2, 7, '提升效率，准点下班不是梦', '[{"id":"A006","day":1,"title":"今日三件事","description":"早晨列出最重要的3件事","duration":"2分钟","checkInType":"TEXT","icon":"list"},{"id":"A007","day":2,"title":"番茄钟工作","description":"25分钟专注+5分钟休息","duration":"30分钟","checkInType":"CONFIRM","icon":"tomato"}]', '{"reduceScore":10,"improveDimensions":["重复指数","疲惫指数"]}', '[{"elementId":"E005","minScore":0,"weight":8},{"elementId":"E012","minScore":0,"weight":6}]'),
('PLAN_004', '合法摸鱼完全手册', 'FISH_ART', '["带薪养生", "工位瑜伽"]', 1, 7, '科学摸鱼，工作生活两不误', '[{"id":"A008","day":1,"title":"工位瑜伽","description":"在工位做简单的拉伸动作","duration":"5分钟","checkInType":"PHOTO","icon":"yoga"},{"id":"A009","day":2,"title":"带薪喝茶","description":"泡一杯好茶，享受5分钟","duration":"10分钟","checkInType":"PHOTO","icon":"tea"}]', '{"reduceScore":12,"improveDimensions":["疲惫指数","班味浓度"]}', '[{"elementId":"E009","minScore":0,"weight":10},{"elementId":"E013","minScore":0,"weight":5}]');

-- ============================================
-- 初始数据：班味元素定义
-- ============================================
CREATE TABLE IF NOT EXISTS elements (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    category VARCHAR(20) NOT NULL,
    weight INT NOT NULL,
    icon VARCHAR(50),
    description TEXT
);

INSERT INTO elements (id, name, category, weight, icon) VALUES
('E001', '外卖盒/泡面', '工位环境', 15, 'takeout'),
('E002', '咖啡杯/能量饮料', '工位环境', 8, 'coffee'),
('E003', '凌乱桌面/文件堆积', '工位环境', 10, 'messy'),
('E004', '深夜灯光/屏幕反光', '工位环境', 12, 'night'),
('E005', '护眼灯/蓝光眼镜', '工位环境', 5, 'eyecare'),
('E006', '颈椎贴/膏药', '工位环境', 10, 'patch'),
('E007', '养生壶/保温杯泡枸杞', '工位环境', 8, 'teapot'),
('E008', '黑眼圈/眼袋', '个人状态', 15, 'panda'),
('E009', '疲惫表情/呆滞眼神', '个人状态', 12, 'tired'),
('E010', '蓬乱头发/褶皱衣服', '个人状态', 8, 'messy-hair'),
('E011', '工牌/职业装', '个人状态', 5, 'badge'),
('E012', '多屏幕/复杂接线', '设备痕迹', 10, 'screens'),
('E013', '手机支架/充电线缠绕', '设备痕迹', 5, 'cable');
