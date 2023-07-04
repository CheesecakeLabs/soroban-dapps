import React, { ChangeEvent, FocusEvent } from 'react'
import { UseFormReturn as UseReactHookFormReturn } from 'react-hook-form'

import { AnyObjectSchema } from 'yup'

import { IInputTextProps, ISelectProps } from 'components/atoms'

export interface IFormProps {
  /**
   * The callback called when the form is submitted without any validation fail
   * The values will be returned as an object where the key is the input name, and  the value is the value of the input.
   */
  onSubmit: (
    values: Record<string | number, unknown>,
    event: React.BaseSyntheticEvent | undefined
  ) => Promise<void>
  /**
   * The yup validation schema.
   * Examples of usage:
   * - https://react-hook-form.com/get-started#SchemaValidation
   * - https://github.com/jquense/yup
   */
  validationSchema?: AnyObjectSchema
  /**
   * This prop is used to populate the form in the first render
   * The keys of the object informed must be the same of the input name
   */
  initialValues?: Record<string | number, unknown>
}

export interface IFormInputProps {
  /**
   * The name of the input
   * The name informed will be the key of object returned onSubmit event
   */
  name: string
  /**
   * The React input ref
   */
  ref?: React.Ref<HTMLInputElement>
  /**
   * The input onChange event, the event informed will be composed with the react-hook-form event
   */
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  /**
   * The input onBlur event, the event informed will be composed with the react-hook-form event
   */
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  /**
   * The label of the input, if not informed the label will be empty
   */
  label?: string
  /**
   * The labeledInput Container className
   */
  labeledInputClassName?: string
}

export type UpdateFormEvent =
  | ChangeEvent<HTMLInputElement>
  | FocusEvent<HTMLInputElement>

export interface IControlledFormElements {
  Select: React.FC<
    Omit<Omit<IFormInputProps, 'onChange'> & ISelectProps, 'ref'>
  >
}

export interface IFormElements extends IControlledFormElements {
  InputText: React.FC<Omit<IFormInputProps & IInputTextProps, 'ref'>>
}

export type FormType = React.FC & IFormElements

export interface IUseFormReturn extends UseReactHookFormReturn {
  Form: FormType
}
