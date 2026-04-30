# 去除班味 — 设计系统文档

## 品牌概述
「去除班味」是一款面向95后/00后职场新生代的AI图像分析+社交互动小程序。品牌个性轻松、幽默、治愈，视觉方向为活泼治愈系+轻度复古（90年代Office美学）。

## 设计原则
1. **幽默优先** — 从配色到图标到文案，每个细节都要让人会心一笑
2. **降低班味** — 界面本身就不能有"班味"，拒绝刻板、拒绝沉重、拒绝无趣
3. **社交基因** — 每个功能都要考虑"分享欲"，生成内容天生适合发朋友圈
4. **情绪曲线** — 从"检测时的紧张"→"看到辣评的笑"→"获得方案的暖"
5. **轻量化** — 操作简单、流程短、反馈即时，适合摸鱼场景

---

## 色彩系统（OKLCH）

### 品牌色
```css
--color-brand: oklch(65% 0.18 45);       /* 珊瑚橙 - 温暖活力 */
--color-brand-light: oklch(75% 0.12 45); /* 浅珊瑚 */
--color-brand-dark: oklch(55% 0.20 45);  /* 深珊瑚 */
--color-brand-muted: oklch(85% 0.06 45); /* 淡珊瑚背景 */
```

### 情绪色（班味浓度色标）
```css
/* 清新脱俗 (0-30分) */
--color-fresh: oklch(75% 0.12 160);       /* 薄荷绿 */
--color-fresh-light: oklch(90% 0.06 160);
--color-fresh-bg: oklch(96% 0.03 160);

/* 微醺班味 (31-60分) */
--color-tipsy: oklch(80% 0.14 85);        /* 暖黄 */
--color-tipsy-light: oklch(92% 0.08 85);
--color-tipsy-bg: oklch(97% 0.04 85);

/* 班味浓郁 (61-85分) */
--color-strong: oklch(65% 0.18 45);       /* 珊瑚橙 */
--color-strong-light: oklch(85% 0.10 45);
--color-strong-bg: oklch(96% 0.05 45);

/* 腌入味了 (86-100分) */
--color-extreme: oklch(50% 0.20 25);      /* 深红紫 */
--color-extreme-light: oklch(75% 0.12 25);
--color-extreme-bg: oklch(95% 0.05 25);
```

### 中性色（偏暖橙色调）
```css
--color-white: oklch(99% 0.005 45);
--color-surface: oklch(97% 0.008 45);
--color-surface-raised: oklch(100% 0.004 45);
--color-border: oklch(88% 0.015 45);
--color-border-subtle: oklch(93% 0.008 45);

/* 文字色 */
--color-text-primary: oklch(25% 0.02 45);
--color-text-secondary: oklch(45% 0.03 45);
--color-text-tertiary: oklch(60% 0.02 45);
--color-text-inverse: oklch(99% 0.005 45);
```

### 功能色
```css
--color-success: oklch(65% 0.14 145);
--color-warning: oklch(75% 0.16 80);
--color-error: oklch(55% 0.20 25);
--color-info: oklch(65% 0.12 240);
```

---

## 字体系统

### 字体选择
- **Display/标题**: 站酷快乐体 (ZCOOL KuaiLe) — 活泼圆润，自带"不正经"气质
- **正文**: 霞鹜文楷 (LXGW WenKai) — 温暖人文，阅读舒适
- **Fallback栈**: 'PingFang SC', 'Microsoft YaHei', system-ui, sans-serif

### 字号层级（小程序使用固定rem）
```css
/* 标题层级 */
--text-hero: 2rem;      /* 32px - 页面大标题 */
--text-display: 1.5rem; /* 24px - 区块标题 */
--text-heading: 1.25rem;/* 20px - 卡片标题 */
--text-subheading: 1.125rem; /* 18px - 副标题 */

/* 正文层级 */
--text-body: 1rem;      /* 16px - 正文 */
--text-small: 0.875rem;/* 14px - 次要文字 */
--text-caption: 0.75rem; /* 12px - 标注/时间戳 */

/* 特殊 */
--text-score: 4rem;     /* 64px - 分数展示 */
--text-emoji: 3rem;     /* 48px - 表情符号 */
```

### 行高
```css
--leading-tight: 1.2;   /* 标题 */
--leading-normal: 1.5;  /* 正文 */
--leading-relaxed: 1.75;/* 长文本 */
```

---

## 间距系统（4pt基准）
```css
--space-1: 0.25rem;   /* 4px */
--space-2: 0.5rem;    /* 8px */
--space-3: 0.75rem;   /* 12px */
--space-4: 1rem;      /* 16px */
--space-5: 1.25rem;   /* 20px */
--space-6: 1.5rem;    /* 24px */
--space-8: 2rem;      /* 32px */
--space-10: 2.5rem;   /* 40px */
--space-12: 3rem;     /* 48px */
--space-16: 4rem;     /* 64px */
```

---

## 圆角系统
```css
--radius-sm: 0.5rem;   /* 8px - 小标签 */
--radius-md: 0.75rem;  /* 12px - 按钮/输入框 */
--radius-lg: 1rem;     /* 16px - 卡片 */
--radius-xl: 1.25rem;  /* 20px - 大卡片 */
--radius-2xl: 1.5rem;  /* 24px - 模态/海报 */
--radius-full: 9999px; /* 完全圆角 */
```

