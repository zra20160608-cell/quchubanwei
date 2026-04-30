import Taro from '@tarojs/taro'
import { View, Text, Canvas, ScrollView } from '@tarojs/components'
import { useState, useMemo } from 'react'
import { Button } from '@/components'
import './poster.scss'

type PosterTemplate = 'vintage' | 'diagnosis' | 'magazine' | 'minimal'

interface TemplateConfig {
  key: PosterTemplate
  name: string
  icon: string
  bgColor: string
  accentColor: string
  textColor: string
  fontFamily: string
}

const templates: TemplateConfig[] = [
  {
    key: 'vintage',
    name: '复古档案',
    icon: '📁',
    bgColor: '#F5E6C8',
    accentColor: '#8B4513',
    textColor: '#3E2723',
    fontFamily: 'serif'
  },
  {
    key: 'diagnosis',
    name: '诊断书',
    icon: '🏥',
    bgColor: '#FFFFFF',
    accentColor: '#E74C3C',
    textColor: '#2C3E50',
    fontFamily: 'sans-serif'
  },
  {
    key: 'magazine',
    name: '潮流杂志',
    icon: '🔥',
    bgColor: '#FF6B6B',
    accentColor: '#FFFFFF',
    textColor: '#FFFFFF',
    fontFamily: 'sans-serif'
  },
  {
    key: 'minimal',
    name: '极简艺术',
    icon: '◻️',
    bgColor: '#FAFAFA',
    accentColor: '#000000',
    textColor: '#333333',
    fontFamily: 'sans-serif'
  }
]

const mockReportData = {
  score: 78,
  level: '班味浓郁',
  levelColor: '#E67E22',
  comment: '这工位，一看就是住公司了',
  dimensions: [
    { name: '眼神空洞度', score: 85 },
    { name: '工位混乱度', score: 92 },
    { name: '咖啡依赖度', score: 70 },
    { name: '外卖堆积度', score: 88 },
    { name: '肩膀僵硬度', score: 75 },
    { name: '消息未读数', score: 60 }
  ],
  qrText: '扫码检测你的班味'
}

