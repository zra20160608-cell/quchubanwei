# 去除班味 — 图标系统设计规范

> 版本：v1.0  
> 更新日期：2025-04-30  
> 设计风格：现代扁平化 + 品牌微渐变

---

## 设计理念

「去除班味」的图标系统遵循**「简洁中见趣味」**的原则：

- **简洁几何**：统一的几何语言，避免过度装饰
- **品牌温度**：圆角处理呼应品牌的轻松幽默气质
- **情绪表达**：不同场景使用对应情绪色，强化视觉叙事
- **一致性**：全站图标使用统一的视觉语言，拒绝混搭

**风格定位**：现代扁平化设计为主，关键图标（如Tab栏选中态、成就徽章）融入品牌微渐变，在简洁与趣味间取得平衡。

---

## 风格定义

### 核心特征
| 属性 | 规范 | 说明 |
|------|------|------|
| 描边宽度 | 2px | 全站统一，视觉清爽 |
| 端点样式 | 圆角端点 (round) | 呼应品牌圆润气质 |
| 连接处 | 圆角连接 (round) | 避免尖锐感 |
| 圆角半径 | 4px (小图标) / 8px (大图标) | 根据图标尺寸动态调整 |
| 填充方式 | 线性描边为主，面性填充为辅 | Tab栏选中态、成就徽章使用面性 |
| 最小间隙 | 2px | 确保小尺寸下清晰可辨 |

### 色彩策略
```
默认态（未选中/次要）：  oklch(60% 0.02 45)  → 中性灰
选中态/主操作：        oklch(65% 0.18 45)  → 品牌珊瑚橙
情绪表达：              对应情绪色（fresh/tipsy/strong/extreme）
禁用态：                oklch(70% 0.01 45)  → 浅灰
反白态（深色背景）：    oklch(99% 0.005 45) → 纯白
```

### 渐变规范（仅用于面性图标）
```css
/* 品牌微渐变 — 用于选中态Tab、成就徽章 */
--icon-gradient-brand: linear-gradient(
  135deg, 
  oklch(75% 0.12 45) 0%, 
  oklch(65% 0.18 45) 100%
);

/* 清新渐变 — 用于低班味场景 */
--icon-gradient-fresh: linear-gradient(
  135deg, 
  oklch(85% 0.08 160) 0%, 
  oklch(75% 0.12 160) 100%
);

/* 浓郁渐变 — 用于高班味场景 */
--icon-gradient-strong: linear-gradient(
  135deg, 
  oklch(70% 0.14 45) 0%, 
  oklch(55% 0.20 45) 100%
);
```

---

## 图标分类体系

### 1. 功能图标（底部Tab栏）

| 图标名称 | 用途 | 尺寸 | 描边 | 风格 |
|---------|------|------|------|------|
| `icon-home` | 首页/检测 | 24px | 2px | 线性 + 面性（选中态） |
| `icon-plan` | 方案 | 24px | 2px | 线性 + 面性（选中态） |
| `icon-circle` | 圈子 | 24px | 2px | 线性 + 面性（选中态） |
| `icon-profile` | 我的 | 24px | 2px | 线性 + 面性（选中态） |

**Tab栏规范**：
- 未选中：线性描边，颜色 `--color-text-tertiary`
- 选中：面性填充 + 品牌渐变，颜色 `--color-brand`
- 动画：切换时 200ms ease-out-quint，缩放 1→1.05→1

### 2. 操作图标

| 图标名称 | 用途 | 尺寸 | 描边 | 风格 |
|---------|------|------|------|------|
| `icon-camera` | 拍照检测 | 32px | 2px | 面性（主按钮） |
| `icon-upload` | 上传图片 | 24px | 2px | 线性 |
| `icon-share` | 分享 | 24px | 2px | 线性 |
| `icon-like` | 点赞 | 24px | 2px | 线性 → 面性（激活态） |
| `icon-comment` | 评论 | 24px | 2px | 线性 |
| `icon-bookmark` | 收藏 | 24px | 2px | 线性 → 面性（激活态） |
| `icon-settings` | 设置 | 24px | 2px | 线性 |
| `icon-close` | 关闭 | 24px | 2px | 线性 |
| `icon-back` | 返回 | 24px | 2px | 线性 |
| `icon-more` | 更多选项 | 24px | 2px | 线性 |

### 3. 状态图标

