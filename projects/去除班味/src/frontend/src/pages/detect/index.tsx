import { View, Text } from '@tarojs/components'
import { Button } from '@/components'
import './index.scss'

export default function DetectPage() {
  return (
    <View className="page page-no-tab detect-page">
      <View className="detect-page__header">
        <Text className="detect-page__title">检测班味</Text>
      </View>

      <View className="detect-page__scenes">
        <Text className="detect-page__label">选择场景</Text>
        <View className="scene-tabs">
          <View className="scene-tab scene-tab--active">工位检测</View>
          <View className="scene-tab">自拍检测</View>
          <View className="scene-tab">桌面检测</View>
        </View>
      </View>

      <View className="detect-page__camera">
        <View className="camera-placeholder">
          <Text className="camera-placeholder__icon">📷</Text>
          <Text className="camera-placeholder__text">点击拍照或选择相册</Text>
        </View>
      </View>

      <View className="detect-page__actions">
        <Button variant="primary" fullWidth size="lg">
          拍照
        </Button>
        <Button variant="secondary" fullWidth>
          从相册选择
        </Button>
      </View>
    </View>
  )
}
