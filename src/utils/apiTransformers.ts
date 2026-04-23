/**
 * API Data Transformers
 * 
 * Transforms API responses to match dashboard component expectations
 */

import type { LatestDataResponse, HistoryDataResponse } from '@/store/apiTypes'

export interface DashboardData {
  currentTemperature: number
  currentPower: number
  currentEfficiency: number
  stateOfCharge: number
  currentFlow: number
  isPumpActive: boolean
  temperatureHistory: Array<{ timestamp: number; value: number }>
  energyHistory: Array<{ timestamp: number; energyIn: number; energyOut: number }>
  pumpHistory: Array<{ timestamp: number; isActive: boolean }>
  events: Array<{
    id: string
    timestamp: number
    type: 'pump' | 'temperature' | 'energy' | 'error' | 'warning'
    severity: 'info' | 'warning' | 'error'
    message: string
  }>
}

/**
 * Transform latest API data to dashboard format
 */
export function transformLatestData(apiData: LatestDataResponse): Partial<DashboardData> {
  return {
    currentTemperature: apiData.sand_temp,
    currentPower: apiData.power_w / 1000, // Convert W to kW
    currentFlow: apiData.flow_rate,
    currentEfficiency: calculateEfficiency(apiData),
    stateOfCharge: calculateStateOfCharge(apiData.energy_kwh),
    isPumpActive: apiData.flow_rate > 0.1, // Pump active if flow > 0.1 L/min
  }
}

/**
 * Transform history API data to dashboard format
 */
export function transformHistoryData(apiData: HistoryDataResponse): Partial<DashboardData> {
  const temperatureHistory = apiData.data.map(point => ({
    timestamp: new Date(point.timestamp).getTime(),
    value: point.sand_temp,
  }))

  const energyHistory = apiData.data.map(point => ({
    timestamp: new Date(point.timestamp).getTime(),
    energyIn: point.energy_kwh,
    energyOut: point.energy_kwh * 0.85, // Assume 85% efficiency for output
  }))

  const pumpHistory = apiData.data.map(point => ({
    timestamp: new Date(point.timestamp).getTime(),
    isActive: point.flow_rate > 0.1,
  }))

  return {
    temperatureHistory,
    energyHistory,
    pumpHistory,
  }
}

/**
 * Calculate efficiency from temperature differential and flow rate
 */
function calculateEfficiency(data: LatestDataResponse): number {
  const tempDiff = data.water_temp_out - data.water_temp_in
  const flowRate = data.flow_rate
  
  if (tempDiff <= 0 || flowRate <= 0) {
    return 0
  }
  
  // Simplified efficiency calculation based on heat transfer
  // Q = m * c * ΔT where c (water) ≈ 4.18 kJ/(kg·K)
  const thermalPower = flowRate * tempDiff * 4.18 / 60 // kW (flow in L/min)
  const electricalPower = data.power_w / 1000 // kW
  
  if (electricalPower <= 0) {
    return 100 // No power consumption = 100% efficiency (heat release mode)
  }
  
  const efficiency = (thermalPower / electricalPower) * 100
  
  // Cap efficiency at reasonable values
  return Math.min(Math.max(efficiency, 0), 100)
}

/**
 * Calculate state of charge from accumulated energy
 * Assumes max capacity of 10 kWh for visualization
 */
function calculateStateOfCharge(energyKwh: number): number {
  const maxCapacity = 10 // kWh
  const soc = (energyKwh / maxCapacity) * 100
  return Math.min(Math.max(soc, 0), 100)
}

/**
 * Merge latest and history data into complete dashboard data
 */
export function mergeDashboardData(
  latest: Partial<DashboardData>,
  history: Partial<DashboardData>,
  events: DashboardData['events'] = []
): DashboardData {
  return {
    currentTemperature: latest.currentTemperature ?? 0,
    currentPower: latest.currentPower ?? 0,
    currentEfficiency: latest.currentEfficiency ?? 0,
    stateOfCharge: latest.stateOfCharge ?? 0,
    currentFlow: latest.currentFlow ?? 0,
    isPumpActive: latest.isPumpActive ?? false,
    temperatureHistory: history.temperatureHistory ?? [],
    energyHistory: history.energyHistory ?? [],
    pumpHistory: history.pumpHistory ?? [],
    events,
  }
}
