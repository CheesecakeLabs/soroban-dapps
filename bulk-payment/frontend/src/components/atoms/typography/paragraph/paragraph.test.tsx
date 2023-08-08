import React from 'react'

import { render, screen } from 'app/core/tests/utils'

import { Paragraph } from './index'

test('Display Paragraph text', () => {
  render(<Paragraph text="Hello World" />)

  expect(screen.getByText('Hello World')).toBeInTheDocument()
})