---

## 阴影系统
```css
--shadow-sm: 0 1px 2px oklch(0% 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px oklch(0% 0 0 / 0.08), 0 2px 4px -1px oklch(0% 0 0 / 0.04);
--shadow-lg: 0 10px 15px -3px oklch(0% 0 0 / 0.08), 0 4px 6px -2px oklch(0% 0 0 / 0.04);
--shadow-xl: 0 20px 25px -5px oklch(0% 0 0 / 0.08), 0 10px 10px -5px oklch(0% 0 0 / 0.03);
--shadow-inner: inset 0 2px 4px oklch(0% 0 0 / 0.05);
```

---

## 组件规范

### 按钮
```
Primary Button:
- 背景: --color-brand
- 文字: --color-text-inverse
- 圆角: --radius-full
- 内边距: --space-3 --space-6
- 字体: --text-body, 500 weight
- 悬停: 背景变深 --color-brand-dark, 轻微上移 transform: translateY(-1px)
- 按下: transform: scale(0.98)

Secondary Button:
- 背景: transparent
- 边框: 1.5px solid --color-brand
- 文字: --color-brand
- 其他同 Primary

Ghost Button:
- 背景: transparent
- 文字: --color-text-secondary
- 无边框
```

### 卡片
```
标准卡片:
- 背景: --color-surface-raised
- 圆角: --radius-lg
- 阴影: --shadow-md
- 内边距: --space-4
- 边框: 1px solid --color-border-subtle

社交卡片（检测报告/分享）:
- 背景: 渐变或纯色情绪色
- 圆角: --radius-xl
- 阴影: --shadow-lg
- 内边距: --space-5
```

### 标签/Tag
```
情绪标签:
- 圆角: --radius-full
- 内边距: --space-1 --space-3
- 字体: --text-caption, 500 weight
- 根据浓度使用对应情绪色背景
```

### 雷达图样式
```
- 网格线: --color-border, 1px
- 数据区域: 情绪色填充, opacity 0.3
- 数据边框: 情绪色, 2px
- 数据点: 白色背景, 情绪色边框, 4px
```

### 进度条/分数条
```
- 背景轨道: --color-border-subtle
- 填充: 情绪色渐变
- 圆角: --radius-full
- 高度: 8px
```

### 底部Tab栏（微信小程序规范）
```
- 高度: 含安全区约 83px
- 背景: --color-surface-raised, backdrop-filter blur(12px)
- 边框: 1px solid --color-border-subtle (顶部)
- Tab图标: 24x24
- 未选中: --color-text-tertiary
- 选中: --color-brand
- 字体: --text-caption
```

---

## 动画与过渡

### 时间规范
```css
--duration-instant: 100ms;    /* 按钮按下 */
--duration-fast: 200ms;       /* 悬停状态 */
--duration-normal: 300ms;     /* 页面过渡 */
--duration-slow: 500ms;       /* 入场动画 */
--duration-loading: 800ms;    /* 加载动画 */
```

### 缓动函数
```css
--ease-out-quart: cubic-bezier(0.25, 1, 0.5, 1);
--ease-out-quint: cubic-bezier(0.22, 1, 0.36, 1);
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
--ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
```

### 常用动画
```css
/* 页面入场 */
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

/* 脉冲（拍照按钮） */
@keyframes pulse-ring {
  0% { transform: scale(1); opacity: 0.6; }
  100% { transform: scale(1.3); opacity: 0; }
}

/* 漂浮（分析中元素） */
@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-10px); }
}

/* 抖动（高分警告） */
@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}
```

---

## 微信小程序适配

### 安全区规范
```css
/* 顶部导航栏 */
--safe-area-top: env(safe-area-inset-top);
/* 底部安全区 */
--safe-area-bottom: env(safe-area-inset-bottom);
```

### 页面结构模板
```css
.page {
  min-height: 100vh;
  padding-bottom: calc(83px + var(--safe-area-bottom));
  background: --color-surface;
}
```

### 导航栏
- 自定义导航栏高度: 44px + safe-area-top
- 标题字体: --text-heading, 500 weight
- 背景: --color-surface-raised / transparent

---

## 图标风格
- 风格: 线性图标 + 部分面性装饰图标
- 描边: 1.5-2px
- 圆角: 圆角端点
- 大小: 20px(小) / 24px(标准) / 32px(大) / 48px(装饰)
- 使用emoji作为情绪装饰元素 ☕ 📎 📝 🖊️

---

## 设计检查清单
- [ ] 没有使用 banned fonts (Inter, Roboto等)
- [ ] 使用OKLCH色彩系统
- [ ] 没有使用 gradient text
- [ ] 没有使用 border-left 作为卡片装饰
- [ ] 没有使用 glassmorphism 过度装饰
- [ ] 动画只使用 transform 和 opacity
- [ ] 考虑 reduced motion
- [ ] 触摸目标最小 44px
- [ ] 文字对比度符合 WCAG AA
