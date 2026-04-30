# PRD - 去除班味（AI班味检测仪）

> **文档版本**: v1.1  
> **更新日期**: 2026-04-30  
> **撰写人**: 产品经理  
> **状态**: 评审中
> **更新说明**: 在v1.0基础上补充功能模块详细设计、数据模型、状态机、业务流程和接口需求清单

---

## 一、项目概述

### 1.1 产品定位
「去除班味」是一款结合AI图像分析与社交互动的小程序/轻应用，通过识别用户工位、自拍等场景中的"班味"元素，给出趣味诊断结果，并提供个性化去班味方案。产品主打轻松幽默的职场解压，兼具社交裂变属性。

### 1.2 核心价值主张
- **测一测**: AI精准识别"班味"浓度，让职场疲惫可视化
- **看一看**: 辣评吐槽不手软，共鸣感拉满
- **治一治**: 实用去班味方案，从调侃到行动
- **晒一晒**: 社交互动玩法，圈地自萌/吐槽共享

### 1.3 目标用户
| 用户画像 | 特征 | 核心诉求 |
|----------|------|----------|
| 职场新生代 | 95后/00后，工作1-3年 | 情绪宣泄、趣味社交、自我调侃 |
| 互联网打工人 | 互联网/科技/金融行业 | 吐槽文化认同、减轻工作压力 |
| 社交活跃者 | 乐于分享生活碎片 | 内容创作素材、社交谈资 |

### 1.4 成功指标
- DAU: 上线3个月内达到5万
- 分享率: ≥30%（每次检测结果触发分享）
- 用户留存: 次日留存≥25%，7日留存≥15%
- 内容产出: 日新增帖子≥1000条

---

## 二、核心功能

### 2.1 功能架构图

```
┌─────────────────────────────────────────────────┐
│                  去除班味                          │
├─────────────┬─────────────┬─────────────────────┤
│   班味检测   │   去班味方案 │      社交互动        │
├─────────────┼─────────────┼─────────────────────┤
│ • 拍照上传   │ • 个性方案   │ • 发布圈子          │
│ • AI分析     │ • 打卡记录   │ • 评论互动          │
│ • 浓度评分   │ • 效果追踪   │ • 点赞收藏          │
│ • 元素识别   │ • 方案推荐   │ • 分享裂变          │
│ • 辣评生成   │ • 成就系统   │ • 话题挑战          │
└─────────────┴─────────────┴─────────────────────┘
```

### 2.2 功能模块详解

#### 模块一：班味检测
**功能点1.1 - 拍照/上传**
- 支持实时拍照（调用相机）或从相册选择
- 支持工位照片、自拍照片、桌面截图三类场景
- 图片预处理：裁剪、压缩（单张≤5MB）
- 引导提示：拍摄/上传时给出构图建议

**功能点1.2 - AI智能分析**
- 图像识别：检测工位元素（外卖盒、咖啡杯、黑眼圈、凌乱桌面、加班灯、养生壶等）
- 多模态分析：结合图像+用户输入（工作年限、岗位类型可选填）
- 班味浓度算法：综合评分0-100
  - 0-30: 清新脱俗
  - 31-60: 微醺班味
  - 61-85: 班味浓郁
  - 86-100: 腌入味了

**功能点1.3 - 诊断报告**
- 视觉化展示：雷达图展示"疲惫指数/混乱指数/重复指数/班味浓度"
- 识别元素清单：列出检测到的"班味元素"及权重
- 辣评文案：基于浓度和元素生成幽默吐槽（3-5条）
- 历史对比：可查看历次检测趋势变化

#### 模块二：去班味方案
**功能点2.1 - 个性化方案生成**
- 基于检测结果自动推荐去班味方案
- 方案分类：工位改造/身心调节/效率提升/摸鱼艺术
- 每个方案包含：具体行动项+预期效果+完成时限

**功能点2.2 - 打卡追踪**
- 用户选择方案后可标记"执行中"
- 每日打卡记录执行进度
- 连续打卡奖励机制

**功能点2.3 - 方案效果复测**
- 执行方案后可再次拍照检测
- 对比前后班味浓度变化
- 生成"去班味成绩单"

#### 模块三：社交互动
**功能点3.1 - 圈子发布**
- 支持发布图文内容（检测结果截图+文字吐槽）
- 支持话题标签（#工位大赏 #班味超标 #去班味打卡）
- 匿名发布选项（保护隐私）
- 内容审核：AI预审+人工复审

**功能点3.2 - 互动体系**
- 点赞、评论、收藏
- 回复支持表情包和快捷话术
- 热门评论置顶

**功能点3.3 - 分享裂变**
- 生成精美分享海报（检测结果+辣评）
- 支持微信好友/朋友圈/微博/小红书分享
- 邀请好友得检测次数/解锁特权

**功能点3.4 - 话题挑战**
- 运营发起周期性挑战（如"最乱工位大赛"）
- 用户参与投稿，投票评选
- 榜单展示+虚拟奖励

---

## 三、用户故事

### US-001: 初次检测体验
> **作为** 刚下班的打工人，  
> **我希望** 拍一张工位照片就能知道自己"班味"有多重，  
> **以便** 用轻松的方式释放工作压力，还能发朋友圈自嘲。

**验收标准**:
- [ ] 拍照后3秒内进入分析状态
- [ ] 分析完成时间≤8秒
- [ ] 检测报告包含浓度评分、元素识别、辣评文案
- [ ] 支持一键生成分享海报

### US-002: 获取去班味方案
> **作为** 检测出"班味浓郁"的用户，  
> **我希望** 获得具体可执行的去班味建议，  
> **以便** 不只是吐槽，还能真的改善状态。

**验收标准**:
- [ ] 方案与检测结果强相关（≥80%匹配度）
- [ ] 每条方案包含：行动描述、预期效果、建议时长
- [ ] 支持收藏和标记进行中
- [ ] 方案可分享

### US-003: 社交共鸣
> **作为** 喜欢职场吐槽文化的用户，  
> **我希望** 看到其他人的检测结果和吐槽，  
> **以便** 找到共鸣、获得快乐、参与互动。

**验收标准**:
- [ ] 圈子信息流加载时间≤2秒
- [ ] 支持按话题/热度/时间筛选
- [ ] 支持点赞、评论、分享操作
- [ ] 匿名发布保护用户隐私

### US-004: 持续使用激励
> **作为** 已使用多次的老用户，  
> **我希望** 看到我的班味变化趋势和成就记录，  
> **以便** 有持续使用和分享的动力。

**验收标准**:
- [ ] 个人中心展示检测历史趋势图
- [ ] 成就系统（如"班味斗士"、"去味大师"）
- [ ] 连续打卡奖励机制
- [ ] 等级/积分体系

### US-005: 内容安全
> **作为** 平台运营方，  
> **我希望** 用户发布的内容经过审核，  
> **以便** 避免违规内容传播，维护社区氛围。

**验收标准**:
- [ ] 发布内容经过AI预审（涉黄/暴/政/广告）
- [ ] 高风险内容进入人工复审队列
- [ ] 用户可举报不当内容
- [ ] 处理时效≤24小时

---

## 四、技术可行性分析

### 4.1 技术架构建议
```
前端层: 微信小程序 / React Native / Flutter
  ↓
API网关: 统一接口层，鉴权/限流/日志
  ↓
业务服务: Node.js / Go / Python 微服务
  ↓
AI服务层:
  - 图像识别: 阿里云/腾讯云/百度AI / 自研CV模型
  - 文案生成: GPT-4o / Claude / 文心一言 API
  - 内容审核: 阿里云内容安全 / 腾讯云天御
  ↓
数据层:
  - 结构化数据: PostgreSQL / MySQL
  - 缓存: Redis
  - 对象存储: OSS / COS (图片存储)
  - 日志/分析: ClickHouse / Elasticsearch
```

