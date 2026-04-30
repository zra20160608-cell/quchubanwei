import React from 'react'
import { View, Text } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export type TagVariant = 'default' | 'fresh' | 'tipsy' | 'strong' | 'extreme' | 'brand'
export type TagSize = 'sm' | 'md'

export interface TagProps {
  variant?: TagVariant
  size?: TagSize
  className?: string
  style?: React.CSSProperties
  children: React.ReactNode
}

const Tag: React.FC<TagProps> = ({
  variant = 'default',
  size = 'md',
  className,
  style,
  children
}) => {
  return (
    <View
      className={classNames(
        'bw-tag',
        `bw-tag--${variant}`,
        `bw-tag--${size}`,
        className
      )}
      style={style}
    >
      <Text className="bw-tag__text">{children}</Text>
    </View>
  )
}

export default Tag