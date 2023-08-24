import React from 'react'

import { render, screen } from 'app/core/tests/utils'

import { Heading, TypographyHeadingLevel } from './index'

test('Display Heading text', () => {
  render(<Heading text="Hello World" level={TypographyHeadingLevel.h1} />)
  expect(screen.getByText('Hello World')).toBeInTheDocument()
})

test('Should render %s when pass %s', () => {
  Object.entries(TypographyHeadingLevel).forEach(([variant, level]) => {
    const variantName = `Hello World variant: ${variant}`
    render(<Heading text={variantName} level={level} />)

    expect(screen.getByText(variantName)).toBeInTheDocument()
  })
})
