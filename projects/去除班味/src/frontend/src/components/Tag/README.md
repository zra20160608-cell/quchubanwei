# Tag 标签组件

## 概述
情绪标签组件，根据班味浓度显示不同颜色。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'default' \| 'fresh' \| 'tipsy' \| 'strong' \| 'extreme' \| 'brand' | 'default' | 标签颜色变体 |
| size | 'sm' \| 'md' | 'md' | 标签尺寸 |

## 使用示例

```tsx
import { Tag } from '@/components'

// 根据分数显示情绪标签
<Tag variant="fresh">清新脱俗</Tag>
<Tag variant="tipsy">微醺班味</Tag>
<Tag variant="strong">班味浓郁</Tag>
<Tag variant="extreme">腌入味了</Tag>
```

## 设计规范
- 完全圆角（pill 形状）
- 情绪色与浓度分数对应
- 小号用于列表，中号用于卡片标题旁
