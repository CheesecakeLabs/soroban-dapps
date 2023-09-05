import { Story, Meta } from '@storybook/react'
import React from 'react'

import { Icon, IconNames, IIconProps } from '.'

export default {
  title: 'Atoms/Icon',
  component: Icon,
} as Meta

const Template: Story<IIconProps> = args => <Icon {...args} />

export const Default = Template.bind({})

Default.argTypes = {
  name: {
    defaultValue: IconNames.user,
    control: {
      type: 'select',
      options: IconNames,
    },
  },
  size: {
    defaultValue: '50px',
  },
}
