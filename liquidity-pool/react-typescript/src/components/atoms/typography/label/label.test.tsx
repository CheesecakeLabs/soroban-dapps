import { render, screen } from 'app/core/tests/utils'

import { Label } from '.'

describe('Atom Label', () => {
  it('Display regular Label', () => {
    render(<Label text="Label" />)

    expect(screen.getByText('Label')).toBeInTheDocument()
  })
})
