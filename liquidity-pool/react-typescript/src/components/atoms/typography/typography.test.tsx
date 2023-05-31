import { render, screen } from 'app/core/tests/utils'

import { Typography, TypographyVariant } from '.'

const getTypographyText = (variant: TypographyVariant): string =>
  `I am a ${variant} tag element`

describe('Atom Typography', () => {
  it('Render Typography with %s variant', () => {
    Object.values(TypographyVariant).forEach(variant => {
      const typographyText = getTypographyText(variant)
      render(<Typography text={typographyText} variant={variant} />)

      expect(screen.getByText(typographyText)).toBeInTheDocument()
    })
  })
})