### 4.2 AI能力需求
| 能力 | 方案 | 成本估算 | 可行性 |
|------|------|----------|--------|
| 图像元素识别 | 调用云厂商CV API或微调开源模型 | ¥0.1-0.5/次 | ✅ 高 |
| 浓度评分算法 | 规则引擎+加权计算，结合LLM微调 | 开发成本 | ✅ 高 |
| 辣评文案生成 | 调用大模型API（Prompt Engineering） | ¥0.05-0.1/次 | ✅ 高 |
| 方案推荐 | 基于标签匹配+LLM生成 | ¥0.05/次 | ✅ 高 |
| 内容审核 | 云厂商内容安全API | ¥0.01/次 | ✅ 高 |

### 4.3 风险与应对
| 风险 | 影响 | 应对方案 |
|------|------|----------|
| AI识别准确率不足 | 用户体验差 | MVP阶段聚焦10-15个核心元素识别，逐步扩展 |
| 大模型API成本高 | 运营亏损 | 建立文案模板库，80%场景走模板，20%走AI生成 |
| 内容审核压力大 | 合规风险 | 接入云厂商审核API+敏感词库+用户举报机制 |
| 图片存储成本高 | 运营成本 | 图片压缩+CDN加速+定期清理无互动内容 |

---

## 五、非功能性需求

### 5.1 性能指标
| 指标 | 目标值 |
|------|--------|
| 图片上传耗时 | ≤3秒（4G网络） |
| AI分析耗时 | ≤8秒 |
| 页面首屏加载 | ≤1.5秒 |
| 信息流翻页 | ≤1秒 |
| API响应时间(P99) | ≤500ms |

### 5.2 兼容性
- 支持微信小程序（最低基础库版本2.19.x）
- 适配iOS/Android主流机型
- 支持深色模式（后续版本）

### 5.3 安全与隐私
- 用户图片默认不公开，仅在用户授权分享后展示
- 图片存储加密（服务端加密SSE）
- 敏感信息（如面部特征）仅在本地处理或脱敏存储
- 符合《个人信息保护法》要求

---

## 六、数据埋点设计

### 6.1 核心事件埋点

| 事件名称 | 事件类型 | 触发时机 | 关键属性 |
|----------|----------|----------|----------|
| app_launch | 访问 | 小程序启动 | source(来源场景), first_visit(是否新用户) |
| page_view | 页面 | 进入页面 | page_name(页面名), duration(停留时长) |
| photo_upload | 交互 | 点击拍照/选图 | upload_type(拍照/相册), image_size(图片大小) |
| analysis_start | 交互 | 开始AI分析 | scene_type(工位/自拍/桌面) |
| analysis_complete | 交互 | 分析完成 | duration(耗时), score(班味浓度), element_count(识别元素数) |
| report_share | 分享 | 点击分享按钮 | share_channel(微信好友/朋友圈/其他), report_type(海报/链接) |
| post_publish | 交互 | 发布圈子 | post_type(图文), is_anonymous(是否匿名), topic_tags(话题标签) |
| post_interact | 交互 | 点赞/评论/收藏 | action_type, target_post_id |
| plan_select | 交互 | 选择去班味方案 | plan_category(改造/调节/提升/摸鱼), plan_id |
| check_in | 交互 | 打卡 | plan_id, consecutive_days(连续天数) |
| invite_friend | 分享 | 邀请好友 | invite_channel, new_user(是否新用户) |

### 6.2 用户属性埋点
- user_id, 注册时间, 首次检测时间, 累计检测次数
- 偏好场景（工位/自拍/桌面占比）
- 平均班味浓度, 最高/最低浓度记录
- 社交活跃度（发帖数/互动数/粉丝数）
- 活跃渠道（自然流量/分享裂变/搜索）

### 6.3 漏斗分析
1. **检测漏斗**: 进入首页 → 拍照/上传 → 开始分析 → 查看报告 → 分享/保存
2. **社交漏斗**: 查看圈子 → 点击发布 → 填写内容 → 发布成功 → 获得互动
3. **方案漏斗**: 查看方案 → 选择方案 → 首次打卡 → 持续打卡(3天/7天)
4. **裂变漏斗**: 收到分享 → 打开小程序 → 完成首次检测 → 成为活跃用户

### 6.4 留存分析
- 次日/3日/7日/30日留存（按来源渠道细分）
- 功能留存（检测功能留存 vs 社交功能留存）
- 活跃频次分布（轻度/中度/重度用户分层）

---

## 七、版本规划

### MVP (v1.0) - 核心闭环
- [x] 拍照/上传 + AI分析 + 诊断报告
- [x] 基础辣评文案（模板为主）
- [x] 生成分享海报
- [x] 基础去班味方案（静态推荐）
- [x] 简单圈子发布（图文+审核）

### v1.1 - 社交增强
- [ ] 评论互动体系
- [ ] 话题标签系统
- [ ] 热门榜单
- [ ] 用户个人主页

### v1.2 - 玩法深化
- [ ] 打卡追踪系统
- [ ] 成就/等级体系
- [ ] 话题挑战活动
- [ ] 前后对比复测

### v1.3 - 智能升级
- [ ] AI文案质量提升（个性化）
- [ ] 更丰富的元素识别
- [ ] 智能方案推荐（基于用户行为）
- [ ] 用户画像分析

---

## 八、验收标准汇总

### 8.1 功能验收
| 功能模块 | 验收项 | 通过标准 |
|----------|--------|----------|
| 班味检测 | 图片上传 | 支持拍照+相册，5MB以内，3秒内完成 |
| 班味检测 | AI分析 | 8秒内返回结果，识别≥10个核心元素 |
| 班味检测 | 报告展示 | 包含浓度评分+雷达图+元素清单+3条辣评 |
| 班味检测 | 分享海报 | 生成时间≤2秒，包含关键信息+品牌标识 |
| 去班味方案 | 方案推荐 | 与检测结果关联度≥80%，含行动项+效果+时长 |
| 去班味方案 | 打卡功能 | 支持标记/打卡/查看历史 |
| 社交互动 | 圈子发布 | 支持图文+话题+匿名，发布后5秒内可见 |
| 社交互动 | 内容审核 | AI预审≤2秒，违规内容拦截率≥95% |
| 社交互动 | 互动功能 | 点赞/评论/收藏操作响应≤500ms |

### 8.2 体验验收
- 新用户首次使用完整流程（拍照→报告→分享）≤30秒
- 文案质量：辣评 humor score ≥ 3.5/5（内部评审）
- 分享海报点击率 ≥ 10%
- 崩溃率 ≤ 0.1%

### 8.3 数据验收
- 上线首周数据看板可正常展示
- 埋点事件覆盖100%核心流程
- 数据上报成功率 ≥ 99%

---

## 九、附录

### 9.1 班味元素识别清单（MVP）
| 类别 | 元素 | 权重 |
|------|------|------|
| 工位环境 | 外卖盒/泡面 | +15 |
| 工位环境 | 咖啡杯/能量饮料 | +8 |
| 工位环境 | 凌乱桌面/文件堆积 | +10 |
| 工位环境 | 深夜灯光/屏幕反光 | +12 |
| 工位环境 | 护眼灯/蓝光眼镜 | +5 |
| 工位环境 | 颈椎贴/膏药 | +10 |
| 工位环境 | 养生壶/保温杯泡枸杞 | +8 |
| 个人状态 | 黑眼圈/眼袋 | +15 |
| 个人状态 | 疲惫表情/呆滞眼神 | +12 |
| 个人状态 | 蓬乱头发/褶皱衣服 | +8 |
| 个人状态 | 工牌/职业装 | +5 |
| 设备痕迹 | 多屏幕/复杂接线 | +10 |
| 设备痕迹 | 手机支架/充电线缠绕 | +5 |

