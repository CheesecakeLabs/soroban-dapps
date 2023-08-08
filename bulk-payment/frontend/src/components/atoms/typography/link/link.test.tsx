import { render, screen } from 'app/core/tests/utils'

import { Link } from '.'

describe('Atom Link', () => {
  it('Display regular Link', () => {
    render(<Link text="Link" />)

    expect(screen.getByText('Link')).toBeInTheDocument()
  })
})
