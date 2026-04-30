import Taro from '@tarojs/taro'
import { View, Text, Textarea, Image } from '@tarojs/components'
import { useState } from 'react'
import { Button, Tag } from '@/components'
import './publish.scss'

const topicOptions = [
  '#工位大赏', '#班味超标', '#去班味打卡', '#前后对比',
  '#最乱工位大赛', '#清新脱俗', '#工位改造', '#摸鱼日常',
  '#咖啡依赖', '#准点下班'
]

export default function PublishPage() {
  const [content, setContent] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [images, setImages] = useState<string[]>([])
  const [isAnonymous, setIsAnonymous] = useState(true)
  const [postType, setPostType] = useState<'detect_share' | 'checkin' | 'normal'>('normal')

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    )
  }

  const handleChooseImage = () => {
    Taro.chooseImage({
      count: 9 - images.length,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        setImages(prev => [...prev, ...res.tempFilePaths])
      }
    })
  }

  const handleRemoveImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index))
  }

  const handlePublish = () => {
    if (!content.trim()) {
      Taro.showToast({ title: '写点什么吧~', icon: 'none' })
      return
    }
    Taro.showLoading({ title: '发布中...' })
    setTimeout(() => {
      Taro.hideLoading()
      Taro.showToast({ title: '发布成功！', icon: 'success' })
      setTimeout(() => {
        Taro.navigateBack()
      }, 1000)
    }, 1000)
  }

  return (
    <View className='page publish-page'>
      {/* 发布类型 */}
      <View className='publish-page__type-row'>
        {[
          { key: 'normal', label: '普通图文', icon: '📝' },
          { key: 'detect_share', label: '检测分享', icon: '📊' },
          { key: 'checkin', label: '方案打卡', icon: '✅' }
        ].map(type => (
          <View
            key={type.key}
            className={`type-chip ${postType === type.key ? 'type-chip--active' : ''}`}
            onClick={() => setPostType(type.key as any)}
          >
            <Text>{type.icon} {type.label}</Text>
          </View>
        ))}
      </View>

      {/* 内容输入 */}
      <View className='publish-page__input-area'>
        <Textarea
          className='publish-page__textarea'
          placeholder={
            postType === 'detect_share'
              ? '分享你的检测结果，说说感想...'
              : postType === 'checkin'
              ? '记录今天的打卡心得...'
              : '分享你的班味日常...'
          }
          maxlength={500}
          value={content}
          onInput={(e) => setContent(e.detail.value)}
        />
        <Text className='publish-page__char-count'>{content.length}/500</Text>
      </View>

      {/* 图片选择 */}
      <View className='publish-page__images'>
        {images.map((img, i) => (
          <View key={i} className='image-item'>
            <Image className='image-item__img' src={img} mode='aspectFill' />
            <View className='image-item__remove' onClick={() => handleRemoveImage(i)}>
              <Text>✕</Text>
            </View>
          </View>
        ))}
        {images.length < 9 && (
          <View className='image-add' onClick={handleChooseImage}>
            <Text className='image-add__icon'>📷</Text>
            <Text className='image-add__text'>添加图片</Text>
          </View>
        )}
      </View>

      {/* 话题标签 */}
      <View className='publish-page__tags-section'>
        <Text className='publish-page__section-title'>🏷️ 添加话题</Text>
        <View className='publish-page__tags'>
          {topicOptions.map(tag => (
            <View
              key={tag}
              className={`topic-tag ${selectedTags.includes(tag) ? 'topic-tag--active' : ''}`}
              onClick={() => handleTagToggle(tag)}
            >
              <Text>{tag}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* 匿名选项 */}
      <View className='publish-page__anonymous' onClick={() => setIsAnonymous(!isAnonymous)}>
        <View className={`anonymous-checkbox ${isAnonymous ? 'anonymous-checkbox--checked' : ''}`}>
          {isAnonymous && <Text>✓</Text>}
        </View>
        <Text className='anonymous-label'>🐹 匿名发布（显示为随机小动物）</Text>
      </View>

      {/* 发布按钮 */}
      <View className='publish-page__actions'>
        <Button variant='primary' fullWidth onClick={handlePublish}>
          🚀 发布到圈子
        </Button>
      </View>
    </View>
  )
}