### 9.2 辣评文案风格指南
- **风格**: 幽默吐槽、共鸣感强、不人身攻击
- **禁忌**: 不嘲讽具体公司/行业，不涉及敏感话题
- **示例模板**:
  - "您的工位风水极佳——四面楚歌，八面玲珑"
  - "检测到12个班味元素，建议直接申请工伤"
  - "这黑眼圈，说是在通宵蹦迪我都信"
  - "工位整洁度：建议直接报失踪"

### 9.3 竞品参考
- 小红书「工位布置」话题（内容生态参考）
- 各种AI测颜值/测年龄小程序（交互形式参考）
- 脉脉/知乎职场话题（文案调性参考）
- Keep打卡功能（打卡激励参考）

---

## 十、功能模块详细设计（v1.1补充）

### 10.1 模块一：班味检测（拍照上传 → AI分析 → 诊断报告）

#### 10.1.1 页面详细结构

**页面1：检测入口页（pages/detect/index）**

| 字段/组件 | 类型 | 说明 |
|-----------|------|------|
| 顶部标题区 | 静态文本 | "测测你的班味浓度" + 副标题"AI智能检测，一照识破" |
| 场景选择器 | 单选按钮组 | 选项：工位拍照 / 自拍检测 / 桌面截图 |
| 拍照区域 | 相机组件 | 支持实时拍照，底部有构图引导线 |
| 相册入口 | 按钮 | "从相册选择"，唤起系统相册 |
| 示例展示 | 轮播图 | 展示3-4张示例图及对应检测结果预览 |
| 历史记录入口 | 图标按钮 | 右上角，跳转历史检测列表 |
| 底部提示 | 静态文本 | "仅用于娱乐分析，图片严格保密" |

**页面2：图片确认页（pages/detect/confirm）**

| 字段/组件 | 类型 | 说明 |
|-----------|------|------|
| 图片预览 | 图片组件 | 显示已选/已拍图片，支持双指缩放 |
| 裁剪工具 | 交互组件 | 支持自由裁剪、旋转（可选） |
| 补充信息 | 表单 | 工作年限（选填）：<1年 / 1-3年 / 3-5年 / 5年+ |
| 岗位类型 | 选择器（选填） | 技术 / 产品 / 运营 / 设计 / 销售 / 其他 |
| 重新拍摄 | 按钮 | 返回重新拍照 |
| 确认分析 | 主按钮 | 进入AI分析流程 |

**页面3：分析中页（pages/detect/analyzing）**

| 字段/组件 | 类型 | 说明 |
|-----------|------|------|
| 动画区域 | Lottie/SVG动画 | AI扫描动画，模拟识别过程 |
| 进度文字 | 动态文本 | "正在识别班味元素..." → "分析职场疲惫指数..." → "生成辣评文案..." |
| 进度条 | 进度组件 | 0% → 100%，配合文字切换 |
| 趣味提示 | 轮播文本 | 底部滚动展示职场吐槽金句 |
| 取消按钮 | 次要按钮 | 可取消分析（已上传图片不删除） |

**页面4：诊断报告页（pages/detect/report）**

| 字段/组件 | 类型 | 说明 |
|-----------|------|------|
| 浓度评分 | 大数字+环形图 | 0-100分，配合等级标签 |
| 等级标签 | 徽章 | 清新脱俗 / 微醺班味 / 班味浓郁 / 腌入味了 |
| 雷达图 | 图表组件 | 四维度：疲惫指数 / 混乱指数 / 重复指数 / 班味浓度 |
| 元素清单 | 列表 | 检测到的元素图标+名称+权重，可展开详情 |
| 辣评区域 | 卡片列表 | 3-5条辣评，每条可单独分享 |
| 诊断摘要 | 文本卡片 | 一句话总结 |
| 操作栏 | 按钮组 | "生成海报" / "获取方案" / "再测一次" |
| 历史对比 | 折线图（可选） | 展示最近5次检测趋势 |

#### 10.1.2 状态流转

```
[空态] 用户进入检测页
    ↓ 点击拍照/选图
[图片已选] 显示图片确认页
    ↓ 点击确认分析
[上传中] 图片上传至OSS
    ├── 上传成功 → [分析中] 调用AI服务
    │       ├── 分析成功 → [报告页] 展示结果
    │       │       ├── 点击分享 → [分享海报] 生成海报
    │       │       ├── 点击方案 → [方案推荐] 跳转模块二
    │       │       └── 点击再测 → [空态] 重新开始
    │       └── 分析超时/失败 → [异常页] 重试/反馈
    └── 上传失败 → [异常页] 重试/重新选择
```

**状态定义表：**

| 状态 | 状态码 | 说明 | 用户可见文案 |
|------|--------|------|-------------|
| idle | 0 | 空态，等待用户操作 | "拍一张，看看你的班味" |
| image_selected | 1 | 已选择图片 | "确认要分析这张图吗？" |
| uploading | 2 | 图片上传中 | "正在上传图片..." |
| analyzing | 3 | AI分析中 | "AI正在深度扫描..." |
| completed | 4 | 分析完成 | 展示完整报告 |
| failed_upload | 5 | 上传失败 | "上传失败，请重试" |
| failed_analysis | 6 | 分析失败 | "分析出了点小问题" |
| timeout | 7 | 分析超时 | "分析时间较长，请稍等或重试" |

#### 10.1.3 异常处理

| 异常场景 | 触发条件 | 前端表现 | 处理逻辑 | 重试策略 |
|----------|----------|----------|----------|----------|
| 上传失败 | 网络中断/服务器错误 | Toast提示+重试按钮 | 保留本地图片，可重新上传 | 自动重试2次，间隔3s |
| 上传超时 | 超过10秒未响应 | 提示+重试按钮 | 检测网络状态，提示切换网络 | 自动重试1次 |
| 图片过大 | >5MB | 前置拦截+压缩提示 | 前端压缩至≤2MB或提示裁剪 | 无需重试，用户操作 |
| 图片格式不支持 | 非jpg/png/webp | 前置拦截 | 提示仅支持jpg/png格式 | 用户重新选择 |
| 分析超时 | 超过15秒未返回 | 显示"分析时间较长"+后台轮询 | 进入后台轮询，15秒/次，最多6次 | 自动轮询，超时转人工 |
| 分析失败 | AI服务返回错误 | 错误页+"重试/反馈"按钮 | 记录错误日志，引导重试或提交反馈 | 可立即重试 |
| 识别失败 | 无有效元素/图片模糊 | 提示"未检测到明显班味元素" | 建议重新拍照或上传更清晰图片 | 用户重新操作 |
| 服务降级 | AI服务不可用 | 提示"服务繁忙，使用基础分析" | 切换至规则引擎基础评分 | 自动降级 |

---

### 10.2 模块二：去班味方案（方案推荐 → 打卡追踪 → 效果复测）

#### 10.2.1 方案数据结构

**方案基础数据结构：**

```typescript
interface Plan {
  id: string;              // 方案唯一ID
  name: string;              // 方案名称
  category: PlanCategory;    // 分类
  tags: string[];            // 标签数组
  difficulty: number;        // 难度 1-5
  duration: number;          // 建议执行天数
  coverImage: string;        // 封面图URL
  description: string;       // 方案简介
  actions: PlanAction[];     // 行动项列表
  expectedEffect: Effect;    // 预期效果
  matchRules: MatchRule[];   // 匹配规则（用于推荐）
  isTemplate: boolean;       // 是否为模板方案
  createdAt: Date;
  updatedAt: Date;
}

type PlanCategory = 
  | 'DESK_TRANSFORM'    // 工位改造
  | 'BODY_MIND'         // 身心调节
  | 'EFFICIENCY'        // 效率提升
  | 'FISH_ART'          // 摸鱼艺术
  | 'SOCIAL'            // 社交疗愈

interface PlanAction {
  id: string;
  day: number;             // 第几天执行
  title: string;           // 行动标题
  description: string;     // 行动描述
  duration: string;        // 预计耗时
  tips: string[];          // 执行小贴士
  checkInType: 'PHOTO' | 'TEXT' | 'CONFIRM';  // 打卡方式
  icon: string;            // 图标
}

interface Effect {
  reduceScore: number;      // 预计降低班味分数
  improveDimensions: string[]; // 改善维度
  testimonial: string;      // 用户评价引用
}

interface MatchRule {
  elementId: string;       // 匹配的班味元素ID
  minScore: number;        // 最低分数阈值
  weight: number;          // 匹配权重
}
```

