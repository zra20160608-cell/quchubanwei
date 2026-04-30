import Taro from '@tarojs/taro'
import { View, Text, Switch } from '@tarojs/components'
import { useState } from 'react'
import { Card } from '@/components'
import './settings.scss'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    anonymousByDefault: true,
    pushNotify: true,
    soundEffect: true,
    darkMode: false,
    autoShare: false
  })

  const handleToggle = (key: keyof typeof settings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }))
  }

  const handleClearCache = () => {
    Taro.showModal({
      title: '清除缓存',
      content: '确定要清除所有缓存数据吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '缓存已清除', icon: 'success' })
        }
      }
    })
  }

  const handleAbout = () => {
    Taro.showModal({
      title: '关于去除班味',
      content: '版本: 1.0.0\n用AI拯救每一位打工人\n\n© 2024 去除班味团队',
      showCancel: false
    })
  }

  const settingItems = [
    { key: 'anonymousByDefault', label: '默认匿名发布', icon: '🐹', desc: '发布帖子时默认使用匿名身份' },
    { key: 'pushNotify', label: '消息推送', icon: '🔔', desc: '接收打卡提醒和社区通知' },
    { key: 'soundEffect', label: '音效', icon: '🔊', desc: '打卡、检测完成时的趣味音效' },
    { key: 'darkMode', label: '深色模式', icon: '🌙', desc: '护眼深色主题（开发中）' },
    { key: 'autoShare', label: '自动分享', icon: '📤', desc: '检测完成后自动提示分享' }
  ] as { key: keyof typeof settings; label: string; icon: string; desc: string }[]

  return (
    <View className='page settings-page'>
      <View className='settings-page__header'>
        <Text className='settings-page__title font-display'>⚙️ 设置</Text>
      </View>

      {/* 功能设置 */}
      <View className='settings-page__section'>
        <Text className='section-title'>功能设置</Text>
        <Card variant='default' padding='md' className='settings-list'>
          {settingItems.map(item => (
            <View key={item.key} className='setting-item'>
              <View className='setting-item__left'>
                <Text className='setting-item__icon'>{item.icon}</Text>
                <View className='setting-item__info'>
                  <Text className='setting-item__label'>{item.label}</Text>
                  <Text className='setting-item__desc'>{item.desc}</Text>
                </View>
              </View>
              <Switch
                className='setting-item__switch'
                checked={settings[item.key]}
                onChange={() => handleToggle(item.key)}
                color='#E67E22'
              />
            </View>
          ))}
        </Card>
      </View>

      {/* 账号管理 */}
      <View className='settings-page__section'>
        <Text className='section-title'>账号管理</Text>
        <Card variant='default' padding='md' className='settings-list'>
          <View className='setting-item setting-item--button' onClick={handleClearCache}>
            <View className='setting-item__left'>
              <Text className='setting-item__icon'>🗑️</Text>
              <Text className='setting-item__label'>清除缓存</Text>
            </View>
            <Text className='setting-item__arrow'>→</Text>
          </View>
          <View className='setting-item setting-item--button' onClick={handleAbout}>
            <View className='setting-item__left'>
              <Text className='setting-item__icon'>ℹ️</Text>
              <Text className='setting-item__label'>关于我们</Text>
            </View>
            <Text className='setting-item__arrow'>→</Text>
          </View>
        </Card>
      </View>

      {/* 退出登录 */}
      <View className='settings-page__footer'>
        <View className='logout-btn' onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}>
          <Text className='logout-btn__text'>退出登录</Text>
        </View>
        <Text className='version-text'>去除班味 v1.0.0</Text>
      </View>
    </View>
  )
}
