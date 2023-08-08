import { fireEvent } from '@testing-library/react'

import sinon from 'sinon'

import { render, screen } from 'app/core/tests/utils'

import { Button, ButtonType, ButtonSize } from '.'

const BUTTON = 'button'

const getButtonName = (param: ButtonType | ButtonSize): string =>
  `I am a ${param} button!!!`

test('Display button label', () => {
  render(<Button label={'Click me'} />)

  expect(screen.getByText('Click me')).toBeInTheDocument()
})

test('Call onClick when click event happens', () => {
  const spy = sinon.spy()
  render(<Button label={'Click me'} onClick={spy} />)

  const button = screen.getByRole(BUTTON)
  fireEvent.click(button)

  expect(spy.callCount).toBe(1)
})

test('Render button with %s type', () => {
  Object.values(ButtonType).forEach(type => {
    const buttonName = getButtonName(type)
    render(<Button type={type} label={buttonName} />)

    expect(screen.getByRole(BUTTON, { name: buttonName })).toBeInTheDocument()
  })
})

test('Render button with %s size', () => {
  Object.values(ButtonSize).forEach(size => {
    const buttonName = getButtonName(size)
    render(<Button size={size} label={buttonName} />)

    expect(screen.getByRole(BUTTON, { name: buttonName })).toBeInTheDocument()
  })
})
