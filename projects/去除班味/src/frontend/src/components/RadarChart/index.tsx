import React, { useMemo } from 'react'
import { View, Canvas } from '@tarojs/components'
import Taro from '@tarojs/taro'
import './index.scss'

export interface RadarDimension {
  name: string
  key: string
  score: number
  max?: number
}

export interface RadarChartProps {
  dimensions: RadarDimension[]
  score: number
  size?: number
  className?: string
}

const RadarChart: React.FC<RadarChartProps> = ({
  dimensions,
  score,
  size = 300,
  className
}) => {
  const canvasId = useMemo(() => `radar-${Math.random().toString(36).slice(2)}`, [])

  // 获取情绪色
  const getEmotionColor = () => {
    if (score <= 30) return '#4ECDC4' // fresh
    if (score <= 60) return '#F39C12' // tipsy
    if (score <= 85) return '#E67E22' // strong
    return '#C0392B' // extreme
  }

  React.useEffect(() => {
    const ctx = Taro.createCanvasContext(canvasId)
    if (!ctx) return

    const centerX = size / 2
    const centerY = size / 2
    const radius = (size / 2) * 0.75
    const levels = 5
    const angleStep = (Math.PI * 2) / dimensions.length
    const startAngle = -Math.PI / 2

    // 清空画布
    ctx.clearRect(0, 0, size, size)

    // 绘制网格
    ctx.strokeStyle = 'rgba(0,0,0,0.08)'
    ctx.lineWidth = 1

    for (let i = 1; i <= levels; i++) {
      const r = (radius / levels) * i
      ctx.beginPath()
      for (let j = 0; j < dimensions.length; j++) {
        const angle = startAngle + j * angleStep
        const x = centerX + r * Math.cos(angle)
        const y = centerY + r * Math.sin(angle)
        if (j === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }

    // 绘制轴线
    ctx.strokeStyle = 'rgba(0,0,0,0.06)'
    for (let i = 0; i < dimensions.length; i++) {
      const angle = startAngle + i * angleStep
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(
        centerX + radius * Math.cos(angle),
        centerY + radius * Math.sin(angle)
      )
      ctx.stroke()
    }

    // 绘制数据区域
    const emotionColor = getEmotionColor()
    ctx.beginPath()
    dimensions.forEach((dim, i) => {
      const angle = startAngle + i * angleStep
      const value = (dim.score / (dim.max || 100)) * radius
      const x = centerX + value * Math.cos(angle)
      const y = centerY + value * Math.sin(angle)
      if (i === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })
    ctx.closePath()

    // 填充
    ctx.fillStyle = emotionColor + '33' // 20% opacity
    ctx.fill()

    // 描边
    ctx.strokeStyle = emotionColor
    ctx.lineWidth = 3
    ctx.stroke()

    // 绘制数据点
    dimensions.forEach((dim, i) => {
      const angle = startAngle + i * angleStep
      const value = (dim.score / (dim.max || 100)) * radius
      const x = centerX + value * Math.cos(angle)
      const y = centerY + value * Math.sin(angle)

      ctx.beginPath()
      ctx.arc(x, y, 6, 0, Math.PI * 2)
      ctx.fillStyle = '#fff'
      ctx.fill()
      ctx.strokeStyle = emotionColor
      ctx.lineWidth = 3
      ctx.stroke()
    })

    // 绘制标签
    ctx.font = '24rpx sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillStyle = '#666'

    dimensions.forEach((dim, i) => {
      const angle = startAngle + i * angleStep
      const labelRadius = radius + 40
      const x = centerX + labelRadius * Math.cos(angle)
      const y = centerY + labelRadius * Math.sin(angle)
      ctx.fillText(dim.name, x, y)
    })

    ctx.draw()
  }, [dimensions, score, size, canvasId])

  return (
    <View className={`bw-radar-chart ${className || ''}`}>
      <Canvas
        canvasId={canvasId}
        style={{ width: `${size}rpx`, height: `${size}rpx` }}
        className="bw-radar-chart__canvas"
      />
      <View className="bw-radar-chart__dimensions">
        {dimensions.map((dim) => (
          <View key={dim.key} className="bw-radar-chart__dimension">
            <View
              className="bw-radar-chart__dot"
              style={{ backgroundColor: getEmotionColor() }}
            />
            <View className="bw-radar-chart__label">{dim.name}</View>
            <View className="bw-radar-chart__score">{dim.score}</View>
          </View>
        ))}
      </View>
    </View>
  )
}

export default RadarChart