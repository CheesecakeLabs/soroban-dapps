import React from 'react'

import classNames from 'classnames'

import styles from './styles.module.scss'

export enum ButtonType {
  primary = 'primary',
  secondary = 'secondary',
  tertiary = 'tertiary',
  ghost = 'ghost',
  destructive = 'destructive',
}

export enum ButtonSize {
  small = 'small',
  medium = 'medium',
  large = 'large',
}

export enum ButtonIconPosition {
  left = 'left',
  right = 'right',
}

export interface IButtonProps {
  /**
   * The type of the button
   */
  type?: ButtonType
  /**
   * The size of the button
   */
  size?: ButtonSize
  /**
   * The content of the button
   */
  label?: string
  /**
   * Optional click handler
   */
  onClick?: () => void
  /**
   * Is the button disabled?
   */
  disabled?: boolean
  /**
   * Is the button loading?
   */
  loading?: boolean
  /**
   * A image component to display inside of the button
   */
  icon?: React.ReactElement | React.ReactNode
  /**
   * The icon position inside the button (left|right)
   */
  iconPosition?: ButtonIconPosition
  /**
   * Classname to add custom css
   */
  className?: string
}

const Button = ({
  label,
  onClick,
  size = ButtonSize.medium,
  type = ButtonType.primary,
  iconPosition = ButtonIconPosition.left,
  disabled = false,
  loading = false,
  icon,
  className,
}: IButtonProps): JSX.Element => {
  const currentIcon = loading ? (
    <span className={styles.loadingWrapper}></span>
  ) : (
    <span className={styles.iconWrapper}>{icon}</span>
  )

  return (
    <button
      disabled={disabled}
      className={classNames(
        styles.button,
        styles[type],
        styles[size],
        styles[iconPosition],
        className
      )}
      onClick={onClick}
    >
      {icon && currentIcon}
      <span>{label}</span>
    </button>
  )
}

export { Button }
