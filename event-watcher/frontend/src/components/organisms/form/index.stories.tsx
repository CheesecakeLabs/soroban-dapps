import { Story, Meta } from '@storybook/react'
import React from 'react'

import * as yup from 'yup'

import { useForm } from '.'
import { IFormProps } from './types'

const FormDemo: React.FC<IFormProps> = args => {
  const validationSchema = yup.object().shape({
    name: yup.string().required(),
  })
  const { Form } = useForm({ ...args, validationSchema })
  return (
    <Form>
      <Form.InputText name="name" label="Name" />
      <Form.Select
        name="city"
        label="City"
        options={[
          {
            label: 'Florianópolis',
            value: 'floripa',
          },
        ]}
      />
      <hr />
      <input type="submit" value="Submit" />
    </Form>
  )
}

export default {
  title: 'Organisms/Form',
  component: FormDemo,
} as Meta

const Template: Story<IFormProps> = (args: IFormProps) => <FormDemo {...args} />

export const Default = Template.bind({})
Default.args = {}
