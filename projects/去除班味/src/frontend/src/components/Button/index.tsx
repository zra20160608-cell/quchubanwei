import React from 'react'
import { Button as TaroButton } from '@tarojs/components'
import classNames from 'classnames'
import './index.scss'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
  variant?: ButtonVariant
  size?: ButtonSize
  disabled?: boolean
  loading?: boolean
  fullWidth?: boolean
  rounded?: boolean
  className?: string
  style?: React.CSSProperties
  onClick?: () => void
  children: React.ReactNode
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  rounded = true,
  className,
  style,
  onClick,
  children
}) => {
  const handleClick = () => {
    if (disabled || loading) return
    onClick?.()
  }

  return (
    <TaroButton
      className={classNames(
        'bw-button',
        `bw-button--${variant}`,
        `bw-button--${size}`,
        {
          'bw-button--disabled': disabled || loading,
          'bw-button--loading': loading,
          'bw-button--full': fullWidth,
          'bw-button--rounded': rounded,
        },
        className
      )}
      style={style}
      onClick={handleClick}
    >
      {loading && <view className="bw-button__spinner" />}
      <view className="bw-button__content">{children}</view>
    </TaroButton>
  )
}

export default Button
