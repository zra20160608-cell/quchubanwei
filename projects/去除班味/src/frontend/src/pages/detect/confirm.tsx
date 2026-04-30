import Taro from '@tarojs/taro'
import { View, Text, Image, Button, Picker } from '@tarojs/components'
import { useState } from 'react'
import { useRecoilState } from 'recoil'
import { detectTaskState } from '../../stores'
import './index.scss'

export default function DetectConfirm() {
  const [detectTask, setDetectTask] = useRecoilState(detectTaskState)
  const [workYears, setWorkYears] = useState('1-3')
  const [jobType, setJobType] = useState('技术')

  const workYearsOptions = ['<1年', '1-3年', '3-5年', '5年+']
  const jobTypeOptions = ['技术', '产品', '运营', '设计', '销售', '其他']

  const handleWorkYearsChange = (e: any) => {
    setWorkYears(workYearsOptions[e.detail.value])
  }

  const handleJobTypeChange = (e: any) => {
    setJobType(jobTypeOptions[e.detail.value])
  }

  const handleRetake = () => {
    Taro.navigateBack()
  }

  const handleConfirm = () => {
    // 保存补充信息
    setDetectTask(prev => ({
      ...prev,
      extraInfo: {
        workYears,
        jobType
      }
    }))

    // 跳转到分析中页
    Taro.navigateTo({
      url: '/pages/detect/analyzing'
    })
  }

  return (
    <View className='confirm-page'>
      {/* 图片预览 */}
      <View className='image-preview'>
        <Image 
          className='preview-image' 
          src={detectTask.imageUrl} 
          mode='aspectFit'
        />
      </View>

      {/* 补充信息 */}
      <View className='info-section'>
        <Text className='section-title'>补充信息（选填）</Text>
        
        <View className='form-item'>
          <Text className='label'>工作年限</Text>
          <Picker mode='selector' range={workYearsOptions} onChange={handleWorkYearsChange}>
            <View className='picker'>
              <Text>{workYears}</Text>
              <Text className='arrow'>▼</Text>
            </View>
          </Picker>
        </View>

        <View className='form-item'>
          <Text className='label'>岗位类型</Text>
          <Picker mode='selector' range={jobTypeOptions} onChange={handleJobTypeChange}>
            <View className='picker'>
              <Text>{jobType}</Text>
              <Text className='arrow'>▼</Text>
            </View>
          </Picker>
        </View>
      </View>

      {/* 操作按钮 */}
      <View className='action-section'>
        <Button className='btn-retake' onClick={handleRetake}>
          重新拍摄
        </Button>
        <Button className='btn-confirm' onClick={handleConfirm}>
          确认分析
        </Button>
      </View>
    </View>
  )
}
