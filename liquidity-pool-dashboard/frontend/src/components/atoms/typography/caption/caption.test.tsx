import React from 'react'

import { render, screen } from 'app/core/tests/utils'

import { Caption } from './index'

test('Display Caption text', () => {
  render(<Caption text="Hello World" />)

  expect(screen.getByText('Hello World')).toBeInTheDocument()
})
