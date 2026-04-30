# RadarChart 雷达图组件

## 概述
班味六维雷达图，用于检测报告展示。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| dimensions | RadarDimension[] | - | 维度数据 |
| score | number | - | 总分（决定颜色） |
| size | number | 300 | 画布大小（rpx） |

## RadarDimension

```typescript
interface RadarDimension {
  name: string    // 维度名称（如"眼神空洞度"）
  key: string     // 唯一标识
  score: number   // 分数 0-100
  max?: number    // 最大值（默认100）
}
```

## 使用示例

```tsx
import { RadarChart } from '@/components'

const dimensions = [
  { name: '眼神空洞度', key: 'eyes', score: 75 },
  { name: '工位混乱度', key: 'desk', score: 60 },
  { name: '咖啡依赖度', key: 'coffee', score: 85 },
  { name: '外卖堆积度', key: 'food', score: 45 },
  { name: '肩膀僵硬度', key: 'body', score: 70 },
  { name: '消息未读数', key: 'message', score: 55 }
]

<RadarChart dimensions={dimensions} score={72} />
```

## 设计规范
- 根据总分自动选择情绪色
- 网格线使用浅灰色
- 数据点白色背景+情绪色边框
- 底部显示维度标签和分数
