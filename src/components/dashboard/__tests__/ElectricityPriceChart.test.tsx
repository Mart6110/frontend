import { describe, it, expect } from 'vitest'
import { render, screen } from '@/test/test-utils'
import { ElectricityPriceChart } from '../ElectricityPriceChart'

describe('ElectricityPriceChart', () => {
  const mockPriceData = [
    { hour: '2026-04-30T00:00:00Z', price_dkk_kwh: 0.654 },
    { hour: '2026-04-30T01:00:00Z', price_dkk_kwh: 0.621 },
    { hour: '2026-04-30T02:00:00Z', price_dkk_kwh: 0.598 },
    { hour: '2026-04-30T03:00:00Z', price_dkk_kwh: 0.712 },
    { hour: '2026-04-30T04:00:00Z', price_dkk_kwh: 0.889 },
    { hour: '2026-04-30T05:00:00Z', price_dkk_kwh: 1.123 },
    { hour: '2026-04-30T06:00:00Z', price_dkk_kwh: 1.245 },
  ]

  it('should render the chart with default title', () => {
    render(<ElectricityPriceChart data={mockPriceData} />)
    
    expect(screen.getByText(/Elpriser/i)).toBeInTheDocument()
  })

  it('should render with custom title', () => {
    render(<ElectricityPriceChart data={mockPriceData} title="Custom Price Title" />)
    
    expect(screen.getByText(/Custom Price Title/i)).toBeInTheDocument()
  })

  it('should display area and date in title when provided', () => {
    render(
      <ElectricityPriceChart 
        data={mockPriceData} 
        area="DK2" 
        date="2026-04-30" 
        title="Elpriser"
      />
    )
    
    // Should show "Elpriser - 2026-04-30 (DK2)"
    expect(screen.getByText(/2026-04-30/)).toBeInTheDocument()
    expect(screen.getByText(/DK2/)).toBeInTheDocument()
  })

  it('should render with empty data', () => {
    render(<ElectricityPriceChart data={[]} />)
    
    // Chart should render but with no data
    expect(screen.getByText(/Elpriser/i)).toBeInTheDocument()
  })

  it('should have Graph and Table toggle buttons when enableTableView is true', () => {
    render(<ElectricityPriceChart data={mockPriceData} enableTableView={true} />)
    
    expect(screen.getByText('Graph')).toBeInTheDocument()
    expect(screen.getByText('Table')).toBeInTheDocument()
  })

  it('should not have toggle buttons when enableTableView is false', () => {
    render(<ElectricityPriceChart data={mockPriceData} enableTableView={false} />)
    
    expect(screen.queryByText('Graph')).not.toBeInTheDocument()
    expect(screen.queryByText('Table')).not.toBeInTheDocument()
  })

  it('should render with custom height', () => {
    const { container } = render(
      <ElectricityPriceChart data={mockPriceData} height={400} />
    )
    
    // Chart container should be present
    expect(container.querySelector('[style*="height"]')).toBeInTheDocument()
  })

  it('should handle different area codes', () => {
    const { rerender } = render(
      <ElectricityPriceChart data={mockPriceData} area="DK1" />
    )
    
    expect(screen.getByText(/DK1/)).toBeInTheDocument()
    
    rerender(<ElectricityPriceChart data={mockPriceData} area="DK2" />)
    expect(screen.getByText(/DK2/)).toBeInTheDocument()
  })

  it('should render chart without legend when showLegend is false', () => {
    render(<ElectricityPriceChart data={mockPriceData} showLegend={false} />)
    
    // Chart should still render
    expect(screen.getByText(/Elpriser/i)).toBeInTheDocument()
  })

  it('should handle data with various price values', () => {
    const extremePriceData = [
      { hour: '2026-04-30T00:00:00Z', price_dkk_kwh: 0.001 }, // Very low
      { hour: '2026-04-30T01:00:00Z', price_dkk_kwh: 5.999 }, // Very high
    ]

    render(<ElectricityPriceChart data={extremePriceData} />)
    
    expect(screen.getByText(/Elpriser/i)).toBeInTheDocument()
  })

  it('should handle data with single price entry', () => {
    const singlePriceData = [
      { hour: '2026-04-30T12:00:00Z', price_dkk_kwh: 0.850 },
    ]

    render(<ElectricityPriceChart data={singlePriceData} />)
    
    expect(screen.getByText(/Elpriser/i)).toBeInTheDocument()
  })

  it('should display correct title format with all parameters', () => {
    render(
      <ElectricityPriceChart 
        data={mockPriceData} 
        title="Elpriser"
        date="2026-04-30"
        area="DK2"
      />
    )
    
    // Title should be "Elpriser - 2026-04-30 (DK2)"
    const titleElement = screen.getByText(/Elpriser/)
    expect(titleElement.textContent).toContain('2026-04-30')
    expect(titleElement.textContent).toContain('DK2')
  })
})
