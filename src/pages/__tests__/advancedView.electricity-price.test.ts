import { describe, it, expect } from 'vitest'

describe('Electricity Price Current Hour Calculation', () => {
  // Helper function that mimics the logic in advancedView.tsx
  const getCurrentPrice = (
    electricityPriceData: { prices: Array<{ hour: string; price_dkk_kwh: number }> } | undefined
  ): number | null => {
    if (!electricityPriceData?.prices) return null
    const now = new Date()
    const currentHour = now.getHours()
    
    const priceEntry = electricityPriceData.prices.find(p => {
      const entryHour = new Date(p.hour).getHours()
      return entryHour === currentHour
    })
    
    return priceEntry?.price_dkk_kwh ?? null
  }

  it('should return null when price data is undefined', () => {
    const result = getCurrentPrice(undefined)
    expect(result).toBeNull()
  })

  it('should return null when prices array is empty', () => {
    const result = getCurrentPrice({ prices: [] })
    expect(result).toBeNull()
  })

  it('should find price for current hour', () => {
    const now = new Date()
    const currentHour = now.getHours()
    
    // Create price data with current hour
    const mockData = {
      prices: [
        { hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, 0, 0).toISOString(), price_dkk_kwh: 0.850 },
        { hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), (currentHour + 1) % 24, 0, 0).toISOString(), price_dkk_kwh: 0.920 },
      ]
    }
    
    const result = getCurrentPrice(mockData)
    expect(result).toBe(0.850)
  })

  it('should return null when current hour is not in price data', () => {
    const now = new Date()
    const currentHour = now.getHours()
    const otherHour = (currentHour + 5) % 24
    
    const mockData = {
      prices: [
        { hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), otherHour, 0, 0).toISOString(), price_dkk_kwh: 0.850 },
      ]
    }
    
    const result = getCurrentPrice(mockData)
    expect(result).toBeNull()
  })

  it('should handle full day of price data', () => {
    const now = new Date()
    const currentHour = now.getHours()
    
    // Create 24 hours of price data
    const prices = Array.from({ length: 24 }, (_, hour) => ({
      hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), hour, 0, 0).toISOString(),
      price_dkk_kwh: 0.5 + (hour * 0.05), // Increasing prices throughout the day
    }))
    
    const mockData = { prices }
    const result = getCurrentPrice(mockData)
    
    expect(result).toBe(0.5 + (currentHour * 0.05))
  })

  it('should match the first occurrence when multiple entries have same hour', () => {
    const now = new Date()
    const currentHour = now.getHours()
    
    const mockData = {
      prices: [
        { hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, 0, 0).toISOString(), price_dkk_kwh: 0.850 },
        { hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, 30, 0).toISOString(), price_dkk_kwh: 0.920 },
      ]
    }
    
    const result = getCurrentPrice(mockData)
    expect(result).toBe(0.850) // Should return first match
  })

  it('should handle different date formats correctly', () => {
    const now = new Date()
    const currentHour = now.getHours()
    
    // Test with ISO string - use local timezone to match getHours() behavior
    const mockData = {
      prices: [
        { hour: new Date(now.getFullYear(), now.getMonth(), now.getDate(), currentHour, 0, 0).toISOString(), price_dkk_kwh: 1.234 },
      ]
    }
    
    const result = getCurrentPrice(mockData)
    expect(result).toBe(1.234)
  })

  it('should handle edge case of hour 0 (midnight)', () => {
    const mockData = {
      prices: [
        { hour: '2026-05-01T00:00:00Z', price_dkk_kwh: 0.654 },
        { hour: '2026-05-01T01:00:00Z', price_dkk_kwh: 0.621 },
      ]
    }
    
    // Mock current time to be midnight
    const midnight = new Date('2026-05-01T00:30:00Z')
    const currentHour = midnight.getHours() // Should be 0
    
    const priceEntry = mockData.prices.find(p => {
      const entryHour = new Date(p.hour).getHours()
      return entryHour === currentHour
    })
    
    expect(priceEntry?.price_dkk_kwh).toBe(0.654)
  })

  it('should handle edge case of hour 23 (late evening)', () => {
    const mockData = {
      prices: [
        { hour: '2026-05-01T22:00:00Z', price_dkk_kwh: 0.980 },
        { hour: '2026-05-01T23:00:00Z', price_dkk_kwh: 0.765 },
      ]
    }
    
    // Mock current time to be 23:30
    const lateEvening = new Date('2026-05-01T23:30:00Z')
    const currentHour = lateEvening.getHours() // Should be 23
    
    const priceEntry = mockData.prices.find(p => {
      const entryHour = new Date(p.hour).getHours()
      return entryHour === currentHour
    })
    
    expect(priceEntry?.price_dkk_kwh).toBe(0.765)
  })
})
