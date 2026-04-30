-- ============================================
-- 去除班味 - 数据库DDL脚本 v1.0
-- PostgreSQL 15+
-- 执行方式: psql -U your_user -d your_db -f database.sql
-- ============================================

-- 开启事务
BEGIN;

-- ============================================
-- 1. 扩展与工具
-- ============================================

-- 启用UUID扩展（备用）
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 创建更新时间戳函数
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 创建ID生成函数
CREATE OR REPLACE FUNCTION generate_id(prefix TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN prefix || '_' || TO_CHAR(NOW(), 'YYMMDD') || '_' || 
           SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- 2. 用户表 (users)
-- ============================================

CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    union_id VARCHAR(32) UNIQUE,
    open_id VARCHAR(32) NOT NULL UNIQUE,
    nickname VARCHAR(50) DEFAULT '职场新人',
    avatar_url VARCHAR(500),
    gender SMALLINT DEFAULT 0 CHECK (gender IN (0, 1, 2)),
    profile JSONB DEFAULT '{}',
    level INTEGER DEFAULT 1 CHECK (level BETWEEN 1 AND 10),
    exp INTEGER DEFAULT 0,
    check_in_streak INTEGER DEFAULT 0,
    total_detections INTEGER DEFAULT 0,
    total_posts INTEGER DEFAULT 0,
    total_likes INTEGER DEFAULT 0,
    total_comments INTEGER DEFAULT 0,
    invite_code VARCHAR(20) UNIQUE,
    invited_by VARCHAR(32) REFERENCES users(id) ON DELETE SET NULL,
    status SMALLINT DEFAULT 1 CHECK (status IN (0, 1)),
    last_login_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_union_id ON users(union_id);
CREATE INDEX idx_users_invite_code ON users(invite_code);
CREATE INDEX idx_users_invited_by ON users(invited_by);
CREATE INDEX idx_users_level ON users(level);
CREATE INDEX idx_users_status ON users(status);
CREATE INDEX idx_users_created_at ON users(created_at);

COMMENT ON TABLE users IS '用户表';
COMMENT ON COLUMN users.profile IS '用户画像：{preferredScene, avgScore, scoreTrend, activeTags, persona, riskLevel}';

-- ============================================
-- 3. 检测记录表 (detection_records)
-- ============================================

CREATE TABLE detection_records (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    image_url VARCHAR(500) NOT NULL,
    thumb_url VARCHAR(500),
    scene_type VARCHAR(20) NOT NULL CHECK (scene_type IN ('DESK', 'SELFIE', 'SCREENSHOT')),
    score INTEGER NOT NULL CHECK (score BETWEEN 0 AND 100),
    level VARCHAR(20) NOT NULL CHECK (level IN ('FRESH', 'LIGHT', 'HEAVY', 'EXTREME')),
    elements JSONB DEFAULT '[]',
    dimensions JSONB DEFAULT '{}',
    comments JSONB DEFAULT '[]',
    extra_info JSONB DEFAULT '{}',
    is_shared BOOLEAN DEFAULT FALSE,
    share_count INTEGER DEFAULT 0,
    poster_url VARCHAR(500),
    status VARCHAR(20) DEFAULT 'CREATED' CHECK (status IN (
        'CREATED', 'UPLOADING', 'QUEUED', 'ANALYZING', 
        'COMPLETED', 'FAILED', 'TIMEOUT', 'REPORTED'
    )),
    ai_task_id VARCHAR(100),
    ai_cost_ms INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_detection_user_id ON detection_records(user_id);
CREATE INDEX idx_detection_status ON detection_records(status);
CREATE INDEX idx_detection_score ON detection_records(score);
CREATE INDEX idx_detection_level ON detection_records(level);
CREATE INDEX idx_detection_scene_type ON detection_records(scene_type);
CREATE INDEX idx_detection_created_at ON detection_records(created_at);
CREATE INDEX idx_detection_user_created ON detection_records(user_id, created_at DESC);
CREATE INDEX idx_detection_status_user ON detection_records(status, user_id);
CREATE INDEX idx_detection_elements ON detection_records USING GIN(elements);
CREATE INDEX idx_detection_dimensions ON detection_records USING GIN(dimensions);

COMMENT ON TABLE detection_records IS 'AI检测记录表';

-- ============================================
-- 4. 方案模板表 (plan_templates)
-- ============================================

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
    match_rules JSONB DEFAULT '[]',
    actions JSONB DEFAULT '[]',
    expected_effect JSONB DEFAULT '{}',
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_plan_category ON plan_templates(category);
CREATE INDEX idx_plan_active ON plan_templates(is_active);
CREATE INDEX idx_plan_sort ON plan_templates(sort_order);

COMMENT ON TABLE plan_templates IS '去班味方案模板表';

-- ============================================
-- 5. 用户方案实例表 (user_plans)
-- ============================================

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
    remind_time TIME,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_user_plans_user_id ON user_plans(user_id);
CREATE INDEX idx_user_plans_status ON user_plans(status);
CREATE INDEX idx_user_plans_user_status ON user_plans(user_id, status);
CREATE INDEX idx_user_plans_template ON user_plans(plan_template_id);
CREATE INDEX idx_user_plans_created ON user_plans(created_at DESC);

COMMENT ON TABLE user_plans IS '用户选择去班味方案后的执行实例';

-- ============================================
-- 6. 打卡记录表 (check_in_records)
-- ============================================

CREATE TABLE check_in_records (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    user_plan_id VARCHAR(32) NOT NULL REFERENCES user_plans(id) ON DELETE CASCADE,
    action_id VARCHAR(32) NOT NULL,
    day_number INTEGER NOT NULL,
    content TEXT,
    image_url VARCHAR(500),
    mood VARCHAR(20) CHECK (mood IN ('HAPPY', 'NORMAL', 'TIRED', 'EXCITED')),
    is_make_up BOOLEAN DEFAULT FALSE,
    make_up_reason VARCHAR(200),
    exp_earned INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_checkin_user_plan ON check_in_records(user_plan_id);
CREATE INDEX idx_checkin_user ON check_in_records(user_id);
CREATE INDEX idx_checkin_day ON check_in_records(user_plan_id, day_number);
CREATE INDEX idx_checkin_created ON check_in_records(created_at DESC);
CREATE UNIQUE INDEX idx_checkin_unique_day ON check_in_records(user_plan_id, day_number) WHERE is_make_up = FALSE;

COMMENT ON TABLE check_in_records IS '方案打卡记录';

-- ============================================
-- 7. 帖子表 (posts)
-- ============================================

CREATE TABLE posts (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL DEFAULT 'NORMAL' CHECK (type IN ('NORMAL', 'DETECT_REPORT', 'PLAN_PROGRESS', 'CHALLENGE')),
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN (
        'PENDING', 'AI_REVIEWING', 'HUMAN_REVIEW', 'APPROVED', 
        'REJECTED', 'APPEAL'
    )),
    text TEXT,
    images JSONB DEFAULT '[]',
    topic_tags JSONB DEFAULT '[]',
    detect_report_id VARCHAR(32) REFERENCES detection_records(id) ON DELETE SET NULL,
    plan_progress_id VARCHAR(32) REFERENCES user_plans(id) ON DELETE SET NULL,
    is_anonymous BOOLEAN DEFAULT FALSE,
    anonymous_name VARCHAR(50),
    anonymous_avatar VARCHAR(200),
    is_pinned BOOLEAN DEFAULT FALSE,
    like_count INTEGER DEFAULT 0,
    comment_count INTEGER DEFAULT 0,
    collect_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    view_count INTEGER DEFAULT 0,
    sort_score DECIMAL(10,4) DEFAULT 0,
    ai_review_score DECIMAL(4,3),
    ai_review_result JSONB DEFAULT '{}',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

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
CREATE INDEX idx_posts_images ON posts USING GIN(images);
CREATE INDEX idx_posts_topic_tags ON posts USING GIN(topic_tags);

COMMENT ON TABLE posts IS '圈子帖子表';

-- ============================================
-- 8. 评论表 (comments)
-- ============================================

CREATE TABLE comments (
    id VARCHAR(32) PRIMARY KEY,
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    parent_id VARCHAR(32) REFERENCES comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    images JSONB DEFAULT '[]',
    like_count INTEGER DEFAULT 0,
    is_anonymous BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'APPROVED' CHECK (status IN ('PENDING', 'APPROVED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_comments_user_id ON comments(user_id);
CREATE INDEX idx_comments_parent_id ON comments(parent_id);
CREATE INDEX idx_comments_status ON comments(status);
CREATE INDEX idx_comments_created ON comments(created_at DESC);

COMMENT ON TABLE comments IS '帖子评论表';

-- ============================================
-- 9. 点赞表 (likes)
-- ============================================

CREATE TABLE likes (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id VARCHAR(32) NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'COMMENT', 'DETECTION')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX idx_likes_user ON likes(user_id);
CREATE INDEX idx_likes_target ON likes(target_id, target_type);
CREATE INDEX idx_likes_created ON likes(created_at DESC);

COMMENT ON TABLE likes IS '点赞记录表';

-- ============================================
-- 10. 收藏表 (collections)
-- ============================================

CREATE TABLE collections (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id VARCHAR(32) NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'PLAN', 'DETECTION')),
    folder_name VARCHAR(50) DEFAULT '默认收藏夹',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, target_id, target_type)
);

CREATE INDEX idx_collections_user ON collections(user_id);
CREATE INDEX idx_collections_target ON collections(target_id, target_type);
CREATE INDEX idx_collections_created ON collections(created_at DESC);

COMMENT ON TABLE collections IS '用户收藏记录表';

-- ============================================
-- 11. 话题表 (topics)
-- ============================================

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

CREATE INDEX idx_topics_hot ON topics(is_hot);
CREATE INDEX idx_topics_sort ON topics(sort_order);

COMMENT ON TABLE topics IS '圈子话题标签表';

-- ============================================
-- 12. 帖子话题关联表 (post_topics)
-- ============================================

CREATE TABLE post_topics (
    id VARCHAR(32) PRIMARY KEY,
    post_id VARCHAR(32) NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
    topic_id VARCHAR(32) NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(post_id, topic_id)
);

CREATE INDEX idx_post_topics_topic ON post_topics(topic_id);
CREATE INDEX idx_post_topics_post ON post_topics(post_id);

COMMENT ON TABLE post_topics IS '帖子与话题的多对多关联表';

-- ============================================
-- 13. 通知表 (notifications)
-- ============================================

CREATE TABLE notifications (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(20) NOT NULL CHECK (type IN (
        'LIKE', 'COMMENT', 'FOLLOW', 'SYSTEM', 
        'REMIND', 'ACHIEVEMENT', 'INVITE'
    )),
    title VARCHAR(100),
    content VARCHAR(500),
    related_id VARCHAR(32),
    related_type VARCHAR(20),
    sender_id VARCHAR(32) REFERENCES users(id) ON DELETE SET NULL,
    is_read BOOLEAN DEFAULT FALSE,
    extra JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_created ON notifications(created_at DESC);

COMMENT ON TABLE notifications IS '用户通知表';

-- ============================================
-- 14. 分享记录表 (share_records)
-- ============================================

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
    scene VARCHAR(50),
    invite_code VARCHAR(20),
    parent_invite_code VARCHAR(20),
    click_count INTEGER DEFAULT 0,
    convert_count INTEGER DEFAULT 0,
    new_user_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_share_user ON share_records(user_id);
CREATE INDEX idx_share_invite ON share_records(invite_code);
CREATE INDEX idx_share_parent ON share_records(parent_invite_code);
CREATE INDEX idx_share_content ON share_records(content_id, content_type);
CREATE INDEX idx_share_created ON share_records(created_at DESC);

COMMENT ON TABLE share_records IS '分享裂变追踪表';

-- ============================================
-- 15. 邀请关系表 (invite_relations)
-- ============================================

CREATE TABLE invite_relations (
    id VARCHAR(32) PRIMARY KEY,
    inviter_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invitee_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    invite_code VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'COMPLETED', 'INVALID')),
    reward_status VARCHAR(20) DEFAULT 'NONE' CHECK (reward_status IN ('NONE', 'GRANTED', 'CLAIMED')),
    reward_type VARCHAR(20),
    reward_value INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(inviter_id, invitee_id)
);

CREATE INDEX idx_invite_inviter ON invite_relations(inviter_id);
CREATE INDEX idx_invite_invitee ON invite_relations(invitee_id);
CREATE INDEX idx_invite_code ON invite_relations(invite_code);
CREATE INDEX idx_invite_status ON invite_relations(status);

COMMENT ON TABLE invite_relations IS '用户邀请关系表';

-- ============================================
-- 16. 成就模板表 (achievements)
-- ============================================

CREATE TABLE achievements (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(200),
    icon VARCHAR(200),
    color VARCHAR(20),
    category VARCHAR(20) NOT NULL CHECK (category IN (
        'DETECTION', 'SOCIAL', 'PLAN', 'INVITE', 'SPECIAL'
    )),
    trigger_type VARCHAR(20) NOT NULL,
    trigger_condition JSONB NOT NULL,
    exp_reward INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_achievements_category ON achievements(category);
CREATE INDEX idx_achievements_active ON achievements(is_active);

COMMENT ON TABLE achievements IS '成就徽章模板表';

-- ============================================
-- 17. 用户成就表 (user_achievements)
-- ============================================

CREATE TABLE user_achievements (
    id VARCHAR(32) PRIMARY KEY,
    user_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    achievement_id VARCHAR(32) NOT NULL REFERENCES achievements(id),
    progress INTEGER DEFAULT 0,
    target_value INTEGER,
    is_achieved BOOLEAN DEFAULT FALSE,
    achieved_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, achievement_id)
);

CREATE INDEX idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX idx_user_achievements_achievement ON user_achievements(achievement_id);
CREATE INDEX idx_user_achievements_achieved ON user_achievements(is_achieved);

COMMENT ON TABLE user_achievements IS '用户获得的成就记录';

-- ============================================
-- 18. 举报表 (reports)
-- ============================================

CREATE TABLE reports (
    id VARCHAR(32) PRIMARY KEY,
    reporter_id VARCHAR(32) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    target_id VARCHAR(32) NOT NULL,
    target_type VARCHAR(20) NOT NULL CHECK (target_type IN ('POST', 'COMMENT', 'USER')),
    reason VARCHAR(50) NOT NULL,
    detail TEXT,
    status VARCHAR(20) DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'PROCESSING', 'RESOLVED', 'REJECTED')),
    result VARCHAR(200),
    handler_id VARCHAR(32),
    handled_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_reports_target ON reports(target_id, target_type);
CREATE INDEX idx_reports_reporter ON reports(reporter_id);
CREATE INDEX idx_reports_status ON reports(status);

COMMENT ON TABLE reports IS '内容举报表';

-- ============================================
-- 19. 创建更新时间触发器
-- ============================================

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

-- ============================================
-- 20. 初始化数据
-- ============================================

-- 默认话题
INSERT INTO topics (id, name, description, icon, color, sort_order, is_hot) VALUES
('TOP_001', '工位大赏', '晒出你的工位，看看谁的最有班味', 'desk', '#FF6B6B', 1, TRUE),
('TOP_002', '班味超标', '班味浓度爆表，快来吐槽', 'fire', '#E74C3C', 2, TRUE),
('TOP_003', '去班味打卡', '每日去班味行动打卡', 'check', '#27AE60', 3, TRUE),
('TOP_004', '摸鱼艺术', '分享你的摸鱼技巧', 'fish', '#3498DB', 4, FALSE),
('TOP_005', '护眼行动', '保护眼睛，远离班味', 'eye', '#9B59B6', 5, FALSE),
('TOP_006', '工位改造', '改造工位，提升幸福感', 'tool', '#F39C12', 6, FALSE),
('TOP_007', '深夜加班', '深夜还在加班的打工人', 'moon', '#2C3E50', 7, FALSE),
('TOP_008', '周末充电', '周末如何去除班味', 'battery', '#1ABC9C', 8, FALSE);

-- 默认成就
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

COMMIT;

-- ============================================
-- 21. 验证脚本
-- ============================================

-- 验证所有表是否创建成功
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- 验证所有索引
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;
