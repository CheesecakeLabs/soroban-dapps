import React from 'react'

import classNames from 'classnames'

import { IconNames } from './iconNames'

interface IIconProps {
  /**
   * Icon name
   */
  name: IconNames
  /**
   * A alternative text about the icon to help assistive technology
   */
  alt?: string
  /**
   * The icon size
   */
  size?: string
  /**
   * Icon color
   */
  color?: string
  /**
   * Classname to add custom css
   */
  className?: string
}

const Icon = ({ name, alt, className, color, size }: IIconProps): JSX.Element => {
  return (
    <i
      role="img"
      title={alt}
      aria-label={alt}
      className={classNames(`icon-font-${name}`, className)}
      style={{ color, fontSize: size }}
    />
  )
}

export type { IIconProps }
export { Icon, IconNames }
