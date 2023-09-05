import React, { FunctionComponent } from 'react'

import classNames from 'classnames'

import { Typography, TypographyVariant } from 'components/atoms'
import { Status as InputStatus } from 'components/enums/status'
import { IInputProps } from 'components/types/input'

import styles from './styles.module.scss'

export interface ILabeledInputProps {
  className?: string
  input: React.ReactElement<IInputProps>
  label: string
  status: InputStatus
  helperText?: string
  htmlFor?: string
}

const LabeledInput: FunctionComponent<ILabeledInputProps> = ({
  className,
  input,
  label,
  status,
  helperText,
  htmlFor,
}) => {
  return (
    <div className={classNames(styles.container, className)}>
      <label
        htmlFor={htmlFor}
        className={styles.label}
        aria-labelledby={htmlFor}
      >
        <Typography
          status={status}
          text={label}
          variant={TypographyVariant.label}
        />
      </label>
      <span className={styles.inputContainer}>{input}</span>
      {/* TODO: add status of helperText */}
      <span className={styles.helperText}>{helperText}</span>
    </div>
  )
}

export { LabeledInput, InputStatus }
