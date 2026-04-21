import { describe, it, expect } from 'vitest'
import { render, screen } from './test-utils'
import { Logo } from '../components/Logo'

describe('Logo Component', () => {
  it('should render the logo text', () => {
    render(<Logo />)
    expect(screen.getByText('Dune')).toBeInTheDocument()
    expect(screen.getByText('Power')).toBeInTheDocument()
  })

  it('should render with default md size', () => {
    render(<Logo />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with sm size', () => {
    render(<Logo size="sm" />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with lg size', () => {
    render(<Logo size="lg" />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with xl size', () => {
    render(<Logo size="xl" />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with responsive size object with base only', () => {
    render(<Logo size={{ base: "sm" }} />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with responsive size object with base and md', () => {
    render(<Logo size={{ base: "sm", md: "lg" }} />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with responsive size object with all sizes', () => {
    render(<Logo size={{ base: "sm", md: "md", lg: "xl" }} />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render with responsive size object without base (fallback to default)', () => {
    render(<Logo size={{ md: "lg" }} />)
    const duneText = screen.getByText('Dune')
    expect(duneText).toBeInTheDocument()
  })

  it('should render both Dune and Power text elements', () => {
    render(<Logo />)
    const duneText = screen.getByText('Dune')
    const powerText = screen.getByText('Power')
    
    expect(duneText).toBeInTheDocument()
    expect(powerText).toBeInTheDocument()
    
    // Verify colors
    expect(duneText).toHaveStyle({ color: '#D4A373' })
    expect(powerText).toHaveStyle({ color: '#0d9488' })
  })
})
