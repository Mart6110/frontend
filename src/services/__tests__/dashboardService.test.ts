import { describe, it, expect, vi, beforeEach } from 'vitest'
import * as dashboardService from '../dashboardService'
import * as api from '../api'

// Mock the API module
vi.mock('../api', () => ({
  getLatestData: vi.fn(),
  getLatestEnergy: vi.fn(),
  getHistoryData: vi.fn(),
  getEnergyHistory: vi.fn(),
  getControlStatus: vi.fn(),
  getEvents: vi.fn(),
  controlPump: vi.fn(),
  controlHeater: vi.fn(),
}))

describe('dashboardService', () => {
  const mockSensorData: api.SensorData = {
    timestamp: '2026-05-01T10:35:00Z',
    product_key: 'test-key',
    temperatures: [
      { index: 0, label: 'sand_side', value: 48.9 },
      { index: 1, label: 'sand_core', value: 62.8 },
      { index: 2, label: 'water_in', value: 37.6 },
      { index: 3, label: 'water_out', value: 40.3 },
    ],
    flow_rates: [{ index: 0, value: 5.8 }],
    power_w: 2500,
    energy_kwh: 0.01,
    status: 'OK',
  }

  const mockEnergyReading: api.EnergyReading = {
    timestamp: '2026-05-01T10:35:00Z',
    energy_kwh: 0.01,
  }

  const mockHistoryResponse: api.HistoryResponse = {
    from: '2026-05-01T10:00:00Z',
    to: '2026-05-01T11:00:00Z',
    count: 1,
    data: [
      {
        timestamp: '2026-05-01T10:30:00Z',
        product_key: 'test-key',
        temperatures: [
          { index: 0, label: 'sand_side', value: 48.5 },
          { index: 1, label: 'sand_core', value: 62.0 },
          { index: 2, label: 'water_in', value: 37.0 },
          { index: 3, label: 'water_out', value: 40.0 },
        ],
        flow_rates: [{ index: 0, value: 5.5 }],
        power_w: 2400,
        energy_kwh: 0.008,
        status: 'OK',
      },
    ],
  }

  const mockEnergyHistoryResponse: api.EnergyHistoryResponse = {
    from: '2026-05-01T10:00:00Z',
    to: '2026-05-01T11:00:00Z',
    count: 1,
    data: [
      {
        timestamp: '2026-05-01T10:30:00Z',
        energy_kwh: 0.008,
      },
    ],
  }

  const mockControlStatus: api.ControlStatus = {
    pump: {
      index: 0,
      active: true,
      source: 'manual',
      last_changed: '2026-05-01T09:00:00Z',
    },
    heaters: [
      { index: 0, active: true, source: 'manual', last_changed: '2026-05-01T09:00:00Z' },
      { index: 1, active: true, source: 'manual', last_changed: '2026-05-01T09:00:00Z' },
      { index: 2, active: true, source: 'manual', last_changed: '2026-05-01T09:00:00Z' },
    ],
  }

  const mockEventsResponse: api.EventsResponse = {
    total: 1,
    limit: 1000,
    offset: 0,
    events: [
      {
        id: 1,
        type: 'pump_start' as const,
        source: 'manual' as const,
        timestamp: '2026-05-01T09:00:00Z',
        description: 'Pump started manually',
      },
    ],
  }

  beforeEach(() => {
    vi.clearAllMocks()
    
    // Setup default mock implementations
    vi.mocked(api.getLatestData).mockResolvedValue(mockSensorData)
    vi.mocked(api.getLatestEnergy).mockResolvedValue(mockEnergyReading)
    vi.mocked(api.getHistoryData).mockResolvedValue(mockHistoryResponse)
    vi.mocked(api.getEnergyHistory).mockResolvedValue(mockEnergyHistoryResponse)
    vi.mocked(api.getControlStatus).mockResolvedValue(mockControlStatus)
    vi.mocked(api.getEvents).mockResolvedValue(mockEventsResponse)
  })

  describe('fetchDashboardData', () => {
    it('should fetch absolute latest data when useAbsoluteLatest is true', async () => {
      const from = new Date('2026-05-01T10:00:00Z')
      const to = new Date('2026-05-01T10:35:00Z')

      const result = await dashboardService.fetchDashboardData({
        from,
        to,
        interval: '5m',
        useAbsoluteLatest: true,
      })

      // Should call getLatestData and getLatestEnergy
      expect(api.getLatestData).toHaveBeenCalledTimes(1)
      expect(api.getLatestEnergy).toHaveBeenCalledTimes(1)
      expect(api.getHistoryData).toHaveBeenCalledTimes(1)
      expect(api.getEnergyHistory).toHaveBeenCalledTimes(1)
      expect(api.getControlStatus).toHaveBeenCalledTimes(1)
      expect(api.getEvents).toHaveBeenCalledTimes(1)

      // Result should use latest data for current values
      expect(result.currentSandSide).toBe(48.9)
      expect(result.currentPower).toBe(2500)
    })

    it('should use historical data when useAbsoluteLatest is false', async () => {
      const from = new Date('2026-04-25T00:00:00Z')
      const to = new Date('2026-04-25T23:59:59Z')

      const result = await dashboardService.fetchDashboardData({
        from,
        to,
        interval: '1h',
        useAbsoluteLatest: false,
      })

      // Should NOT call getLatestData and getLatestEnergy for historical ranges
      expect(api.getLatestData).not.toHaveBeenCalled()
      expect(api.getLatestEnergy).not.toHaveBeenCalled()
      
      // Should still call history and other endpoints
      expect(api.getHistoryData).toHaveBeenCalledTimes(1)
      expect(api.getEnergyHistory).toHaveBeenCalledTimes(1)
      expect(api.getControlStatus).toHaveBeenCalledTimes(1)
      expect(api.getEvents).toHaveBeenCalledTimes(1)
    })

    it('should automatically detect realtime when to is within 5 minutes and useAbsoluteLatest is undefined', async () => {
      const now = new Date()
      const from = new Date(now.getTime() - 6 * 60 * 60 * 1000) // 6 hours ago
      const to = new Date(now.getTime() - 2 * 60 * 1000) // 2 minutes ago (within 5 minutes)

      await dashboardService.fetchDashboardData({
        from,
        to,
        interval: '5m',
      })

      // Should call latest data endpoints
      expect(api.getLatestData).toHaveBeenCalledTimes(1)
      expect(api.getLatestEnergy).toHaveBeenCalledTimes(1)
    })

    it('should use historical data when to is more than 5 minutes old and useAbsoluteLatest is undefined', async () => {
      const now = new Date()
      const from = new Date(now.getTime() - 24 * 60 * 60 * 1000) // 24 hours ago
      const to = new Date(now.getTime() - 6 * 60 * 1000) // 6 minutes ago (> 5 minutes)

      await dashboardService.fetchDashboardData({
        from,
        to,
        interval: '1h',
      })

      // Should NOT call latest data endpoints
      expect(api.getLatestData).not.toHaveBeenCalled()
      expect(api.getLatestEnergy).not.toHaveBeenCalled()
    })

    it('should pass correct parameters to API calls', async () => {
      const from = new Date('2026-05-01T10:00:00Z')
      const to = new Date('2026-05-01T10:35:00Z')
      const interval = '5m'

      await dashboardService.fetchDashboardData({
        from,
        to,
        interval,
        useAbsoluteLatest: true,
      })

      expect(api.getHistoryData).toHaveBeenCalledWith({
        from: from.toISOString(),
        to: to.toISOString(),
        interval,
        limit: 5000,
      })

      expect(api.getEnergyHistory).toHaveBeenCalledWith({
        from: from.toISOString(),
        to: to.toISOString(),
        limit: 5000,
      })

      expect(api.getEvents).toHaveBeenCalledWith({
        from: from.toISOString(),
        to: to.toISOString(),
        limit: 1000,
      })
    })

    it('should handle API errors gracefully', async () => {
      vi.mocked(api.getHistoryData).mockRejectedValue(new Error('API Error'))

      const from = new Date('2026-05-01T10:00:00Z')
      const to = new Date('2026-05-01T10:35:00Z')

      await expect(
        dashboardService.fetchDashboardData({ from, to, useAbsoluteLatest: true })
      ).rejects.toThrow('API Error')
    })
  })

  describe('fetchLatestData', () => {
    it('should fetch all latest data in parallel', async () => {
      const result = await dashboardService.fetchLatestData()

      expect(api.getLatestData).toHaveBeenCalledTimes(1)
      expect(api.getLatestEnergy).toHaveBeenCalledTimes(1)
      expect(api.getControlStatus).toHaveBeenCalledTimes(1)
      expect(api.getEvents).toHaveBeenCalledWith({ limit: 1000 })

      expect(result.data).toEqual(mockSensorData)
      expect(result.energyData).toEqual(mockEnergyReading)
      expect(result.controlStatus).toEqual(mockControlStatus)
      expect(result.events).toEqual(mockEventsResponse.events)
    })

    it('should handle errors when fetching latest data', async () => {
      vi.mocked(api.getLatestData).mockRejectedValue(new Error('Connection failed'))

      await expect(dashboardService.fetchLatestData()).rejects.toThrow('Connection failed')
    })
  })

  describe('controlPump', () => {
    it('should call API controlPump with correct parameters', async () => {
      const mockResponse: api.ControlResponse = { 
        success: true, 
        action: 'pump_start',
        source: 'manual',
        timestamp: '2026-05-01T10:35:00Z',
        event_id: 1
      }
      vi.mocked(api.controlPump).mockResolvedValue(mockResponse)

      const result = await dashboardService.controlPump('start')

      expect(api.controlPump).toHaveBeenCalledWith('start', 'manual')
      expect(result).toEqual(mockResponse)
    })

    it('should handle stop action', async () => {
      const mockResponse: api.ControlResponse = { 
        success: true, 
        action: 'pump_stop',
        source: 'manual',
        timestamp: '2026-05-01T10:35:00Z',
        event_id: 2
      }
      vi.mocked(api.controlPump).mockResolvedValue(mockResponse)

      const result = await dashboardService.controlPump('stop')

      expect(api.controlPump).toHaveBeenCalledWith('stop', 'manual')
      expect(result).toEqual(mockResponse)
    })
  })

  describe('controlHeater', () => {
    it('should call API controlHeater with correct parameters', async () => {
      const mockResponse: api.ControlResponse = { 
        success: true, 
        action: 'heat_on',
        source: 'manual',
        timestamp: '2026-05-01T10:35:00Z',
        event_id: 3
      }
      vi.mocked(api.controlHeater).mockResolvedValue(mockResponse)

      const result = await dashboardService.controlHeater(0, 'on')

      expect(api.controlHeater).toHaveBeenCalledWith(0, 'on', 'manual')
      expect(result).toEqual(mockResponse)
    })

    it('should handle different heater indices', async () => {
      const mockResponse: api.ControlResponse = { 
        success: true, 
        action: 'heat_off',
        source: 'manual',
        timestamp: '2026-05-01T10:35:00Z',
        event_id: 4
      }
      vi.mocked(api.controlHeater).mockResolvedValue(mockResponse)

      await dashboardService.controlHeater(2, 'off')

      expect(api.controlHeater).toHaveBeenCalledWith(2, 'off', 'manual')
    })
  })
})
