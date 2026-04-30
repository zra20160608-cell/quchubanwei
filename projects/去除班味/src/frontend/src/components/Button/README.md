# Button 按钮组件

## 概述
通用按钮组件，支持多种变体、尺寸和状态。

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| variant | 'primary' \| 'secondary' \| 'ghost' \| 'danger' | 'primary' | 按钮样式变体 |
| size | 'sm' \| 'md' \| 'lg' | 'md' | 按钮尺寸 |
| disabled | boolean | false | 是否禁用 |
| loading | boolean | false | 是否加载中 |
| fullWidth | boolean | false | 是否占满宽度 |
| rounded | boolean | true | 是否圆角 |

## 使用示例

```tsx
import { Button } from '@/components'

// 主按钮
<Button onClick={handleDetect}>开始检测</Button>

// 次按钮
<Button variant="secondary">查看历史</Button>

// 加载状态
<Button loading>分析中...</Button>

// 幽灵按钮
<Button variant="ghost">跳过</Button>
```

## 设计规范
- 主按钮使用品牌珊瑚橙色
- 按钮最小触摸目标 88rpx
- 包含 press 状态反馈（scale 0.98）
