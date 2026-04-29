// API Service for Sand Battery System
// Base URL and utilities for backend communication

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1'

// Log API configuration in development
if (import.meta.env.DEV) {
  console.log('🔌 API Base URL:', API_BASE_URL)
}

// Helper function to get API key from cookie
function getProductKey(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)apiKey=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

// Helper function to create headers with product key
function createHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  }
  
  const productKey = getProductKey()
  if (productKey) {
    headers['X-Product-Key'] = productKey
  }
  
  return headers
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`
  const headers = createHeaders()
  
  const response = await fetch(url, {
    ...options,
    credentials: 'include',
    headers: {
      ...headers,
      ...options.headers,
    },
  })
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `API Error: ${response.status} ${response.statusText}`)
  }
  
  return response.json()
}

// ============================================================================
// Type Definitions
// ============================================================================

export interface TemperatureReading {
  index: number
  label: string
  value: number
}

export interface FlowRateReading {
  index: number
  value: number
}

export interface SensorData {
  timestamp: string // ISO 8601 UTC
  product_key: string
  temperatures: TemperatureReading[]
  flow_rates: FlowRateReading[]
  power_w: number
  energy_kwh: number
  status: 'OK' | 'WARNING' | 'CRITICAL' | 'ERROR'
}

export interface HistoryResponse {
  from: string
  to: string
  interval?: string
  count: number
  data: SensorData[]
}

export interface ControlStatus {
  heaters: {
    index: number
    active: boolean
    source: 'manual' | 'rule'
    last_changed: string
  }[]
  pump: {
    index: number
    active: boolean
    source: 'manual' | 'rule'
    last_changed: string
  }
}

export interface ControlResponse {
  success: boolean
  action: string
  source: string
  timestamp: string
  event_id: number
}

export interface Settings {
  max_sand_temp: number
  min_pump_temp: number
  pump_interval_seconds: number
  price_limit_dkk: number
  auto_heating_enabled: boolean
  auto_pump_enabled: boolean
}

export interface SettingsUpdateResponse {
  success: boolean
  updated_fields: string[]
}

export interface ElectricityPrice {
  hour: string
  price_dkk_kwh: number
}

export interface ElectricityPriceResponse {
  date: string
  area: string
  currency: string
  last_updated: string
  prices: ElectricityPrice[]
}

export interface SystemEvent {
  id: number
  type: 'pump_start' | 'pump_stop' | 'heat_on' | 'heat_off' | 'warning' | 'error'
  source: 'manual' | 'rule' | 'system'
  timestamp: string
  description: string
}

export interface EventsResponse {
  total: number
  limit: number
  offset: number
  events: SystemEvent[]
}

export interface Alert {
  id: number
  severity: 'WARNING' | 'CRITICAL' | 'ERROR'
  type: string
  message: string
  timestamp: string
  acknowledged: boolean
}

export interface AlertsResponse {
  count: number
  alerts: Alert[]
}

export interface AcknowledgeAlertResponse {
  success: boolean
  alert_id: number
  acknowledged_at: string
}

export interface ValidateKeyResponse {
  valid: boolean
  device_name?: string
  product_key?: string
  error?: string
}

// ============================================================================
// API Functions - /data endpoints
// ============================================================================

/**
 * Get the latest sensor reading
 */
export async function getLatestData(): Promise<SensorData> {
  return apiRequest<SensorData>('/data/latest')
}

/**
 * Get historical sensor data
 */
export async function getHistoryData(params: {
  from: string // ISO 8601
  to: string // ISO 8601
  interval?: '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1d'
  limit?: number
}): Promise<HistoryResponse> {
  const queryParams = new URLSearchParams()
  queryParams.append('from', params.from)
  queryParams.append('to', params.to)
  if (params.interval) queryParams.append('interval', params.interval)
  if (params.limit) queryParams.append('limit', params.limit.toString())
  
  return apiRequest<HistoryResponse>(`/data/history?${queryParams.toString()}`)
}

/**
 * Post new sensor data (used by Arduino)
 */
export async function postSensorData(data: Omit<SensorData, 'status'>): Promise<void> {
  return apiRequest<void>('/data', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// API Functions - /control endpoints
// ============================================================================

/**
 * Control the water pump
 */
export async function controlPump(action: 'start' | 'stop', source: 'manual' | 'rule'): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('/control/pump', {
    method: 'POST',
    body: JSON.stringify({ action, source }),
  })
}

/**
 * Control the heater
 */
export async function controlHeater(index: number, action: 'on' | 'off', source: 'manual' | 'rule'): Promise<ControlResponse> {
  return apiRequest<ControlResponse>('/control/heater', {
    method: 'POST',
    body: JSON.stringify({ index, action, source }),
  })
}

/**
 * Get current status of pump and heater
 */
export async function getControlStatus(): Promise<ControlStatus> {
  return apiRequest<ControlStatus>('/control/status')
}

// ============================================================================
// API Functions - /settings endpoints
// ============================================================================

/**
 * Get current user settings
 */
export async function getSettings(): Promise<Settings> {
  return apiRequest<Settings>('/settings')
}

/**
 * Update user settings (partial update)
 */
export async function updateSettings(settings: Partial<Settings>): Promise<SettingsUpdateResponse> {
  return apiRequest<SettingsUpdateResponse>('/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  })
}

/**
 * Get electricity prices
 */
export async function getElectricityPrice(params?: {
  date?: string // YYYY-MM-DD
  area?: 'DK1' | 'DK2'
}): Promise<ElectricityPriceResponse> {
  const queryParams = new URLSearchParams()
  if (params?.date) queryParams.append('date', params.date)
  if (params?.area) queryParams.append('area', params.area)
  
  const queryString = queryParams.toString()
  return apiRequest<ElectricityPriceResponse>(
    `/settings/electricity-price${queryString ? `?${queryString}` : ''}`
  )
}

// ============================================================================
// API Functions - /events endpoints
// ============================================================================

/**
 * Get system events with filtering and pagination
 */
export async function getEvents(params?: {
  from?: string
  to?: string
  type?: string // comma-separated list
  source?: 'manual' | 'rule'
  limit?: number
  offset?: number
}): Promise<EventsResponse> {
  const queryParams = new URLSearchParams()
  if (params?.from) queryParams.append('from', params.from)
  if (params?.to) queryParams.append('to', params.to)
  if (params?.type) queryParams.append('type', params.type)
  if (params?.source) queryParams.append('source', params.source)
  if (params?.limit) queryParams.append('limit', params.limit.toString())
  if (params?.offset) queryParams.append('offset', params.offset.toString())
  
  const queryString = queryParams.toString()
  return apiRequest<EventsResponse>(`/events${queryString ? `?${queryString}` : ''}`)
}

/**
 * Get active alerts
 */
export async function getAlerts(): Promise<AlertsResponse> {
  return apiRequest<AlertsResponse>('/events/alerts')
}

/**
 * Acknowledge an alert
 */
export async function acknowledgeAlert(alertId: number): Promise<AcknowledgeAlertResponse> {
  return apiRequest<AcknowledgeAlertResponse>(`/events/alerts/${alertId}/acknowledge`, {
    method: 'POST',
  })
}

/**
 * Send heartbeat signal (used by Arduino)
 */
export async function sendHeartbeat(data: {
  product_key: string
  timestamp: string
  uptime_seconds?: number
}): Promise<{ success: boolean; received_at: string }> {
  return apiRequest('/events/heartbeat', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// ============================================================================
// API Functions - /auth endpoints
// ============================================================================

/**
 * Validate product key
 */
export async function validateKey(productKey: string): Promise<ValidateKeyResponse> {
  return apiRequest<ValidateKeyResponse>('/auth/validate-key', {
    method: 'POST',
    headers: {
      'X-Product-Key': productKey,
    },
  })
}
