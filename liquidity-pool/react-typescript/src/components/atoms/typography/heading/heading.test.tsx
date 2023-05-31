import React from 'react'

import { shallow } from 'enzyme'

import { render, screen } from 'app/core/tests/utils'

import { Heading, TypographyHeadingLevel } from './index'

test('Display Heading text', () => {
  render(<Heading text="Hello World" level={TypographyHeadingLevel.h1} />)
  expect(screen.getByText('Hello World')).toBeInTheDocument()
})

test('Should render %s when pass %s', () => {
  const headings = [
    ['h1', TypographyHeadingLevel.h1],
    ['h2', TypographyHeadingLevel.h2],
    ['h3', TypographyHeadingLevel.h3],
    ['h4', TypographyHeadingLevel.h4],
    ['h5', TypographyHeadingLevel.h5],
  ]

  headings.forEach(([expected, param]) => {
    const level = param as TypographyHeadingLevel
    const wrapper = shallow(<Heading text="Hello World" level={level} />)
    const element = wrapper.find(expected)
    expect(element.length).toBe(1)
  })
})
