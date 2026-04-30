import Taro from '@tarojs/taro'
import { View, Text, Image, Button, ScrollView } from '@tarojs/components'
import { useRecoilState } from 'recoil'
import { detectTaskState } from '../../stores'
import { generatePoster } from '../../services/detect'
import './index.scss'

export default function DetectReport() {
  const [detectTask] = useRecoilState(detectTaskState)
  const [posterUrl, setPosterUrl] = useState('')

  // Mock报告数据（实际从API获取）
  const report = {
    score: 72,
    level: '班味浓郁',
    levelColor: '#E67E22',
    elements: [
      { id: 'E001', name: '外卖盒', weight: 15, icon: '🥡' },
      { id: 'E003', name: '凌乱桌面', weight: 10, icon: '📚' },
      { id: 'E008', name: '黑眼圈', weight: 15, icon: '🐼' },
      { id: 'E012', name: '多屏幕', weight: 10, icon: '🖥️' }
    ],
    dimensions: {
      fatigue: 75,
      chaos: 80,
      repetition: 65,
      concentration: 72
    },
    comments: [
      '检测到12个班味元素，建议直接申请工伤',
      '您的工位风水极佳——四面楚歌，八面玲珑',
      '这黑眼圈，说是在通宵蹦迪我都信'
    ]
  }

  // 生成分享海报
  const handleShare = async () => {
    Taro.showLoading({ title: '生成海报中...' })
    try {
      const res = await generatePoster(detectTask.taskId || 'DET_001')
      setPosterUrl(res.posterUrl)
      Taro.hideLoading()
      
      // 唤起分享
      Taro.showShareImageMenu({
        path: res.posterUrl
      })
    } catch (error) {
      Taro.hideLoading()
      Taro.showToast({ title: '生成失败', icon: 'none' })
    }
  }

  // 获取方案
  const handleGetPlan = () => {
    Taro.switchTab({ url: '/pages/plans/index' })
  }

  // 再测一次
  const handleRetest = () => {
    Taro.navigateBack({ delta: 3 })
  }

  return (
    <ScrollView className='report-page' scrollY>
      {/* 浓度评分 */}
      <View className='score-section'>
        <View className='score-circle' style={{ borderColor: report.levelColor }}>
          <Text className='score-number' style={{ color: report.levelColor }}>{report.score}</Text>
          <Text className='score-label'>班味浓度</Text>
        </View>
        <View className='level-badge' style={{ backgroundColor: report.levelColor }}>
          <Text className='level-text'>{report.level}</Text>
        </View>
      </View>

      {/* 雷达图（简化版） */}
      <View className='radar-section'>
        <Text className='section-title'>四维诊断</Text>
        <View className='dimensions'>
          {Object.entries(report.dimensions).map(([key, value]) => (
            <View key={key} className='dimension-item'>
              <Text className='dim-name'>
                {key === 'fatigue' ? '疲惫指数' : 
                 key === 'chaos' ? '混乱指数' : 
                 key === 'repetition' ? '重复指数' : '班味浓度'}
              </Text>
              <View className='dim-bar'>
                <View className='dim-fill' style={{ width: `${value}%`, backgroundColor: report.levelColor }} />
              </View>
              <Text className='dim-value'>{value}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 元素清单 */}
      <View className='elements-section'>
        <Text className='section-title'>检测到的班味元素</Text>
        <View className='elements-list'>
          {report.elements.map(el => (
            <View key={el.id} className='element-card'>
              <Text className='element-icon'>{el.icon}</Text>
              <View className='element-info'>
                <Text className='element-name'>{el.name}</Text>
                <Text className='element-weight'>+{el.weight}分</Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 辣评 */}
      <View className='comments-section'>
        <Text className='section-title'>AI辣评</Text>
        {report.comments.map((comment, index) => (
          <View key={index} className='comment-card'>
            <Text className='comment-text'>💬 {comment}</Text>
          </View>
        ))}
      </View>

      {/* 操作按钮 */}
      <View className='action-section'>
        <Button className='btn-share' onClick={handleShare}>
          📤 生成海报分享
        </Button>
        <Button className='btn-plan' onClick={handleGetPlan}>
          🎯 获取去班味方案
        </Button>
        <Button className='btn-retest' onClick={handleRetest}>
          🔄 再测一次
        </Button>
      </View>
    </ScrollView>
  )
}