| 图标名称 | 用途 | 尺寸 | 描边 | 风格 |
|---------|------|------|------|------|
| `icon-loading` | 加载中 | 32px | 2px | 线性旋转动画 |
| `icon-success` | 成功 | 48px | 2px | 面性 + 品牌色 |
| `icon-error` | 失败 | 48px | 2px | 面性 + 错误色 |
| `icon-warning` | 警告 | 24px | 2px | 线性 + 警告色 |
| `icon-empty` | 空状态 | 64px | 2px | 面性装饰 |

### 4. 元素图标（班味元素识别）

| 图标名称 | 含义 | 尺寸 | 描边 | 风格 |
|---------|------|------|------|------|
| `icon-takeout` | 外卖盒 | 48px | 2px | 面性装饰 |
| `icon-coffee` | 咖啡杯 | 48px | 2px | 面性装饰 |
| `icon-panda-eye` | 黑眼圈 | 48px | 2px | 面性装饰 |
| `icon-messy-desk` | 凌乱桌面 | 48px | 2px | 面性装饰 |
| `icon-overtime-lamp` | 加班灯 | 48px | 2px | 面性装饰 |
| `icon-health-pot` | 养生壶 | 48px | 2px | 面性装饰 |
| `icon-neck-pillow` | U型枕 | 48px | 2px | 面性装饰 |
| `icon-eye-drops` | 眼药水 | 48px | 2px | 面性装饰 |
| `icon-cactus` | 桌面绿植 | 48px | 2px | 面性装饰 |
| `icon-calendar` | 排满日历 | 48px | 2px | 面性装饰 |

**元素图标使用场景**：
- 检测报告中的「班味元素」展示
- 海报分享时的装饰元素
- 空状态页面的趣味点缀

### 5. 成就图标

| 图标名称 | 含义 | 尺寸 | 风格 |
|---------|------|------|------|
| `icon-badge-rookie` | 新手徽章 | 48px | 面性 + 渐变 |
| `icon-badge-warrior` | 战士徽章 | 48px | 面性 + 渐变 |
| `icon-badge-sage` | 智者徽章 | 48px | 面性 + 渐变 |
| `icon-medal-bronze` | 铜勋章 | 64px | 面性 + 渐变 |
| `icon-medal-silver` | 银勋章 | 64px | 面性 + 渐变 |
| `icon-medal-gold` | 金勋章 | 64px | 面性 + 渐变 |
| `icon-medal-legend` | 传说勋章 | 64px | 面性 + 渐变 |

---

## 尺寸规范

### 尺寸层级

| 层级 | 尺寸 | 使用场景 | 描边宽度 |
|------|------|---------|---------|
| XS | 16px | 内联文字、标签内 | 1.5px |
| SM | 24px | Tab栏、列表项、按钮 | 2px |
| MD | 32px | 大按钮、卡片标题 | 2px |
| LG | 48px | 元素图标、成就徽章 | 2px |
| XL | 64px | 空状态、海报装饰 | 2.5px |

### 响应式规则
```
微信小程序：固定 rpx 尺寸（根据屏幕宽度适配）
  24px → 48rpx
  32px → 64rpx
  48px → 96rpx
  64px → 128rpx

Web/H5：使用 rem 或 px 根据项目规范
```

### 触摸区域
- **最小触摸目标**：44×44px（无论图标视觉尺寸多小）
- **图标按钮**：padding 至少 8px 包围图标

---

## 颜色规范

### 图标色板

```css
/* === 默认状态 === */
--icon-default: oklch(60% 0.02 45);          /* 中性灰 */
--icon-default-hover: oklch(45% 0.03 45);    /* 悬停加深 */

/* === 品牌状态 === */
--icon-brand: oklch(65% 0.18 45);            /* 珊瑚橙 */
--icon-brand-hover: oklch(55% 0.20 45);     /* 品牌深 */

/* === 情绪状态 === */
--icon-fresh: oklch(75% 0.12 160);           /* 薄荷绿 */
--icon-tipsy: oklch(80% 0.14 85);            /* 暖黄 */
--icon-strong: oklch(65% 0.18 45);           /* 珊瑚橙 */
--icon-extreme: oklch(50% 0.20 25);          /* 深红紫 */

/* === 功能状态 === */
--icon-success: oklch(65% 0.14 145);         /* 成功绿 */
--icon-warning: oklch(75% 0.16 80);          /* 警告黄 */
--icon-error: oklch(55% 0.20 25);            /* 错误红 */
--icon-info: oklch(65% 0.12 240);            /* 信息蓝 */

/* === 特殊状态 === */
--icon-disabled: oklch(70% 0.01 45);         /* 禁用态 */
--icon-inverse: oklch(99% 0.005 45);        /* 反白（深色背景） */
```

