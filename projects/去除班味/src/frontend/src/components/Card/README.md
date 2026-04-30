# Card 卡片组件

## 概述
通用卡片容器，支持多种视觉变体。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'default' \| 'social' \| 'elevated' | 'default' | 卡片样式变体 |
| padding | 'sm' \| 'md' \| 'lg' | 'md' | 内边距大小 |

## 使用示例

```tsx
import { Card } from '@/components'

// 标准卡片
<Card>
  <View>内容</View>
</Card>

// 社交卡片（用于检测报告）
<Card variant="social">
  <View>检测报告内容</View>
</Card>
```

## 设计规范
- 圆角 32rpx（$radius-lg）
- 默认卡片带微妙阴影和边框
- 社交卡片阴影更明显，适合内容展示
