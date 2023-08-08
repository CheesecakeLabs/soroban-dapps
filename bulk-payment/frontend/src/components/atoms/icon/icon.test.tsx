import { render, screen } from 'app/core/tests/utils'

import { Icon, IconNames } from '.'

test('Display button label', () => {
  render(<Icon name={IconNames.danger} alt="Danger" />)

  expect(screen.getByRole('img')).toBeInTheDocument()
  expect(screen.getByLabelText('Danger')).toBeInTheDocument()
  expect(screen.getByTitle('Danger')).toBeInTheDocument()
})
