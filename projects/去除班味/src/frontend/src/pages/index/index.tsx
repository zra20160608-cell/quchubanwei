import Taro from '@tarojs/taro'
import { useState } from 'react'
import { View, Text, Image, ScrollView } from '@tarojs/components'
import { Button, Card, Tag } from '@/components'
import './index.scss'

const mockHistory = [
  { id: 1, score: 72, date: '今天', level: 'strong', label: '班味浓郁' },
  { id: 2, score: 45, date: '昨天', level: 'tipsy', label: '微醺班味' },
  { id: 3, score: 28, date: '3天前', level: 'fresh', label: '清新脱俗' }
]

export default function IndexPage() {
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return '早上好，打工人'
    if (hour < 18) return '下午好，摸鱼人'
    return '晚上好，加班侠'
  })

  const handleDetect = () => {
    Taro.navigateTo({ url: '/pages/detect/index' })
  }

  const handleHistoryItem = (item) => {
    Taro.navigateTo({ url: `/pages/report/index?id=${item.id}` })
  }

  return (
    <View className="page home-page">
      {/* 顶部欢迎区 */}
      <View className="home-page__header animate-slide-up">
        <Text className="home-page__greeting font-display">{greeting}</Text>
        <Text className="home-page__subtitle">今天你的班味有多重？</Text>
      </View>

      {/* 核心拍照按钮 */}
      <View className="home-page__cta animate-slide-up" style={{ animationDelay: '80ms' }}>
        <View className="detect-button" onClick={handleDetect}>
          <View className="detect-button__ring" />
          <View className="detect-button__inner">
            <Text className="detect-button__icon">📷</Text>
            <Text className="detect-button__text">测班味</Text>
          </View>
        </View>
        <Text className="home-page__hint">点击拍照，AI智能分析</Text>
      </View>

      {/* 最近记录 */}
      <View className="home-page__history animate-slide-up" style={{ animationDelay: '160ms' }}>
        <View className="home-page__section-header">
          <Text className="home-page__section-title">最近检测</Text>
          <Text className="home-page__section-more" onClick={() => Taro.navigateTo({ url: '/pages/detect/history' })}">查看全部 →</Text>
        </View>

        <ScrollView
          scrollX
          className="home-page__history-scroll"
          showScrollbar={false}
        >
          {mockHistory.map((item) => (
            <Card
              key={item.id}
              variant="default"
              padding="sm"
              className="history-card"
              onClick={() => handleHistoryItem(item)}
            >
              <View className="history-card__score">{item.score}</View>
              <Tag variant={item.level} size="sm">{item.label}</Tag>
              <Text className="history-card__date">{item.date}</Text>
            </Card>
          ))}
        </ScrollView>
      </View>

      {/* 功能说明 */}
      <View className="home-page__features animate-slide-up" style={{ animationDelay: '240ms' }}>
        <View className="feature-item">
          <Text className="feature-item__icon">☕</Text>
          <Text className="feature-item__text">AI识别</Text>
        </View>
        <View className="feature-item">
          <Text className="feature-item__icon">📊</Text>
          <Text className="feature-item__text">多维分析</Text>
        </View>
        <View className="feature-item">
          <Text className="feature-item__icon">🎯</Text>
          <Text className="feature-item__text">个性方案</Text>
        </View>
      </View>
    </View>
  )
}