**方案分类与示例：**

| 分类 | 标签 | 典型方案 | 适用场景 |
|------|------|----------|----------|
| 工位改造 | #桌面美学 #断舍离 | 《5分钟工位急救术》 | 桌面凌乱、外卖堆积 |
| 身心调节 | #护眼 #颈椎拯救 | 《打工人自救指南：从颈椎到心灵》 | 颈椎贴、黑眼圈、疲惫 |
| 效率提升 | #番茄工作法 #不加班 | 《到点下班秘籍》 | 深夜灯光、多屏幕 |
| 摸鱼艺术 | #带薪养生 #工位瑜伽 | 《合法摸鱼完全手册》 | 高压工作、重复指数高 |
| 社交疗愈 | #饭搭子 #吐槽大会 | 《寻找你的职场病友》 | 情绪压抑、社交需求 |

#### 10.2.2 打卡状态机

```
                    ┌─────────────┐
                    │   NOT_STARTED  │
                    │    (未开始)    │
                    └──────┬──────┘
                           │ 用户选择方案
                           ▼
                    ┌─────────────┐
         ┌─────────│   IN_PROGRESS  │
         │         │    (进行中)     │
         │         └──────┬──────┘
         │                │ 每日打卡
         │                ▼
         │         ┌─────────────┐     所有行动完成
         │         │  CHECKED_IN   │──────────────┐
         │         │   (已打卡)    │              │
         │         └──────┬──────┘                │
         │                │ 持续打卡至最后一天      │
         │                ▼                      │
         │         ┌─────────────┐                │
         └─────────│   ABANDONED   │                │
                   │    (已放弃)    │◄───────────────┘
                   └─────────────┘   用户手动放弃
                           │
                           ▼
                    ┌─────────────┐
                    │   COMPLETED   │
                    │    (已完成)    │
                    └──────┬──────┘
                           │ 触发效果复测
                           ▼
                    ┌─────────────┐
                    │  RE_TEST_READY │
                    │   (待复测)     │
                    └─────────────┘
```

**打卡记录数据结构：**

```typescript
interface CheckInRecord {
  id: string;
  userPlanId: string;      // 用户方案实例ID
  actionId: string;          // 行动项ID
  day: number;              // 第几天打卡
  status: CheckInStatus;    // 打卡状态
  content?: string;         // 打卡内容（文字）
  imageUrl?: string;        // 打卡图片
  checkInAt: Date;          // 打卡时间
  createdAt: Date;
}

type CheckInStatus = 'PENDING' | 'COMPLETED' | 'MISSED' | 'MAKE_UP';
```

**打卡规则：**
- 每天00:00-23:59可打卡当天行动
- 错过可次日补卡（限制3次/方案）
- 连续打卡3天解锁"坚持之星"徽章
- 连续打卡7天获得"去味斗士"成就
- 中断超过2天，状态变为`AT_RISK`，发送提醒

#### 10.2.3 效果对比逻辑

```
复测触发条件：
1. 用户完成方案全部打卡
2. 用户在方案页主动点击"复测效果"
3. 方案执行满7天自动提醒

复测流程：
[完成方案] → [引导复测拍照] → [AI分析] → [生成对比报告]

对比报告内容：
- 前后浓度分数变化（绝对值+百分比）
- 各维度变化雷达图（前后叠加）
- 改善最大/最小的元素
- 去班味成绩单（等级：青铜/白银/黄金/王者）
- 分享海报自动生成
```

**对比数据结构：**

```typescript
interface ComparisonReport {
  id: string;
  userId: string;
  originalDetectId: string;    // 原检测记录ID
  newDetectId: string;          // 新检测记录ID
  originalScore: number;        // 原分数
  newScore: number;             // 新分数
  change: number;               // 变化值（负数为降低）
  changePercent: number;        // 变化百分比
  dimensionChanges: DimensionChange[];  // 各维度变化
  grade: 'BRONZE' | 'SILVER' | 'GOLD' | 'KING';  // 去味等级
  bestImprovement: string;      // 改善最大元素
  sharePosterUrl: string;       // 分享海报URL
  createdAt: Date;
}
```

---

### 10.3 模块三：社交互动（圈子发布 → 互动体系 → 分享裂变）

#### 10.3.1 帖子数据结构

```typescript
interface Post {
  id: string;                  // 帖子ID
  userId: string;              // 作者ID
  type: PostType;              // 帖子类型
  status: PostStatus;          // 审核状态
  content: PostContent;        // 内容
  detectReport?: DetectReportRef;  // 关联的检测报告
  planProgress?: PlanProgressRef;  // 关联的方案进度
  interaction: InteractionSummary;   // 互动统计
  createdAt: Date;
  updatedAt: Date;
  publishedAt?: Date;          // 审核通过时间
  isAnonymous: boolean;         // 是否匿名
  isPinned: boolean;           // 是否置顶
  sortScore: number;           // 排序分数（热度计算）
}

type PostType = 
  | 'DETECT_RESULT'    // 检测结果分享
  | 'PLAN_PROGRESS'    // 方案打卡分享
  | 'COMPARISON'       // 前后对比分享
  | 'TEXT_IMAGE'       // 普通图文
  | 'TOPIC_CHALLENGE'; // 话题挑战投稿

type PostStatus = 
  | 'PENDING'          // 待审核
  | 'AI_REVIEWING'     // AI审核中
  | 'APPROVED'         // 已通过
  | 'REJECTED'         // 未通过
  | 'HUMAN_REVIEW';    // 人工复审中

interface PostContent {
  text: string;                // 正文
  images: string[];            // 图片URL数组
  topicTags: string[];         // 话题标签
  location?: string;           // 位置（可选）
}

interface InteractionSummary {
  likeCount: number;
  commentCount: number;
  collectCount: number;
  shareCount: number;
  viewCount: number;
}
```

#### 10.3.2 互动数据模型

**点赞数据：**

```typescript
interface Like {
  id: string;
  postId: string;
  userId: string;
  createdAt: Date;
}

// 存储：Redis Set (post:likes:{postId}) + 持久化到MySQL
// 查询：判断是否点赞 SISMEMBER post:likes:{postId} {userId}
// 计数：SCARD post:likes:{postId}
```

**评论数据：**

```typescript
interface Comment {
  id: string;
  postId: string;
  userId: string;
  parentId?: string;           // 父评论ID（楼中楼）
  content: string;
  likes: number;
  isHot: boolean;              // 是否热门评论
  status: 'VISIBLE' | 'HIDDEN' | 'DELETED';
  createdAt: Date;
}

// 楼中楼限制：最多2层（评论+回复）
// 热门评论规则：点赞数≥10且排名前3
```

**收藏数据：**

```typescript
interface Collect {
  id: string;
  postId: string;
  userId: string;
  folderId?: string;           // 收藏夹ID
  createdAt: Date;
}

// 用户收藏列表：MySQL表 + 缓存
// 帖子收藏计数：Redis Counter
```

#### 10.3.3 分享追踪机制

**分享链路数据结构：**

