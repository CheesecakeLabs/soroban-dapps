import React from 'react'
import ReactSelect, { SelectInstance, GroupBase } from 'react-select'

import { IInputProps } from 'components/types/input'

export type SelectItemProps = {
  label: string
  value: string
}

export interface ISelectProps
  extends Omit<IInputProps, 'ref' | 'value' | 'onChange' | 'onBlur'> {
  /**
   * The select options
   */
  options: { label: string; value: string }[]
  /**
   * The React input ref
   * This ref usually is used to integrate with react-hook-forms
   */
  ref: React.Ref<ReactSelect>
  /**
   * The React input ref
   * This ref usually is used to integrate with react-hook-forms
   */
  value?: { label: string; value: string }[]
  /**
   * Are the options loading
   */
  isLoading?: boolean
  /**
   * Input onchange function
   */
  onChange?: (value: SelectItemProps | null) => void
}

export const Select = React.forwardRef<
  SelectInstance<SelectItemProps, false, GroupBase<SelectItemProps>>,
  ISelectProps
>(
  ({ name, id, ...restProps }, ref): JSX.Element => (
    <ReactSelect inputId={id ?? name} name={name} {...restProps} ref={ref} />
  )
)
