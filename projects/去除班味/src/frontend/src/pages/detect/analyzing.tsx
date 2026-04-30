import Taro from '@tarojs/taro'
import { View, Text, Image, Progress } from '@tarojs/components'
import { useEffect, useState } from 'react'
import { useRecoilState } from 'recoil'
import { detectTaskState } from '../../stores'
import { getUploadToken, createDetectTask, getDetectStatus } from '../../services/detect'
import './index.scss'

export default function DetectAnalyzing() {
  const [detectTask, setDetectTask] = useRecoilState(detectTaskState)
  const [progress, setProgress] = useState(0)
  const [statusText, setStatusText] = useState('正在上传图片...')
  const [tips, setTips] = useState('')

  const statusTexts = [
    '正在识别班味元素...',
    '分析职场疲惫指数...',
    '计算混乱程度...',
    '生成辣评文案...',
    '组装诊断报告...'
  ]

  const funTips = [
    '正在计算你的打工年限...',
    '检测工位风水方位...',
    '扫描外卖盒数量...',
    '分析黑眼圈浓度...',
    '评估桌面混乱指数...',
    '计算颈椎受损程度...'
  ]

  useEffect(() => {
    startAnalysis()
  }, [])

  const startAnalysis = async () => {
    try {
      // 1. 获取OSS上传凭证
      const tokenRes = await getUploadToken({
        filename: detectTask.imageUrl.split('/').pop(),
        size: 1024 * 1024 // 假设1MB
      })

      // 2. 上传图片到OSS
      await uploadToOSS(detectTask.imageUrl, tokenRes)

      // 3. 创建检测任务
      const imageUrl = `https://cdn.example.com/${tokenRes.key}`
      const taskRes = await createDetectTask({
        imageUrl,
        sceneType: 'DESK',
        extraInfo: {}
      })

      setDetectTask(prev => ({
        ...prev,
        taskId: taskRes.taskId,
        status: 'analyzing'
      }))

      // 4. 模拟进度动画
      simulateProgress(taskRes.taskId)

    } catch (error) {
      Taro.showToast({ title: '分析失败，请重试', icon: 'none' })
      setDetectTask(prev => ({ ...prev, status: 'failed_analysis' }))
    }
  }

  const uploadToOSS = async (filePath: string, token: any) => {
    // 实际实现：使用OSS SDK上传
    // 这里模拟上传
    return new Promise((resolve) => setTimeout(resolve, 1000))
  }

  const simulateProgress = (taskId: string) => {
    let currentProgress = 0
    const interval = setInterval(() => {
      currentProgress += Math.random() * 15 + 5
      if (currentProgress >= 100) {
        currentProgress = 100
        clearInterval(interval)
        
        // 分析完成，跳转到报告页
        setTimeout(() => {
          setDetectTask(prev => ({
            ...prev,
            status: 'completed',
            progress: 100
          }))
          Taro.redirectTo({ url: '/pages/detect/report' })
        }, 500)
      }
      
      setProgress(Math.min(currentProgress, 100))
      
      // 更新状态文字
      const statusIndex = Math.floor((currentProgress / 100) * statusTexts.length)
      setStatusText(statusTexts[Math.min(statusIndex, statusTexts.length - 1)])
      
      // 随机更新趣味提示
      if (Math.random() > 0.7) {
        setTips(funTips[Math.floor(Math.random() * funTips.length)])
      }
    }, 800)
  }

  return (
    <View className='analyzing-page'>
      {/* AI侦探角色 */}
      <View className='detective-area'>
        <View className='detective-avatar'>🕵️</View>
        <Text className='detective-name'>班味侦探</Text>
      </View>

      {/* 扫描动画 */}
      <View className='scan-area'>
        <View className='scan-line' style={{ top: `${progress}%` }} />
        <Image className='preview-image' src={detectTask.imageUrl} mode='aspectFit' />
      </View>

      {/* 进度 */}
      <View className='progress-area'>
        <Progress percent={progress} strokeWidth={8} activeColor='#FF6B6B' />
        <Text className='progress-text'>{Math.round(progress)}%</Text>
      </View>

      {/* 状态文字 */}
      <View className='status-area'>
        <Text className='status-text'>{statusText}</Text>
        {tips && <Text className='tips-text'>{tips}</Text>}
      </View>

      {/* 超过5秒提示 */}
      {progress > 60 && (
        <View className='hint-area'>
          <Text className='hint-text'>后台分析中，可离开小程序，完成后推送通知</Text>
        </View>
      )}
    </View>
  )
}
