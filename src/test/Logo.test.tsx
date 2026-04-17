import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'
import { Logo } from '../components/Logo'

describe('Logo Component', () => {
  it('should render the logo text', () => {
    render(<Logo />)
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('Power')).toBeInTheDocument()
  })
})
