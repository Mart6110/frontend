/**
 * API Type Definitions
 * 
 * TypeScript interfaces for all API requests and responses
 * Based on backend REST API specification at /api/v1
 */

// === /data endpoints ===

export interface LatestDataResponse {
  timestamp: string // ISO 8601
  product_key: string
  sand_temp: number
  water_temp_in: number
  water_temp_out: number
  flow_rate: number
  power_w: number
  energy_kwh: number
  status: 'OK' | 'WARNING' | 'CRITICAL' | 'ERROR'
}

export interface HistoryDataPoint {
  timestamp: string // ISO 8601
  sand_temp: number
  water_temp_in: number
  water_temp_out: number
  flow_rate: number
  power_w: number
  energy_kwh: number
  status: string
}

export interface HistoryDataResponse {
  from: string
  to: string
  interval?: string
  count: number
  data: HistoryDataPoint[]
}

export interface HistoryDataParams {
  from: string // ISO 8601
  to: string // ISO 8601
  interval?: '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1d'
  limit?: number
}

// === /control endpoints ===

export interface ControlStatusResponse {
  heater: {
    active: boolean
    source: 'manual' | 'rule'
    last_changed: string // ISO 8601
  }
  pump: {
    active: boolean
    source: 'manual' | 'rule'
    last_changed: string // ISO 8601
  }
}

export interface ControlActionRequest {
  action: 'start' | 'stop' | 'on' | 'off'
  source: 'manual' | 'rule'
}

export interface ControlActionResponse {
  success: boolean
  action: string
  source: string
  timestamp: string // ISO 8601
  event_id: number
}

// === /settings endpoints ===

export interface SettingsResponse {
  max_sand_temp: number
  min_pump_temp: number
  pump_interval_seconds: number
  price_limit_dkk: number
  auto_heating_enabled: boolean
  auto_pump_enabled: boolean
}

export interface ElectricityPrice {
  hour: string // ISO 8601
  price_dkk_kwh: number
}

export interface ElectricityPriceResponse {
  date: string
  area: 'DK1' | 'DK2'
  currency: string
  last_updated: string // ISO 8601
  prices: ElectricityPrice[]
}

export interface ElectricityPriceParams {
  date?: string // YYYY-MM-DD
  area?: 'DK1' | 'DK2'
}

// === /events endpoints ===

export interface SystemEvent {
  id: number
  type: 'pump_start' | 'pump_stop' | 'heat_on' | 'heat_off' | 'warning' | 'error'
  source: 'manual' | 'rule' | 'system'
  timestamp: string // ISO 8601
  description: string
}

export interface EventsResponse {
  total: number
  limit: number
  offset: number
  events: SystemEvent[]
}

export interface EventsParams {
  from?: string // ISO 8601
  to?: string // ISO 8601
  type?: string // comma-separated
  source?: 'manual' | 'rule'
  limit?: number
  offset?: number
}

export interface Alert {
  id: number
  severity: 'WARNING' | 'CRITICAL' | 'ERROR'
  type: string
  message: string
  timestamp: string // ISO 8601
  acknowledged: boolean
}

export interface AlertsResponse {
  count: number
  alerts: Alert[]
}

export interface AcknowledgeAlertResponse {
  success: boolean
  alert_id: number
  acknowledged_at: string // ISO 8601
}

// === /auth endpoints ===

export interface ValidateKeyResponse {
  valid: boolean
  device_name?: string
  product_key?: string
  error?: string
}

// === Common types ===

export type PumpAction = 'start' | 'stop'
export type HeaterAction = 'on' | 'off'
export type ActionSource = 'manual' | 'rule' | 'system'
export type DataStatus = 'OK' | 'WARNING' | 'CRITICAL' | 'ERROR'
export type AlertSeverity = 'WARNING' | 'CRITICAL' | 'ERROR'
export type EventType = 'pump_start' | 'pump_stop' | 'heat_on' | 'heat_off' | 'warning' | 'error'
export type TimeInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1d'
export type PriceArea = 'DK1' | 'DK2'
