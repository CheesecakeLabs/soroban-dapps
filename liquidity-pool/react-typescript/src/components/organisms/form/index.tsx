import React from 'react'
import { useForm as useReactHookForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'

import { InputText, Select } from 'components/atoms'
import { IInputProps } from 'components/types/input'

import { renderFormElementWithLabel } from './helpers'
import {
  IControlledFormElements,
  IFormElements,
  IFormProps,
  IUseFormReturn,
} from './types'

const CONTROLLED_FORM_ELEMENTS: IControlledFormElements = {
  Select,
}

// Add Here every form component to expose in form elements
const FORM_ELEMENT_MAP: IFormElements = {
  InputText,
  ...CONTROLLED_FORM_ELEMENTS,
}

const isFormComponent = (
  component: React.ReactElement<IInputProps>
): string | false =>
  Object.values(FORM_ELEMENT_MAP).some(
    el => el === (component as React.ReactElement).type
  ) && component.props.name

const isControlledComponent = (
  component: React.ReactElement<IInputProps>
): boolean =>
  Object.values(CONTROLLED_FORM_ELEMENTS).some(
    el => el === (component as React.ReactElement).type
  )

const useForm = ({
  onSubmit,
  validationSchema,
  initialValues,
}: IFormProps): IUseFormReturn => {
  const formAPI = useReactHookForm({
    defaultValues: initialValues,
    resolver: validationSchema ? yupResolver(validationSchema) : undefined,
  })

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = formAPI

  const Form = React.useMemo(() => {
    const renderFormElements = (
      elements: React.ReactElement | React.ReactNode
    ): React.ReactElement | React.ReactNode =>
      React.Children.toArray(elements).map(child => {
        if (React.isValidElement(child)) {
          if (isFormComponent(child)) {
            const formActions = { errors, register }
            if (isControlledComponent(child)) {
              return renderFormElementWithLabel(child, {
                ...formActions,
                control,
              })
            }
            return renderFormElementWithLabel(child, formActions)
          }
          if (React.Children.toArray(child.props.children).length) {
            return React.cloneElement(
              child,
              child.props,
              renderFormElements(child.props.children)
            )
          }
        }
        return child
      })
    const FormComponent: React.FC = ({ children }) => (
      <form data-testid="form" onSubmit={handleSubmit(onSubmit)}>
        {renderFormElements(children)}
      </form>
    )
    return Object.assign(FormComponent, FORM_ELEMENT_MAP)
  }, [control, errors, handleSubmit, onSubmit, register])

  return { Form, ...formAPI }
}

export { useForm }