```typescript
interface ShareRecord {
  id: string;
  shareType: 'POSTER' | 'LINK' | 'CARD';  // 分享形式
  shareChannel: 'WECHAT_FRIEND' | 'WECHAT_MOMENT' | 'WEIBO' | 'XIAOHONGSHU';
  contentType: 'DETECT_REPORT' | 'POST' | 'PLAN' | 'INVITE';  // 分享内容类型
  contentId: string;             // 内容ID
  sharerUserId: string;          // 分享者ID
  scene: string;                 // 小程序场景值
  // 追踪裂变
  inviteCode?: string;           // 邀请码
  parentInviteCode?: string;     // 上级邀请码（裂变追踪）
  // 回流追踪
  clickCount: number;            // 被点击次数
  convertCount: number;          // 转化次数（打开小程序）
  newUserCount: number;          // 带来新用户数
  createdAt: Date;
}

interface InviteRelation {
  id: string;
  inviterId: string;             // 邀请人
  inviteeId: string;             // 被邀请人
  inviteCode: string;
  status: 'PENDING' | 'COMPLETED' | 'INVALID';
  rewardStatus: 'NONE' | 'GRANTED' | 'CLAIMED';  // 奖励状态
  createdAt: Date;
  completedAt?: Date;
}
```

**裂变追踪逻辑：**

```
用户A分享（带inviteCode=A_123）
    ↓
用户B点击分享 → 打开小程序（记录scene+inviteCode）
    ↓
用户B完成首次检测 → 标记转化成功
    ↓
建立邀请关系（A→B），触发奖励发放
    ↓
用户B分享（带inviteCode=B_456, parent=A_123）
    ↓
用户C点击 → 完成检测
    ↓
建立邀请关系（B→C），同时更新A的二级裂变数据
```

---

## 十一、数据模型设计（v1.1补充）

### 11.1 用户表（users）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(32) | PK | 用户唯一ID（小程序openid） |
| unionId | VARCHAR(32) | UK | 微信unionid |
| nickname | VARCHAR(50) | | 昵称 |
| avatarUrl | VARCHAR(500) | | 头像URL |
| gender | TINYINT | | 性别 0未知 1男 2女 |
| profile | JSON | | 用户画像JSON |
| detectHistory | JSON | | 检测历史摘要 |
| achievements | JSON | | 已获得成就数组 |
| level | INT | DEFAULT 1 | 用户等级 |
| exp | INT | DEFAULT 0 | 经验值 |
| checkInStreak | INT | DEFAULT 0 | 连续打卡天数 |
| totalDetections | INT | DEFAULT 0 | 累计检测次数 |
| totalPosts | INT | DEFAULT 0 | 累计发帖数 |
| totalLikes | INT | DEFAULT 0 | 累计获赞数 |
| inviteCode | VARCHAR(20) | UK | 个人邀请码 |
| invitedBy | VARCHAR(32) | FK | 邀请人ID |
| status | TINYINT | DEFAULT 1 | 0禁用 1正常 |
| createdAt | DATETIME | | 注册时间 |
| updatedAt | DATETIME | | 更新时间 |
| lastLoginAt | DATETIME | | 最后登录时间 |

**用户画像JSON结构：**

```json
{
  "preferredScene": "DESK",      // 偏好检测场景
  "avgScore": 65.5,                // 平均班味浓度
  "scoreTrend": "DOWN",            // 趋势 UP/DOWN/STABLE
  "activeTags": ["工位改造", "护眼"], // 活跃标签
  "persona": "REBORN_SALARYMAN",   // 用户 persona类型
  "riskLevel": "MEDIUM"            // 流失风险等级
}
```

### 11.2 检测记录表（detection_records）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(32) | PK | 检测记录ID |
| userId | VARCHAR(32) | FK,IDX | 用户ID |
| imageUrl | VARCHAR(500) | | 原图URL |
| thumbUrl | VARCHAR(500) | | 缩略图URL |
| sceneType | VARCHAR(20) | | 场景类型 |
| score | INT | | 班味浓度分数 |
| level | VARCHAR(20) | | 等级标签 |
| elements | JSON | | 识别元素详情 |
| dimensions | JSON | | 四维度分数 |
| comments | JSON | | 辣评文案数组 |
| extraInfo | JSON | | 补充信息（工作年限等） |
| isShared | BOOLEAN | DEFAULT false | 是否已分享 |
| shareCount | INT | DEFAULT 0 | 分享次数 |
| posterUrl | VARCHAR(500) | | 生成海报URL |
| status | VARCHAR(20) | | 记录状态 |
| createdAt | DATETIME | | 检测时间 |

**elements JSON结构示例：**

```json
[
  {
    "id": "E001",
    "name": "外卖盒",
    "category": "工位环境",
    "weight": 15,
    "confidence": 0.92,
    "boundingBox": [120, 300, 80, 60]
  }
]
```

### 11.3 方案记录表（user_plans）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(32) | PK | 用户方案实例ID |
| userId | VARCHAR(32) | FK,IDX | 用户ID |
| planId | VARCHAR(32) | FK | 方案模板ID |
| planName | VARCHAR(100) | | 方案名称（快照） |
| category | VARCHAR(20) | | 方案分类 |
| status | VARCHAR(20) | | 执行状态 |
| currentDay | INT | DEFAULT 0 | 当前执行天数 |
| totalDays | INT | | 总天数 |
| completedDays | INT | DEFAULT 0 | 已完成天数 |
| missedDays | INT | DEFAULT 0 | 错过天数 |
| makeUpDays | INT | DEFAULT 0 | 补卡天数 |
| startAt | DATETIME | | 开始时间 |
| endAt | DATETIME | | 预计结束时间 |
| completedAt | DATETIME | | 实际完成时间 |
| detectBeforeId | VARCHAR(32) | FK | 关联的前测记录 |
| detectAfterId | VARCHAR(32) | FK | 关联的后测记录 |
| checkInRecords | JSON | | 打卡记录摘要 |
| createdAt | DATETIME | | 创建时间 |
| updatedAt | DATETIME | | 更新时间 |

### 11.4 帖子表（posts）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(32) | PK | 帖子ID |
| userId | VARCHAR(32) | FK | 作者ID |
| type | VARCHAR(20) | | 帖子类型 |
| status | VARCHAR(20) | IDX | 审核状态 |
| text | TEXT | | 正文内容 |
| images | JSON | | 图片URL数组 |
| topicTags | JSON | | 话题标签 |
| detectReportId | VARCHAR(32) | | 关联检测报告 |
| planProgressId | VARCHAR(32) | | 关联方案进度 |
| isAnonymous | BOOLEAN | DEFAULT false | 是否匿名 |
| isPinned | BOOLEAN | DEFAULT false | 是否置顶 |
| likeCount | INT | DEFAULT 0 | 点赞数 |
| commentCount | INT | DEFAULT 0 | 评论数 |
| collectCount | INT | DEFAULT 0 | 收藏数 |
| shareCount | INT | DEFAULT 0 | 分享数 |
| viewCount | INT | DEFAULT 0 | 浏览数 |
| sortScore | DECIMAL(10,4) | | 排序热度分 |
| publishedAt | DATETIME | | 发布时间 |
| createdAt | DATETIME | | 创建时间 |
| updatedAt | DATETIME | | 更新时间 |

### 11.5 通知表（notifications）

| 字段 | 类型 | 约束 | 说明 |
|------|------|------|------|
| id | VARCHAR(32) | PK | 通知ID |
| userId | VARCHAR(32) | FK,IDX | 接收用户ID |
| type | VARCHAR(20) | | 通知类型 |
| title | VARCHAR(100) | | 通知标题 |
| content | VARCHAR(500) | | 通知内容 |
| relatedId | VARCHAR(32) | | 关联业务ID |
| relatedType | VARCHAR(20) | | 关联业务类型 |
| senderId | VARCHAR(32) | | 发送者ID（系统通知为null） |
| isRead | BOOLEAN | DEFAULT false | 是否已读 |
| extra | JSON | | 扩展数据 |
| createdAt | DATETIME | | 创建时间 |

**通知类型枚举：**

