// Dashboard Service
// High-level service for fetching and managing dashboard data

import * as api from './api'
import * as transform from './dataTransform'
import type { DashboardData } from './dataTransform'

export type { DashboardData }

/**
 * Fetch initial dashboard data for a time range
 */
export async function fetchDashboardData(params: {
  from: Date
  to: Date
  interval?: '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1d'
  useAbsoluteLatest?: boolean
}): Promise<DashboardData> {
  try {
    // Check if we're viewing realtime data (within last 5 minutes) or historical data
    const now = new Date()
    const isRealtime = params.useAbsoluteLatest ?? (now.getTime() - params.to.getTime() < 300000) // within 5 minutes
    
    if (isRealtime) {
      // Fetch data in parallel - get absolute latest for current KPIs
      const [latestData, latestEnergy, history, energyHistory, controlStatus, eventsResponse] = await Promise.all([
        api.getLatestData(),
        api.getLatestEnergy(),
        api.getHistoryData({
          from: params.from.toISOString(),
          to: params.to.toISOString(),
          interval: params.interval,
          limit: 5000,
        }),
        api.getEnergyHistory({
          from: params.from.toISOString(),
          to: params.to.toISOString(),
          limit: 5000,
        }),
        api.getControlStatus(),
        api.getEvents({
          from: params.from.toISOString(),
          to: params.to.toISOString(),
          limit: 1000,
        }),
      ])
      
      return transform.convertHistoryToDashboardWithLatest(
        latestData,
        latestEnergy,
        history,
        energyHistory,
        controlStatus,
        eventsResponse.events
      )
    } else {
      // For historical date ranges, use the last point from history as "latest"
      const [history, energyHistory, controlStatus, eventsResponse] = await Promise.all([
        api.getHistoryData({
          from: params.from.toISOString(),
          to: params.to.toISOString(),
          interval: params.interval,
          limit: 5000,
        }),
        api.getEnergyHistory({
          from: params.from.toISOString(),
          to: params.to.toISOString(),
          limit: 5000,
        }),
        api.getControlStatus(),
        api.getEvents({
          from: params.from.toISOString(),
          to: params.to.toISOString(),
          limit: 1000,
        }),
      ])
      
      return transform.convertHistoryToDashboard(
        history,
        energyHistory,
        controlStatus,
        eventsResponse.events
      )
    }
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error)
    throw error
  }
}

/**
 * Fetch latest sensor data for real-time updates
 */
export async function fetchLatestData(): Promise<{
  data: api.SensorData
  energyData: api.EnergyReading
  controlStatus: api.ControlStatus
  events: api.SystemEvent[]
}> {
  try {
    const [data, energyData, controlStatus, eventsResponse] = await Promise.all([
      api.getLatestData(),
      api.getLatestEnergy(),
      api.getControlStatus(),
      api.getEvents({ limit: 100 }),
    ])
    
    return {
      data,
      energyData,
      controlStatus,
      events: eventsResponse.events,
    }
  } catch (error) {
    console.error('Failed to fetch latest data:', error)
    throw error
  }
}

/**
 * Update existing dashboard data with latest sensor reading
 */
export function updateDashboardWithLatest(
  existingData: DashboardData,
  latest: api.SensorData,
  energyData: api.EnergyReading,
  controlStatus: api.ControlStatus,
  events: api.SystemEvent[]
): DashboardData {
  return transform.mergeLatestData(existingData, latest, energyData, controlStatus, events)
}

/**
 * Control pump (start/stop)
 */
export async function controlPump(action: 'start' | 'stop'): Promise<api.ControlResponse> {
  return api.controlPump(action, 'manual')
}

/**
 * Control heater (on/off)
 */
export async function controlHeater(index: number, action: 'on' | 'off'): Promise<api.ControlResponse> {
  return api.controlHeater(index, action, 'manual')
}

/**
 * Get user settings
 */
export async function getSettings(): Promise<api.Settings> {
  return api.getSettings()
}

/**
 * Update user settings
 */
export async function updateSettings(settings: Partial<api.Settings>): Promise<api.SettingsUpdateResponse> {
  return api.updateSettings(settings)
}

/**
 * Get electricity prices
 */
export async function getElectricityPrice(params?: {
  date?: string
  area?: 'DK1' | 'DK2'
}): Promise<api.ElectricityPriceResponse> {
  return api.getElectricityPrice(params)
}

/**
 * Get active alerts
 */
export async function getAlerts(): Promise<api.AlertsResponse> {
  return api.getAlerts()
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: number): Promise<api.AcknowledgeAlertResponse> {
  return api.acknowledgeAlert(alertId)
}

/**
 * Validate product key
 */
export async function validateProductKey(productKey: string): Promise<api.ValidateKeyResponse> {
  return api.validateKey(productKey)
}

/**
 * Calculate appropriate interval based on time range
 */
export function calculateInterval(fromDate: Date, toDate: Date): '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1d' | undefined {
  const diffMs = toDate.getTime() - fromDate.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)
  
  if (diffHours <= 2) {
    return '1m' // 1 minute for <= 2 hours
  } else if (diffHours <= 12) {
    return '5m' // 5 minutes for <= 12 hours
  } else if (diffHours <= 24) {
    return '15m' // 15 minutes for <= 24 hours
  } else if (diffHours <= 72) {
    return '30m' // 30 minutes for <= 3 days
  } else if (diffHours <= 168) {
    return '1h' // 1 hour for <= 7 days
  } else if (diffHours <= 720) {
    return '6h' // 6 hours for <= 30 days
  } else {
    return '1d' // 1 day for > 30 days
  }
}
