import { describe, it, expect, beforeEach } from 'vitest'
import {
  convertHistoryToDashboard,
  convertHistoryToDashboardWithLatest,
  mergeLatestData,
  type DashboardData,
} from '../dataTransform'
import type { 
  SensorData, 
  HistoryResponse, 
  EnergyHistoryResponse, 
  EnergyReading,
  ControlStatus,
  SystemEvent 
} from '../api'

describe('dataTransform', () => {
  let mockLatestData: SensorData
  let mockLatestEnergy: EnergyReading
  let mockHistory: HistoryResponse
  let mockEnergyHistory: EnergyHistoryResponse
  let mockControlStatus: ControlStatus
  let mockEvents: SystemEvent[]

  beforeEach(() => {
    mockLatestData = {
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

    mockLatestEnergy = {
      timestamp: '2026-05-01T10:35:00Z',
      energy_kwh: 0.01,
    }

    mockHistory = {
      from: '2026-05-01T10:00:00Z',
      to: '2026-05-01T11:00:00Z',
      count: 2,
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
        {
          timestamp: '2026-05-01T10:33:00Z',
          product_key: 'test-key',
          temperatures: [
            { index: 0, label: 'sand_side', value: 48.7 },
            { index: 1, label: 'sand_core', value: 62.4 },
            { index: 2, label: 'water_in', value: 37.3 },
            { index: 3, label: 'water_out', value: 40.1 },
          ],
          flow_rates: [{ index: 0, value: 5.6 }],
          power_w: 2450,
          energy_kwh: 0.009,
          status: 'OK',
        },
      ],
    }

    mockEnergyHistory = {
      from: '2026-05-01T10:00:00Z',
      to: '2026-05-01T11:00:00Z',
      count: 2,
      data: [
        {
          timestamp: '2026-05-01T10:30:00Z',
          energy_kwh: 0.008,
        },
        {
          timestamp: '2026-05-01T10:33:00Z',
          energy_kwh: 0.009,
        },
      ],
    }

    mockControlStatus = {
      pump: {
        index: 0,
        active: true,
        source: 'manual' as const,
        last_changed: '2026-05-01T09:00:00Z',
      },
      heaters: [
        { index: 0, active: true, source: 'manual' as const, last_changed: '2026-05-01T09:00:00Z' },
        { index: 1, active: true, source: 'manual' as const, last_changed: '2026-05-01T09:00:00Z' },
        { index: 2, active: true, source: 'manual' as const, last_changed: '2026-05-01T09:00:00Z' },
      ],
    }

    mockEvents = [
      {
        id: 1,
        type: 'pump_start',
        source: 'manual',
        timestamp: '2026-05-01T09:00:00Z',
        description: 'Pump started manually',
      },
    ]
  })

  describe('convertHistoryToDashboard', () => {
    it('should convert history to dashboard data using last historical point as latest', () => {
      const result = convertHistoryToDashboard(
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      // Should use last data point for current values
      expect(result.currentSandSide).toBe(48.7)
      expect(result.currentSandCore).toBe(62.4)
      expect(result.currentWaterTempIn).toBe(37.3)
      expect(result.currentWaterTempOut).toBe(40.1)
      expect(result.currentFlow).toBe(5.6)
      expect(result.currentPower).toBe(2450)
      expect(result.currentEnergy).toBe(0.009)

      // Should have correct history lengths
      expect(result.temperatureHistory).toHaveLength(2)
      expect(result.energyHistory).toHaveLength(2)
      expect(result.flowHistory).toHaveLength(2)
      expect(result.pumpHistory).toHaveLength(2)

      // Should convert events
      expect(result.events).toHaveLength(1)
      expect(result.events[0].type).toBe('pump')
    })

    it('should handle empty history data', () => {
      const emptyHistory: HistoryResponse = { from: '2026-05-01T10:00:00Z', to: '2026-05-01T11:00:00Z', count: 0, data: [] }
      const emptyEnergyHistory: EnergyHistoryResponse = { from: '2026-05-01T10:00:00Z', to: '2026-05-01T11:00:00Z', count: 0, data: [] }

      const result = convertHistoryToDashboard(
        emptyHistory,
        emptyEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      expect(result.currentSandSide).toBe(0)
      expect(result.currentSandCore).toBe(0)
      expect(result.temperatureHistory).toHaveLength(0)
      expect(result.energyHistory).toHaveLength(0)
    })
  })

  describe('convertHistoryToDashboardWithLatest', () => {
    it('should use absolute latest sensor data for current KPIs', () => {
      const result = convertHistoryToDashboardWithLatest(
        mockLatestData,
        mockLatestEnergy,
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      // Should use absolute latest for current values, not last historical point
      expect(result.currentSandSide).toBe(48.9)
      expect(result.currentSandCore).toBe(62.8)
      expect(result.currentWaterTempIn).toBe(37.6)
      expect(result.currentWaterTempOut).toBe(40.3)
      expect(result.currentFlow).toBe(5.8)
      expect(result.currentPower).toBe(2500)
      expect(result.currentEnergy).toBe(0.01)

      // Should have historical data plus latest point
      expect(result.temperatureHistory.length).toBeGreaterThanOrEqual(2)
      expect(result.energyHistory.length).toBeGreaterThanOrEqual(2)
    })

    it('should append latest data point to history if newer than last historical point', () => {
      const result = convertHistoryToDashboardWithLatest(
        mockLatestData,
        mockLatestEnergy,
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      // Latest timestamp is 10:35, last historical is 10:33
      // Should have 2 historical + 1 latest = 3 points
      expect(result.temperatureHistory).toHaveLength(3)
      expect(result.energyHistory).toHaveLength(3)
      expect(result.flowHistory).toHaveLength(3)

      // Last point should be the latest data
      const lastTemp = result.temperatureHistory[result.temperatureHistory.length - 1]
      expect(lastTemp.timestamp).toBe(new Date('2026-05-01T10:35:00Z').getTime())
      expect(lastTemp.temperatures.find(t => t.label === 'sand_side')?.value).toBe(48.9)
    })

    it('should not duplicate data if latest timestamp matches last historical point', () => {
      // Set latest to same timestamp as last historical point
      const sameTimeLatest = { ...mockLatestData, timestamp: '2026-05-01T10:33:00Z' }
      const sameTimeEnergy = { ...mockLatestEnergy, timestamp: '2026-05-01T10:33:00Z' }

      const result = convertHistoryToDashboardWithLatest(
        sameTimeLatest,
        sameTimeEnergy,
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      // Should still have 2 points (no duplication)
      expect(result.temperatureHistory).toHaveLength(2)
    })

    it('should handle control status correctly', () => {
      const result = convertHistoryToDashboardWithLatest(
        mockLatestData,
        mockLatestEnergy,
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      expect(result.isPumpActive).toBe(true)
      expect(result.heaters).toHaveLength(3)
      expect(result.heaters.every(h => h.active)).toBe(true)
      expect(result.pumpLastChanged).toBe(new Date('2026-05-01T09:00:00Z').getTime())
    })
  })

  describe('mergeLatestData', () => {
    it('should update current values with latest sensor data', () => {
      const existingData: DashboardData = convertHistoryToDashboard(
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      const newLatest: SensorData = {
        timestamp: '2026-05-01T10:40:00Z',
        product_key: 'test-key',
        temperatures: [
          { index: 0, label: 'sand_side', value: 49.0 },
          { index: 1, label: 'sand_core', value: 63.0 },
          { index: 2, label: 'water_in', value: 38.0 },
          { index: 3, label: 'water_out', value: 41.0 },
        ],
        flow_rates: [{ index: 0, value: 6.0 }],
        power_w: 2600,
        energy_kwh: 0.012,
        status: 'OK',
      }

      const newEnergy: EnergyReading = {
        timestamp: '2026-05-01T10:40:00Z',
        energy_kwh: 0.012,
      }

      const result = mergeLatestData(
        existingData,
        newLatest,
        newEnergy,
        mockControlStatus,
        []
      )

      expect(result.currentSandSide).toBe(49.0)
      expect(result.currentSandCore).toBe(63.0)
      expect(result.currentFlow).toBe(6.0)
      expect(result.currentPower).toBe(2600)
      expect(result.currentEnergy).toBe(0.012)

      // Should append new data point to history
      expect(result.temperatureHistory.length).toBe(existingData.temperatureHistory.length + 1)
    })

    it('should not add duplicate data points with same timestamp', () => {
      const existingData: DashboardData = convertHistoryToDashboard(
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      // Use same timestamp as last point
      const sameTimeLatest = { ...mockLatestData, timestamp: '2026-05-01T10:33:00Z' }
      const sameTimeEnergy = { ...mockLatestEnergy, timestamp: '2026-05-01T10:33:00Z' }

      const result = mergeLatestData(
        existingData,
        sameTimeLatest,
        sameTimeEnergy,
        mockControlStatus,
        []
      )

      // Should not add new point
      expect(result.temperatureHistory.length).toBe(existingData.temperatureHistory.length)
    })

    it('should maintain max history points limit', () => {
      const existingData: DashboardData = convertHistoryToDashboard(
        mockHistory,
        mockEnergyHistory,
        mockControlStatus,
        mockEvents
      )

      const newLatest: SensorData = {
        timestamp: '2026-05-01T10:40:00Z',
        product_key: 'test-key',
        temperatures: [
          { index: 0, label: 'sand_side', value: 49.0 },
          { index: 1, label: 'sand_core', value: 63.0 },
          { index: 2, label: 'water_in', value: 38.0 },
          { index: 3, label: 'water_out', value: 41.0 },
        ],
        flow_rates: [{ index: 0, value: 6.0 }],
        power_w: 2600,
        energy_kwh: 0.012,
        status: 'OK',
      }

      const newEnergy: EnergyReading = {
        timestamp: '2026-05-01T10:40:00Z',
        energy_kwh: 0.012,
      }

      const maxPoints = 2
      const result = mergeLatestData(
        existingData,
        newLatest,
        newEnergy,
        mockControlStatus,
        [],
        maxPoints
      )

      // Should maintain max points
      expect(result.temperatureHistory.length).toBeLessThanOrEqual(maxPoints)
      expect(result.energyHistory.length).toBeLessThanOrEqual(maxPoints)
    })
  })
})
