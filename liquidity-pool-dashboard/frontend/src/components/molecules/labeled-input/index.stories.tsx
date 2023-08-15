import { Story, Meta } from '@storybook/react'

import { InputText } from 'components/atoms'

import { LabeledInput, ILabeledInputProps } from '.'

export default {
  title: 'Molecule/LabeledInput',
  component: LabeledInput,
} as Meta

const Template: Story<ILabeledInputProps> = args => (
  <LabeledInput {...args} input={<InputText name="name" />} />
)

export const Default = Template.bind({})
Default.args = {
  label: 'Name',
}
