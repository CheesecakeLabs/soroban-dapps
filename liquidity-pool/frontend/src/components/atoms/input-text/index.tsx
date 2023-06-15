import React from 'react'

import classNames from 'classnames'

import { IInputProps } from 'components/types/input'

import styles from './styles.module.scss'

export interface IInputTextProps extends IInputProps {
  htmlType?: string
}

const InputText = React.forwardRef<HTMLInputElement, IInputTextProps>(
  (
    {
      name,
      onChange,
      onBlur,
      htmlType = 'text',
      disabled = false,
      className,
      id,
      ...restProps
    },
    ref
  ): JSX.Element => (
    <div
      className={classNames(
        styles.inputContainer,
        { [styles.disabled]: disabled },
        styles[status]
      )}
    >
      <input
        id={id ?? name}
        className={classNames(styles.input, className)}
        onChange={onChange}
        onBlur={onBlur}
        type={htmlType}
        name={name}
        {...restProps}
        ref={ref}
      />
    </div>
  )
)

export { InputText }
