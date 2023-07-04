import { Story, Meta } from '@storybook/react'
import React from 'react'

import { ReactComponent as Logo } from 'app/core/resources/logo.svg'

import { Button, IButtonProps, ButtonType, ButtonSize } from '.'

export default {
  title: 'Atoms/Button',
  component: Button,
} as Meta

const Template: Story<IButtonProps> = args => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  label: 'Click me',
  type: ButtonType.primary,
  size: ButtonSize.large,
}
Default.argTypes = {
  icon: { control: { disable: true } },
}

const ButtonWithIconTemplate: Story<IButtonProps> = args => (
  <Button {...args} icon={<Logo />} />
)
export const ButtonWithIcon = ButtonWithIconTemplate.bind({})
ButtonWithIcon.args = {
  label: 'Click me',
  type: ButtonType.primary,
  size: ButtonSize.large,
}
