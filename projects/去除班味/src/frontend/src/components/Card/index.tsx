import React from 'react'
import { View } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export interface CardProps {
  variant?: 'default' | 'social' | 'elevated'
  padding?: 'sm' | 'md' | 'lg'
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  children: React.ReactNode
}

const Card: React.FC<CardProps> = ({
  variant = 'default',
  padding = 'md',
  className,
  style,
  onClick,
  children
}) => {
  return (
    <View
      className={classNames(
        'bw-card',
        `bw-card--${variant}`,
        `bw-card--padding-${padding}`,
        { 'bw-card--clickable': onClick },
        className
      )}
      style={style}
      onClick={onClick}
    >
      {children}
    </View>
  )
}

export default Card