export default function PosterPage() {
  const [activeTemplate, setActiveTemplate] = useState<PosterTemplate>('vintage')
  const canvasId = useMemo(() => `poster-${Math.random().toString(36).slice(2)}`, [])

  const currentTemplate = templates.find(t => t.key === activeTemplate) || templates[0]

  const drawPoster = () => {
    const ctx = Taro.createCanvasContext(canvasId)
    const width = 750
    const height = 1000
    const { bgColor, accentColor, textColor } = currentTemplate

    // 背景
    ctx.fillStyle = bgColor
    ctx.fillRect(0, 0, width, height)

    // 根据模板绘制不同装饰
    if (activeTemplate === 'vintage') {
      // 复古边框
      ctx.strokeStyle = accentColor
      ctx.lineWidth = 4
      ctx.strokeRect(30, 30, width - 60, height - 60)
      ctx.strokeStyle = accentColor + '66'
      ctx.lineWidth = 2
      ctx.strokeRect(40, 40, width - 80, height - 80)
    } else if (activeTemplate === 'diagnosis') {
      // 诊断书红十字
      ctx.fillStyle = accentColor
      ctx.fillRect(0, 0, width, 120)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 48rpx sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('班味诊断书', width / 2, 75)
    } else if (activeTemplate === 'magazine') {
      // 杂志几何装饰
      ctx.fillStyle = '#FFFFFF33'
      ctx.fillRect(0, 0, width, 200)
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 72rpx sans-serif'
      ctx.textAlign = 'left'
      ctx.fillText('BANWEI', 40, 140)
      ctx.font = '28rpx sans-serif'
      ctx.fillText('MAGAZINE', 40, 180)
    }

    // 分数大字
    ctx.fillStyle = activeTemplate === 'magazine' ? accentColor : textColor
    ctx.font = `bold 180rpx ${currentTemplate.fontFamily}`
    ctx.textAlign = 'center'
    ctx.fillText(String(mockReportData.score), width / 2, 420)

    // 标签
    ctx.fillStyle = mockReportData.levelColor
    ctx.font = 'bold 48rpx sans-serif'
    ctx.fillText(mockReportData.level, width / 2, 500)

    // 辣评
    ctx.fillStyle = textColor
    ctx.font = `italic 36rpx ${currentTemplate.fontFamily}`
    ctx.fillText(`"${mockReportData.comment}"`, width / 2, 580)

    // 维度列表（简化展示）
    ctx.font = '32rpx sans-serif'
    ctx.textAlign = 'left'
    const dimStartY = 650
    mockReportData.dimensions.forEach((dim, i) => {
      const y = dimStartY + i * 50
      ctx.fillStyle = textColor
      ctx.fillText(dim.name, 80, y)
      ctx.fillStyle = mockReportData.levelColor
      ctx.fillRect(350, y - 20, dim.score * 3, 24)
      ctx.fillStyle = textColor
      ctx.fillText(`${dim.score}`, 360 + dim.score * 3 + 10, y)
    })

    // 底部二维码区
    ctx.fillStyle = textColor + '88'
    ctx.font = '28rpx sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText(mockReportData.qrText, width / 2, 920)
    ctx.fillText('—— 去除班味小程序 ——', width / 2, 960)

    ctx.draw()
  }

  const handleTemplateChange = (template: PosterTemplate) => {
    setActiveTemplate(template)
    setTimeout(drawPoster, 100)
  }

  const handleSavePoster = () => {
    Taro.showLoading({ title: '保存中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '已保存到相册', icon: 'success' })
    }, 1000)
  }

  const handleSharePoster = () => {
    Taro.showShareImageMenu({
      path: '' // 实际应该用 canvasToTempFilePath 获取
    })
  }

  return (
    <View className='page poster-page'>
      <ScrollView className='poster-page__scroll' scrollY>
        {/* 海报预览 */}
        <View className='poster-page__preview'>
          <Canvas
            canvasId={canvasId}
            style={{ width: '750rpx', height: '1000rpx' }}
            className='poster-page__canvas'
            onReady={drawPoster}
          />
        </View>

        {/* 模板切换 */}
        <View className='poster-page__templates'>
          <Text className='poster-page__section-title'>🎨 选择模板</Text>
          <View className='template-list'>
            {templates.map(template => (
              <View
                key={template.key}
                className={`template-item ${activeTemplate === template.key ? 'template-item--active' : ''}`}
                onClick={() => handleTemplateChange(template.key)}
              >
                <View
                  className='template-item__preview'
                  style={{ backgroundColor: template.bgColor, borderColor: template.accentColor }}
                >
                  <Text className='template-item__icon'>{template.icon}</Text>
                </View>
                <Text className='template-item__name'>{template.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 模板说明 */}
        <View className='poster-page__template-info'>
          <Text className='template-info__text'>
            {activeTemplate === 'vintage' && '90年代Office档案风，复古打字机字体 + 泛黄纸张纹理'}
            {activeTemplate === 'diagnosis' && '医院诊断单戏仿风，带红十字和手写体签名区'}
            {activeTemplate === 'magazine' && '潮流时尚杂志风，大字排版 + 几何图形装饰'}
            {activeTemplate === 'minimal' && '极简主义ins风，大量留白 + 纯文字排版'}
          </Text>
        </View>

        {/* 操作按钮 */}
        <View className='poster-page__actions'>
          <Button variant='primary' fullWidth onClick={handleSavePoster}>
            💾 保存到相册
          </Button>
          <Button variant='secondary' fullWidth onClick={handleSharePoster}>
            📤 分享给好友
          </Button>
        </View>

        <View className='poster-page__bottom' />
      </ScrollView>
    </View>
  )
}
