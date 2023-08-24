import React from 'react'
import {
  Control,
  DeepMap,
  FieldError,
  FieldValues,
  UseFormRegister,
} from 'react-hook-form'
import { Controller } from 'react-hook-form'

import { Status } from 'components/enums'
import { LabeledInput } from 'components/molecules'

import { UpdateFormEvent } from './types'

const composeEvents =
  (
    eventA: (e: UpdateFormEvent) => void,
    eventB?: (e: UpdateFormEvent) => void
  ) =>
  (...args: [UpdateFormEvent]): void => {
    eventB && eventB(...args)
    return eventA(...args)
  }

export const cloneElement = (
  child: React.ReactElement,
  register: UseFormRegister<FieldValues>,
  status: Status
): React.ReactElement => {
  const { onChange, onBlur, ...registerProps } = register(child.props.name)
  const composeOnChange = composeEvents(onChange, child.props?.onChange)
  const composeOnBlur = composeEvents(onBlur, child.props?.onBlur)

  return React.cloneElement(child, {
    onChange: composeOnChange,
    onBlur: composeOnBlur,
    status,
    ...registerProps,
  })
}

const cloneWithControl = (
  child: React.ReactElement,
  control: Control,
  status: Status
): JSX.Element => {
  return (
    <Controller
      control={control}
      name={child.props.name}
      render={({
        field: { onChange, onBlur, ...field },
      }): React.ReactElement => {
        const composeOnChange = composeEvents(onChange, child.props?.onChange)
        const composeOnBlur = composeEvents(onBlur, child.props?.onBlur)

        return React.cloneElement(child, {
          onChange: composeOnChange,
          onBlur: composeOnBlur,
          status,
          ...field,
        })
      }}
    />
  )
}

interface IFormActions {
  register: UseFormRegister<FieldValues>
  errors: DeepMap<FieldValues, FieldError>
  control?: Control<FieldValues>
}

export const renderFormElementWithLabel = (
  child: React.ReactElement,
  { errors, register, control }: IFormActions
): React.ReactElement => {
  const name = child.props.name
  const error = errors[name]?.message
  const status = error && Status.error

  let input
  if (control) {
    input = cloneWithControl(child, control, status)
  } else {
    input = cloneElement(child, register, status)
  }

  return (
    <LabeledInput
      key={name}
      input={input}
      label={child.props.label}
      status={status}
      helperText={error}
      htmlFor={name}
      className={child.props.labeledInputClassName}
    />
  )
}
