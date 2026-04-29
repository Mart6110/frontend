// Data Transformation Service
// Converts API responses to dashboard data format

import type { SensorData, HistoryResponse, ControlStatus, SystemEvent } from './api'

// Helper functions to extract temperature values from sensor data
function getSandTemp(data: SensorData): number {
  // Look for temperature with "sand" label
  const sandTemp = data.temperatures.find(t => 
    t.label.toLowerCase().includes('sand')
  )
  if (sandTemp) return sandTemp.value
  
  // Fallback to first temperature if no sand label found
  return data.temperatures[0]?.value ?? 0
}

function getWaterTempIn(data: SensorData): number {
  // Look for temperature with "in" or "ind" label
  const waterTempIn = data.temperatures.find(t => 
    t.label.toLowerCase().includes('in') || t.label.toLowerCase().includes('ind')
  )
  if (waterTempIn) return waterTempIn.value
  
  // Fallback to second temperature if available
  return data.temperatures[1]?.value ?? 0
}

function getWaterTempOut(data: SensorData): number {
  // Look for temperature with "out" or "ud" label
  const waterTempOut = data.temperatures.find(t => 
    t.label.toLowerCase().includes('out') || t.label.toLowerCase().includes('ud')
  )
  if (waterTempOut) return waterTempOut.value
  
  // Fallback to third temperature if available
  return data.temperatures[2]?.value ?? 0
}

function getFlowRate(data: SensorData): number {
  // Get the first flow rate reading
  return data.flow_rates[0]?.value ?? 0
}

// Dashboard data structures expected by components
export interface DataPoint {
  timestamp: number
  value: number
}

export interface TemperatureData {
  timestamp: number
  temperature: number
}

export interface EnergyData {
  timestamp: number
  energyIn: number
  energyOut: number
}

export interface FlowData {
  timestamp: number
  flow: number
}

export interface PumpStatus {
  timestamp: number
  active: boolean
}

export interface DashboardEvent {
  id: string
  timestamp: number
  type: 'pump' | 'temperature' | 'energy' | 'error' | 'warning'
  message: string
  severity: 'info' | 'warning' | 'error'
}

export interface DashboardData {
  currentTemperature: number
  currentWaterTempIn: number
  currentWaterTempOut: number
  currentFlow: number
  isPumpActive: boolean
  pumpLastChanged?: number
  heaters: {
    index: number
    active: boolean
    lastChanged?: number
  }[]
  currentPower: number
  currentEnergy: number
  temperatureHistory: TemperatureData[]
  energyHistory: EnergyData[]
  flowHistory: FlowData[]
  pumpHistory: PumpStatus[]
  events: DashboardEvent[]
}

/**
 * Convert API SystemEvent to DashboardEvent
 */
function convertEvent(event: SystemEvent): DashboardEvent {
  // Map event types
  let type: DashboardEvent['type'] = 'warning'
  let severity: DashboardEvent['severity'] = 'info'
  
  switch (event.type) {
    case 'pump_start':
    case 'pump_stop':
      type = 'pump'
      severity = 'info'
      break
    case 'heat_on':
    case 'heat_off':
      type = 'energy'
      severity = 'info'
      break
    case 'warning':
      type = 'warning'
      severity = 'warning'
      break
    case 'error':
      type = 'error'
      severity = 'error'
      break
  }
  
  return {
    id: `event-${event.id}`,
    timestamp: new Date(event.timestamp).getTime(),
    type,
    message: event.description,
    severity,
  }
}

/**
 * Convert API history response to dashboard data format
 */
export function convertHistoryToDashboard(
  history: HistoryResponse,
  controlStatus: ControlStatus,
  events: SystemEvent[]
): DashboardData {
  const { data } = history
  
  if (data.length === 0) {
    // Return empty dashboard data
    return {
      currentTemperature: 0,
      currentWaterTempIn: 0,
      currentWaterTempOut: 0,
      currentFlow: 0,
      isPumpActive: false,
      pumpLastChanged: undefined,
      heaters: controlStatus.heaters.map(h => ({
        index: h.index,
        active: h.active,
        lastChanged: new Date(h.last_changed).getTime(),
      })),
      currentPower: 0,
      currentEnergy: 0,
      temperatureHistory: [],
      energyHistory: [],
      flowHistory: [],
      pumpHistory: [],
      events: events.map(convertEvent),
    }
  }
  
  // Get latest data point
  const latest = data[data.length - 1]
  
  // Convert history arrays
  const temperatureHistory: TemperatureData[] = data.map(d => ({
    timestamp: new Date(d.timestamp).getTime(),
    temperature: getSandTemp(d),
  }))
  
  const energyHistory: EnergyData[] = data.map(d => ({
    timestamp: new Date(d.timestamp).getTime(),
    energyIn: d.power_w / 1000, // Convert W to kW for power
    energyOut: d.energy_kwh, // Accumulated energy in kWh
  }))
  
  const flowHistory: FlowData[] = data.map(d => ({
    timestamp: new Date(d.timestamp).getTime(),
    flow: getFlowRate(d),
  }))
  
  // Build pump history from control status
  const pumpHistory: PumpStatus[] = data.map(d => ({
    timestamp: new Date(d.timestamp).getTime(),
    active: controlStatus.pump.active,
  }))
  
  return {
    currentTemperature: getSandTemp(latest),
    currentWaterTempIn: getWaterTempIn(latest),
    currentWaterTempOut: getWaterTempOut(latest),
    currentFlow: getFlowRate(latest),
    isPumpActive: controlStatus.pump.active,
    pumpLastChanged: new Date(controlStatus.pump.last_changed).getTime(),
    heaters: controlStatus.heaters.map(h => ({
      index: h.index,
      active: h.active,
      lastChanged: new Date(h.last_changed).getTime(),
    })),
    currentPower: latest.power_w,
    currentEnergy: latest.energy_kwh,
    temperatureHistory,
    energyHistory,
    flowHistory,
    pumpHistory,
    events: events.map(convertEvent),
  }
}