| 类型 | 场景 | 示例文案 |
|------|------|----------|
| LIKE | 点赞通知 | "xxx 赞了你的帖子" |
| COMMENT | 评论通知 | "xxx 评论了你：'...'" |
| FOLLOW | 关注通知 | "xxx 关注了你" |
| SYSTEM | 系统通知 | "你的帖子已通过审核" |
| REMIND | 提醒通知 | "该打卡啦！距离去班味还有3天" |
| ACHIEVEMENT | 成就通知 | "恭喜获得'班味斗士'成就！" |
| INVITE | 邀请通知 | "xxx 通过你的邀请加入了" |

---

## 十二、状态机定义（v1.1补充）

### 12.1 检测任务状态机

```
                    ┌─────────┐
                    │  CREATED  │
                    │  (已创建)  │
                    └────┬────┘
                         │ 上传图片
                         ▼
                    ┌─────────┐
         ┌─────────│ UPLOADING │
         │         │ (上传中)  │
         │         └────┬────┘
         │              │ 上传完成
         │              ▼
         │         ┌─────────┐     上传失败
         │         │ QUEUED  │──────────┐
         │         │ (排队中) │          │
         │         └────┬────┘          │
         │              │ 开始分析        │
         │              ▼                │
         │         ┌─────────┐          │
         │         │ANALYZING│          │
         │         │ (分析中) │          │
         │         └────┬────┘          │
         │              │               │
         ├──────────────┼───────────────┤
         │              │               │
         ▼              ▼               ▼
    ┌─────────┐   ┌─────────┐    ┌─────────┐
    │ COMPLETED│   │  FAILED │    │ TIMEOUT │
    │ (已完成) │   │ (失败)  │    │ (超时)  │
    └────┬────┘   └────┬────┘    └────┬────┘
         │             │              │
         ▼             └──────────────┘
    ┌─────────┐                   │
    │ REPORTED│◄──────────────────┘
    │ (已出报告)│   重试
    └─────────┘
```

**状态转换表：**

| 当前状态 | 事件 | 下一状态 | 触发条件 |
|----------|------|----------|----------|
| CREATED | upload | UPLOADING | 用户确认上传 |
| UPLOADING | success | QUEUED | 上传成功 |
| UPLOADING | fail | FAILED | 上传失败 |
| QUEUED | dequeue | ANALYZING | 开始AI分析 |
| ANALYZING | success | COMPLETED | 分析完成 |
| ANALYZING | fail | FAILED | 分析异常 |
| ANALYZING | timeout | TIMEOUT | 超过15秒 |
| COMPLETED | generate | REPORTED | 报告生成完成 |
| FAILED | retry | UPLOADING/ANALYZING | 用户点击重试 |
| TIMEOUT | retry | ANALYZING | 用户点击重试 |
| TIMEOUT | poll | COMPLETED/FAILED | 后台轮询结果 |

### 12.2 方案执行状态机

```
┌─────────────┐    select     ┌─────────────┐
│  NOT_STARTED │───────────────│ IN_PROGRESS │
│   (未开始)   │               │  (进行中)    │
└─────────────┘               └──────┬──────┘
                                     │
                    ┌────────────────┼────────────────┐
                    │                │                │
                    ▼                ▼                ▼
             ┌─────────┐      ┌─────────┐      ┌─────────┐
             │COMPLETED │      │ABANDONED│      │AT_RISK  │
             │ (已完成)  │      │ (已放弃) │      │ (风险中) │
             └────┬────┘      └─────────┘      └────┬────┘
                  │                                   │
                  │ resume                  ┌────────┘
                  ▼                         ▼
             ┌─────────┐              ┌─────────┐
             │ RE_TEST │              │RECOVERED│
             │ (待复测) │              │ (已恢复) │
             └─────────┘              └─────────┘
```

### 12.3 帖子审核状态机

```
┌─────────────┐
│   PENDING    │
│   (待提交)    │
└──────┬──────┘
       │ publish
       ▼
┌─────────────┐
│ AI_REVIEWING │
│  (AI审核中)   │
└──────┬──────┘
       │
       ├── pass ──→ ┌─────────┐
       │            │ APPROVED │
       │            │ (已通过)  │
       │            └────┬────┘
       │                 │
       ├── low_risk ──→  ▼
       │            ┌─────────┐
       │            │ HUMAN_REVIEW│
       │            │ (人工复审)  │
       │            └────┬────┘
       │                 │
       └── fail ──→ ┌─────────┐
                    │ REJECTED │
                    │ (未通过)  │
                    └────┬────┘
                         │
                         ▼
                    ┌─────────┐
                    │  APPEAL  │
                    │ (申诉中)  │
                    └─────────┘
```

**审核规则：**

| 风险等级 | AI判定条件 | 处理流程 |
|----------|------------|----------|
| 无风险 | 置信度<0.1 | 直接通过 |
| 低风险 | 0.1≤置信度<0.5 | AI通过，抽样人工复核 |
| 中风险 | 0.5≤置信度<0.8 | 进入人工复审队列 |
| 高风险 | 置信度≥0.8 | 直接拒绝，提示修改 |

### 12.4 用户等级状态机

**等级定义：**

| 等级 | 称号 | 经验值区间 | 权益 |
|------|------|-----------|------|
| Lv.1 | 职场小白 | 0-99 | 基础检测、基础方案 |
| Lv.2 | 班味学徒 | 100-299 | 解锁详细雷达图 |
| Lv.3 | 去味练习生 | 300-599 | 解锁打卡提醒 |
| Lv.4 | 班味斗士 | 600-999 | 解锁自定义话题 |
| Lv.5 | 去味专家 | 1000-1499 | 解锁优先审核 |
| Lv.6 | 反卷先锋 | 1500-2199 | 解锁专属成就 |
| Lv.7 | 班味克星 | 2200-2999 | 解锁高级方案 |
| Lv.8 | 去味大师 | 3000-3999 | 解锁个人主页 |
| Lv.9 | 职场仙人 | 4000-5499 | 解锁邀请特权 |
| Lv.10 | 班味免疫体 | 5500+ | 全功能解锁 |

**经验值获取规则：**

| 行为 | 经验值 | 每日上限 |
|------|--------|----------|
| 完成一次检测 | +10 | 30 |
| 分享检测结果 | +5 | 15 |
| 发布帖子 | +15 | 30 |
| 获得一个点赞 | +2 | 20 |
| 评论他人帖子 | +3 | 15 |
| 完成方案打卡 | +10 | 无 |
| 连续打卡7天 | +50（额外） | 无 |
| 邀请新用户 | +30 | 无 |
| 获得成就 | +20~100 | 无 |

---

## 十三、详细业务流程（v1.1补充）

### 13.1 拍照检测完整流程

```
┌─────────┐     ┌─────────┐     ┌─────────┐     ┌─────────┐
│  用户    │────→│  小程序  │────→│  API网关 │────→│ 业务服务│
└─────────┘     └─────────┘     └─────────┘     └─────────┘
     │               │               │               │
     │ 1.进入检测页   │               │               │
     │──────────────→│               │               │
     │               │ 2.选择场景    │               │
     │               │ 拍照/选图     │               │
     │←──────────────│               │               │
     │               │               │               │
     │ 3.确认图片    │               │               │
     │ 填写补充信息  │               │               │
     │──────────────→│               │               │
     │               │ 4.上传图片    │               │
     │               │──────────────→│               │
     │               │               │ 5.转存OSS     │
     │               │               │──────────────→│
     │               │               │←──────────────│
     │               │←──────────────│ 返回图片URL   │
     │               │               │               │
     │               │ 6.创建检测任务│               │
     │               │──────────────→│               │
     │               │               │ 7.调用AI服务  │
     │               │               │──────────────→┐
     │               │               │                 │
     │               │               │                 ▼
     │               │               │            ┌─────────┐
     │               │               │            │ AI服务  │
     │               │               │            │ - 图像识别│
     │               │               │            │ - 浓度评分│
     │               │               │            │ - 辣评生成│
     │               │               │            └────┬────┘
     │               │               │                 │
     │               │               │←────────────────│
     │               │               │ 8.返回分析结果   │
     │               │←──────────────│               │
     │               │               │               │
     │ 9.展示报告    │               │               │
     │←──────────────│               │               │
     │               │               │               │
     │ 10.用户操作   │               │               │
     │ 分享/方案/再测│               │               │
     │──────────────→│               │               │
```