### 颜色使用规则

| 场景 | 颜色 | 示例 |
|------|------|------|
| Tab栏未选中 | `--icon-default` | 灰色线性图标 |
| Tab栏选中 | `--icon-brand` + 渐变填充 | 珊瑚橙面性图标 |
| 点赞/收藏激活 | `--icon-brand` | 填充态珊瑚橙 |
| 成功提示 | `--icon-success` | 绿色面性对勾 |
| 错误提示 | `--icon-error` | 红色面性叉号 |
| 警告提示 | `--icon-warning` | 黄色线性感叹号 |
| 情绪标签（清新）| `--icon-fresh` | 薄荷绿元素图标 |
| 情绪标签（浓郁）| `--icon-strong` | 珊瑚橙元素图标 |
| 深色卡片上 | `--icon-inverse` | 白色图标 |

---

## 动画规范

### 状态切换动画
```css
/* Tab栏切换 */
.icon-tab {
  transition: all 200ms cubic-bezier(0.22, 1, 0.36, 1);
}
.icon-tab.active {
  transform: scale(1.08);
  fill: url(#gradient-brand);
}

/* 点赞动画 */
@keyframes like-bounce {
  0%   { transform: scale(1); }
  50%  { transform: scale(1.3); }
  100% { transform: scale(1); }
}
.icon-like.active {
  animation: like-bounce 300ms ease-out;
  fill: var(--icon-brand);
}

/* 加载旋转 */
@keyframes icon-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}
.icon-loading {
  animation: icon-spin 1s linear infinite;
}

/* 成功弹入 */
@keyframes icon-pop {
  0%   { transform: scale(0); opacity: 0; }
  60%  { transform: scale(1.1); opacity: 1; }
  100% { transform: scale(1); }
}
.icon-success {
  animation: icon-pop 400ms cubic-bezier(0.22, 1, 0.36, 1);
}
```

---

## 命名规范

### 文件命名
```
icon-[name]-[size].svg

示例：
icon-home-24.svg
icon-camera-32.svg
icon-takeout-48.svg
icon-medal-gold-64.svg
```

### CSS类命名
```
.icon-{name}           → 基础类
.icon-{name}--{size}   → 尺寸变体
.icon-{name}--active   → 激活态
.icon-{name}--disabled → 禁用态

示例：
.icon-home
.icon-home--24
.icon-home--active
.icon-like--active
```

---

## SVG规范

### 画布与视口
```xml
<!-- 标准 24px 图标 -->
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">

<!-- 标准 48px 图标 -->
<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 48 48" fill="none">
```

### 描边属性
```xml
stroke="currentColor"
stroke-width="2"
stroke-linecap="round"
stroke-linejoin="round"
```

### 面性填充
```xml
<!-- 使用渐变 -->
<defs>
  <linearGradient id="brand-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
    <stop offset="0%" stop-color="#FF8A6B" />
    <stop offset="100%" stop-color="#FF6B4A" />
  </linearGradient>
</defs>
<path fill="url(#brand-gradient)" d="..." />
```

### 可访问性
```xml
<!-- 装饰性图标 -->
<svg aria-hidden="true" ...>

<!-- 功能性图标 -->
<svg role="img" aria-label="拍照检测" ...>
```

---

## 实现方案

### 方案选择：SVG Symbol + CSS Class

> 微信小程序原生支持 SVG，使用 Symbol 方案实现图标复用与样式控制。

**优势**：
- SVG 矢量缩放无失真
- Symbol 复用减少重复代码
- CSS `currentColor` 支持主题切换
- 支持动画与交互态

**目录结构**：
```
src/frontend/src/
├── assets/icons/           # 原始 SVG 文件
│   ├── icon-home-24.svg
│   ├── icon-camera-32.svg
│   └── ...
├── components/Icon/        # Icon 组件
│   ├── index.tsx
│   └── index.scss
└── styles/
    └── icons.scss          # 图标样式系统
```

---

## 版本记录

| 版本 | 日期 | 变更 |
|------|------|------|
| v1.0 | 2025-04-30 | 初始版本，定义完整图标系统 |