/**
 * Convert single sensor reading to dashboard data
 */
export function convertLatestToDashboard(
  latest: SensorData,
  controlStatus: ControlStatus,
  events: SystemEvent[]
): DashboardData {
  const timestamp = new Date(latest.timestamp).getTime()
  
  return {
    currentTemperature: getSandTemp(latest),
    currentWaterTempIn: getWaterTempIn(latest),
    currentWaterTempOut: getWaterTempOut(latest),
    currentFlow: getFlowRate(latest),
    isPumpActive: controlStatus.pump.active,
    pumpLastChanged: new Date(controlStatus.pump.last_changed).getTime(),
    heaters: controlStatus.heaters.map(h => ({
      index: h.index,
      active: h.active,
      lastChanged: new Date(h.last_changed).getTime(),
    })),
    currentPower: latest.power_w,
    currentEnergy: latest.energy_kwh,
    temperatureHistory: [{
      timestamp,
      temperature: getSandTemp(latest),
    }],
    energyHistory: [{
      timestamp,
      energyIn: latest.power_w / 1000,
      energyOut: latest.energy_kwh,
    }],
    flowHistory: [{
      timestamp,
      flow: getFlowRate(latest),
    }],
    pumpHistory: [{
      timestamp,
      active: controlStatus.pump.active,
    }],
    events: events.map(convertEvent),
  }
}

/**
 * Merge new data point into existing dashboard data (for real-time updates)
 */
export function mergeLatestData(
  existingData: DashboardData,
  latest: SensorData,
  controlStatus: ControlStatus,
  newEvents: SystemEvent[],
  maxHistoryPoints: number = 5000
): DashboardData {
  const timestamp = new Date(latest.timestamp).getTime()
  
  // Check if this timestamp already exists (prevent duplicates)
  const lastTempTimestamp = existingData.temperatureHistory[existingData.temperatureHistory.length - 1]?.timestamp
  const isNewData = !lastTempTimestamp || timestamp > lastTempTimestamp
  
  // Only add new data points if the timestamp is actually newer
  const temperatureHistory = isNewData
    ? [
        ...existingData.temperatureHistory.slice(-maxHistoryPoints + 1),
        { timestamp, temperature: getSandTemp(latest) }
      ]
    : existingData.temperatureHistory
  
  const energyHistory = isNewData
    ? [
        ...existingData.energyHistory.slice(-maxHistoryPoints + 1),
        { 
          timestamp, 
          energyIn: latest.power_w / 1000,
          energyOut: latest.energy_kwh
        }
      ]
    : existingData.energyHistory
  
  const flowHistory = isNewData
    ? [
        ...existingData.flowHistory.slice(-maxHistoryPoints + 1),
        { timestamp, flow: getFlowRate(latest) }
      ]
    : existingData.flowHistory
  
  const pumpHistory = isNewData
    ? [
        ...existingData.pumpHistory.slice(-maxHistoryPoints + 1),
        { timestamp, active: controlStatus.pump.active }
      ]
    : existingData.pumpHistory
  
  // Merge events (keep last 1000)
  const events = [
    ...newEvents.map(convertEvent),
    ...existingData.events.slice(0, 1000 - newEvents.length)
  ]
  
  return {
    currentTemperature: getSandTemp(latest),
    currentWaterTempIn: getWaterTempIn(latest),
    currentWaterTempOut: getWaterTempOut(latest),
    currentFlow: getFlowRate(latest),
    isPumpActive: controlStatus.pump.active,
    pumpLastChanged: new Date(controlStatus.pump.last_changed).getTime(),
    heaters: controlStatus.heaters.map(h => ({
      index: h.index,
      active: h.active,
      lastChanged: new Date(h.last_changed).getTime(),
    })),
    currentPower: latest.power_w,
    currentEnergy: latest.energy_kwh,
    temperatureHistory,
    energyHistory,
    flowHistory,
    pumpHistory,
    events,
  }
}

/**
 * Filter dashboard data by time range (milliseconds from now)
 */
export function filterDataByTimeRange(data: DashboardData, millisecondsFromNow: number): DashboardData {
  const now = Date.now()
  const cutoffTime = now - millisecondsFromNow
  
  return {
    ...data,
    temperatureHistory: data.temperatureHistory.filter(d => d.timestamp >= cutoffTime),
    energyHistory: data.energyHistory.filter(d => d.timestamp >= cutoffTime),
    flowHistory: data.flowHistory.filter(d => d.timestamp >= cutoffTime),
    pumpHistory: data.pumpHistory.filter(d => d.timestamp >= cutoffTime),
    events: data.events.filter(e => e.timestamp >= cutoffTime),
  }
}

/**
 * Filter dashboard data by date range
 */
export function filterDataByDateRange(data: DashboardData, startDate: Date, endDate: Date): DashboardData {
  const start = startDate.getTime()
  const end = endDate.getTime()
  
  return {
    ...data,
    temperatureHistory: data.temperatureHistory.filter(d => d.timestamp >= start && d.timestamp <= end),
    energyHistory: data.energyHistory.filter(d => d.timestamp >= start && d.timestamp <= end),
    flowHistory: data.flowHistory.filter(d => d.timestamp >= start && d.timestamp <= end),
    pumpHistory: data.pumpHistory.filter(d => d.timestamp >= start && d.timestamp <= end),
    events: data.events.filter(e => e.timestamp >= start && e.timestamp <= end),
  }
}