**分支条件说明：**

| 分支节点 | 条件 | 处理逻辑 |
|----------|------|----------|
| 图片大小检查 | >5MB | 前端压缩至2MB或拒绝上传 |
| 图片格式检查 | 非jpg/png/webp | 拒绝并提示 |
| 上传结果 | 失败 | 重试2次，仍失败则提示用户 |
| 分析结果 | 超时 | 进入轮询模式，15秒/次 |
| 分析结果 | 失败 | 降级为基础评分（规则引擎） |
| 元素识别 | 0个元素 | 提示"未检测到班味，换个角度试试" |
| 用户选择 | 点击分享 | 生成海报 → 唤起分享面板 |
| 用户选择 | 点击方案 | 跳转方案推荐页，带检测结果参数 |
| 用户选择 | 点击再测 | 清空状态，返回检测入口 |

### 13.2 方案推荐匹配逻辑

```
输入：检测结果（elements[] + score + dimensions）
        ↓
┌─────────────────────┐
│ 1. 元素匹配阶段      │
│ 遍历检测元素，匹配   │
│ 方案模板matchRules   │
│ 计算匹配分数         │
└─────────────────────┘
        ↓
┌─────────────────────┐
│ 2. 分数加权阶段      │
│ 基础分 = Σ(匹配权重) │
│ 维度加分 = 各维度偏差×系数│
│ 总分 = 基础分 + 维度加分 │
└─────────────────────┘
        ↓
┌─────────────────────┐
│ 3. 排序筛选阶段      │
│ 按总分降序           │
│ 过滤已执行/已放弃方案 │
│ 多样性控制（分类去重）│
└─────────────────────┘
        ↓
输出：推荐方案列表（Top 3-5）
```

**匹配算法伪代码：**

```python
def recommend_plans(detection_result):
    matched_plans = []
    
    for plan in plan_templates:
        score = 0
        matched_elements = []
        
        # 元素匹配
        for element in detection_result.elements:
            for rule in plan.matchRules:
                if rule.elementId == element.id and detection_result.score >= rule.minScore:
                    score += rule.weight * element.confidence
                    matched_elements.append(element)
        
        # 维度偏差加分
        for dim in detection_result.dimensions:
            if dim.score > 70:  # 高维度偏差
                score += (dim.score - 70) * 0.5
        
        # 浓度加分
        if detection_result.score >= 60:
            score += (detection_result.score - 60) * 0.3
        
        matched_plans.append({
            'plan': plan,
            'score': score,
            'matched_elements': matched_elements
        })
    
    # 排序并筛选
    matched_plans.sort(key=lambda x: x['score'], reverse=True)
    
    # 多样性控制：确保至少2个不同分类
    selected = []
    categories = set()
    for mp in matched_plans:
        if len(selected) < 3:
            selected.append(mp)
            categories.add(mp['plan'].category)
    
    # 如果分类不足2个，补充其他分类的高分方案
    if len(categories) < 2:
        for mp in matched_plans:
            if mp['plan'].category not in categories and len(selected) < 3:
                selected.append(mp)
                categories.add(mp['plan'].category)
    
    return selected
```

### 13.3 圈子内容推荐算法（初步）

**推荐排序公式：**

```
sortScore = (w1 × timeScore) + (w2 × hotScore) + (w3 × qualityScore) + (w4 × personalizedScore)

其中：
- w1=0.25, w2=0.35, w3=0.2, w4=0.2（权重可调）
- timeScore = exp(-0.05 × hoursSincePublish)  // 时间衰减
- hotScore = (likeCount × 1 + commentCount × 2 + shareCount × 3 + viewCount × 0.1) / 100
- qualityScore = min(imageCount × 0.3 + textLength × 0.01, 1.0)  // 内容质量
- personalizedScore = tagMatchCount × 0.5 + authorFollowBonus  // 个性化匹配
```

**推荐流策略：**

| 场景 | 策略 | 说明 |
|------|------|------|
| 首页推荐 | 混合排序 | 60%热门 + 30%个性化 + 10%随机新内容 |
| 关注流 | 时间序 | 关注作者的最新发布 |
| 话题页 | 热度序 | 该话题下的热门内容 |
| 新用户冷启动 | 热门兜底 | 展示全站热门内容 |
| 老用户 | 个性化增强 | 基于历史行为推荐 |

### 13.4 分享裂变追踪逻辑

```
分享端：
用户A点击分享
    ↓
生成分享内容（海报/链接/卡片）
    ↓
嵌入参数：
  - inviteCode=A_123456（用户A的邀请码）
  - scene=share_detect（分享场景）
  - contentId=DET_xxx（内容ID）
    ↓
唤起分享面板

接收端：
用户B点击分享内容
    ↓
解析参数：
  - 获取inviteCode
  - 获取scene和contentId
    ↓
记录点击事件（share_click）
    ↓
打开小程序
    ↓
判断用户B是否为新用户
    ├── 新用户 → 记录转化
    │       ↓
    │   建立邀请关系（A→B）
    │       ↓
    │   用户B完成首次检测
    │       ↓
    │   标记邀请完成，发放奖励
    │       ↓
    │   更新用户A的裂变数据
    │
    └── 老用户 → 仅记录回流
            ↓
        展示分享内容
```

---

## 十四、接口需求清单（v1.1补充）

### 14.1 前端API列表

#### 用户模块

| 接口 | 方法 | 路径 | 参数 | 返回值 | 说明 |
|------|------|------|------|--------|------|
| 用户登录 | POST | /api/auth/login | code（微信登录码） | {token, userInfo} | 小程序登录 |
| 获取用户信息 | GET | /api/user/profile | - | User对象 | 获取个人资料 |
| 更新用户信息 | PUT | /api/user/profile | {nickname, avatarUrl} | User对象 | 更新资料 |
| 用户等级 | GET | /api/user/level | - | {level, exp, nextExp, title} | 获取等级信息 |
| 用户成就 | GET | /api/user/achievements | - | Achievement[] | 获取成就列表 |

#### 检测模块

| 接口 | 方法 | 路径 | 参数 | 返回值 | 说明 |
|------|------|------|------|--------|------|
| 获取上传凭证 | GET | /api/detect/upload-token | {filename, size} | {uploadUrl, key, token} | 获取OSS直传凭证 |
| 创建检测任务 | POST | /api/detect | {imageUrl, sceneType, extraInfo} | {taskId, status} | 创建检测 |
| 查询检测状态 | GET | /api/detect/:id/status | - | {status, progress} | 轮询状态 |
| 获取检测报告 | GET | /api/detect/:id/report | - | DetectionReport | 获取完整报告 |
| 获取检测历史 | GET | /api/detect/history | {page, limit} | DetectionRecord[] | 历史记录 |
| 生成分享海报 | POST | /api/detect/:id/poster | {style} | {posterUrl} | 生成海报 |
| 历史对比 | GET | /api/detect/compare | {recordIds} | ComparisonReport | 对比报告 |

#### 方案模块

| 接口 | 方法 | 路径 | 参数 | 返回值 | 说明 |
|------|------|------|------|--------|------|
| 获取推荐方案 | GET | /api/plans/recommend | {detectId} | Plan[] | 基于检测推荐 |
| 获取方案详情 | GET | /api/plans/:id | - | Plan | 方案详情 |
| 选择方案 | POST | /api/user-plans | {planId, detectId} | UserPlan | 开始执行方案 |
| 获取我的方案 | GET | /api/user-plans | {status} | UserPlan[] | 获取方案列表 |
| 打卡 | POST | /api/user-plans/:id/check-in | {actionId, content, image} | CheckInRecord | 执行打卡 |
| 获取打卡记录 | GET | /api/user-plans/:id/check-ins | - | CheckInRecord[] | 打卡历史 |
| 补卡 | POST | /api/user-plans/:id/make-up | {day} | CheckInRecord | 补卡操作 |
| 放弃方案 | PUT | /api/user-plans/:id/abandon | {reason} | UserPlan | 放弃方案 |
| 完成复测 | POST | /api/user-plans/:id/retest | {detectId} | ComparisonReport | 提交复测 |

