import classNames from 'classnames'

import { FontSize } from 'components/enums/font-size'

import { ITypographyDefaultProps } from '..'
import styles from './styles.module.scss'

export enum TypographyTextDecoration {
  underline = 'underline',
  none = 'none',
}

export interface ILinkProps extends ITypographyDefaultProps {
  /**
   * Color for the link text
   */
  color?: string
  /**
   * Boolean for adding a text-decoration to the link text
   */
  textDecoration?: TypographyTextDecoration
  /**
   * The font size for the link text
   */
  fontSize?: FontSize
}

const Link = ({
  text = 'Link',
  color = 'black',
  textDecoration = TypographyTextDecoration.none,
  fontSize = FontSize.large,
  className,
}: ILinkProps): JSX.Element => {
  return (
    <span
      className={classNames(
        styles.link,
        styles[textDecoration],
        styles[fontSize],
        className
      )}
      style={{ color }}
    >
      {text}
    </span>
  )
}

export { Link }