#### 社交模块

| 接口 | 方法 | 路径 | 参数 | 返回值 | 说明 |
|------|------|------|------|--------|------|
| 获取帖子列表 | GET | /api/posts | {type, page, limit, tag} | Post[] | 帖子流 |
| 获取帖子详情 | GET | /api/posts/:id | - | Post | 帖子详情 |
| 发布帖子 | POST | /api/posts | {content, images, tags, isAnonymous, detectId} | Post | 发布 |
| 删除帖子 | DELETE | /api/posts/:id | - | - | 删除 |
| 点赞 | POST | /api/posts/:id/like | - | {likeCount, isLiked} | 点赞/取消 |
| 获取评论 | GET | /api/posts/:id/comments | {page} | Comment[] | 评论列表 |
| 发表评论 | POST | /api/posts/:id/comments | {content, parentId} | Comment | 评论 |
| 删除评论 | DELETE | /api/comments/:id | - | - | 删除评论 |
| 收藏 | POST | /api/posts/:id/collect | {folderId} | {collectCount, isCollected} | 收藏 |
| 获取话题列表 | GET | /api/topics | - | Topic[] | 话题列表 |
| 获取话题详情 | GET | /api/topics/:id | - | Topic | 话题详情 |

#### 通知模块

| 接口 | 方法 | 路径 | 参数 | 返回值 | 说明 |
|------|------|------|------|--------|------|
| 获取通知列表 | GET | /api/notifications | {type, isRead, page} | Notification[] | 通知列表 |
| 标记已读 | PUT | /api/notifications/:id/read | - | - | 单条已读 |
| 全部已读 | PUT | /api/notifications/read-all | - | - | 批量已读 |
| 获取未读数 | GET | /api/notifications/unread-count | - | {count} | 未读数量 |

#### 分享/裂变模块

| 接口 | 方法 | 路径 | 参数 | 返回值 | 说明 |
|------|------|------|------|--------|------|
| 记录分享 | POST | /api/share/record | {type, channel, contentType, contentId} | {shareId} | 记录分享 |
| 获取邀请码 | GET | /api/invite/code | - | {inviteCode} | 获取个人邀请码 |
| 获取邀请统计 | GET | /api/invite/stats | - | {inviteCount, rewardCount} | 邀请数据 |
| 获取我的邀请 | GET | /api/invite/list | {page} | InviteRelation[] | 邀请列表 |

### 14.2 AI服务交互接口

#### 图像识别服务

```
接口：POST /ai/vision/analyze
请求体：
{
  "imageUrl": "https://oss.example.com/img.jpg",
  "sceneType": "DESK",           // DESK | SELFIE | SCREENSHOT
  "detectElements": ["E001", "E002", ...]  // 指定检测元素（可选）
}

响应体：
{
  "success": true,
  "data": {
    "elements": [
      {
        "id": "E001",
        "name": "外卖盒",
        "category": "工位环境",
        "confidence": 0.92,
        "boundingBox": [120, 300, 80, 60],
        "weight": 15
      }
    ],
    "elementCount": 5,
    "processingTime": 2.3
  }
}
```

#### 浓度评分服务

```
接口：POST /ai/scoring/calculate
请求体：
{
  "elements": [...],               // 识别元素列表
  "sceneType": "DESK",
  "extraInfo": {
    "workYears": "1-3",
    "jobType": "技术"
  }
}

响应体：
{
  "success": true,
  "data": {
    "totalScore": 72,
    "level": "班味浓郁",
    "dimensions": {
      "fatigue": 75,               // 疲惫指数
      "chaos": 80,                 // 混乱指数
      "repetition": 65,            // 重复指数
      "concentration": 72          // 班味浓度
    },
    "topElements": ["E001", "E003"]
  }
}
```

#### 辣评生成服务

```
接口：POST /ai/text/generate-comments
请求体：
{
  "score": 72,
  "level": "班味浓郁",
  "elements": [...],
  "dimensions": {...},
  "count": 3,                     // 生成条数
  "style": "humor"                // humor | sarcasm | gentle
}

响应体：
{
  "success": true,
  "data": {
    "comments": [
      "检测到12个班味元素，建议直接申请工伤",
      "您的工位风水极佳——四面楚歌，八面玲珑",
      "这黑眼圈，说是在通宵蹦迪我都信"
    ],
    "source": "template",            // template | llm
    "templateMatchRate": 0.85
  }
}
```

#### 方案生成服务

```
接口：POST /ai/plan/generate
请求体：
{
  "detectId": "DET_xxx",
  "score": 72,
  "elements": [...],
  "userProfile": {...}
}

响应体：
{
  "success": true,
  "data": {
    "plans": [
      {
        "id": "PLAN_001",
        "name": "5分钟工位急救术",
        "category": "DESK_TRANSFORM",
        "actions": [...],
        "expectedEffect": {...}
      }
    ]
  }
}
```

### 14.3 文件上传接口规范

#### 前端直传OSS流程

```
1. 前端获取文件（拍照/相册）
2. 前端检查：
   - 格式：jpg/png/webp
   - 大小：≤5MB（超限则压缩）
3. 请求后端获取上传凭证
   GET /api/detect/upload-token
   参数：filename, contentType, size
4. 后端返回：
   {
     "uploadUrl": "https://oss.example.com",  // OSS上传地址
     "key": "detect/20260430/xxx.jpg",      // 对象路径
     "token": "OSS Signature",              // 签名凭证
     "expireAt": 1714473600                 // 过期时间
   }
5. 前端直传OSS（PUT/POST）
   - 文件内容作为body
   - 携带签名凭证（Header或Form）
6. OSS返回：
   - 成功：HTTP 200
   - 失败：HTTP 4xx/5xx
7. 前端确认上传成功
   - 拼接完整URL：ossDomain + key
   - 调用创建检测任务API
```

**上传规范：**

| 项目 | 规范 |
|------|------|
| 支持格式 | JPEG, PNG, WebP |
| 最大尺寸 | 5MB（前端压缩至≤2MB） |
| 最小尺寸 | 宽×高 ≥ 300×300px |
| 存储路径 | {bizType}/{date}/{uuid}.{ext} |
| 访问域名 | CDN加速域名 |
| 图片处理 | 自动缩略图：宽度720px |
| 安全策略 | 签名URL有效期5分钟 |
| 命名规范 | {用户ID}_{时间戳}_{随机6位} |

**上传错误码：**

| 错误码 | 说明 | 前端处理 |
|--------|------|----------|
| UPLOAD_001 | 文件格式不支持 | 提示用户重新选择 |
| UPLOAD_002 | 文件过大 | 提示压缩或裁剪 |
| UPLOAD_003 | 上传凭证过期 | 重新获取凭证 |
| UPLOAD_004 | 网络错误 | 重试或提示检查网络 |
| UPLOAD_005 | OSS服务异常 | 稍后重试 |

---

> 📌 **PRD v1.1 更新说明**:
> - 补充了三大功能模块的详细页面结构、状态流转和异常处理
> - 定义了完整的数据模型（用户/检测/方案/帖子/通知）
> - 明确了四个核心状态机（检测/方案/帖子审核/用户等级）
> - 绘制了详细业务流程图和算法逻辑
> - 列出了完整的API接口清单和AI服务交互规范
> - **下一步**: 技术评审 → 数据库设计 → 接口Mock → 开发启动
