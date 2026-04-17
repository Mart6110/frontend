// Time unit types
export type TimeUnit = 'minutes' | 'hours' | 'days'

// Realtime time configuration
export interface RealtimeTimeConfig {
  value: number
  unit: TimeUnit
}

// Default configuration
export const DEFAULT_REALTIME_CONFIG: RealtimeTimeConfig = {
  value: 6,
  unit: 'hours'
}

// Range constraints per unit
export const TIME_RANGES = {
  minutes: { min: 1, max: 60, step: 1 },
  hours: { min: 1, max: 24, step: 1 },
  days: { min: 1, max: 7, step: 1 }
} as const

// Legacy support
export const REALTIME_HOURS = [1, 2, 3, 5, 6, 12, 24] as const
export type RealtimeHours = typeof REALTIME_HOURS[number]
export const DEFAULT_REALTIME_HOURS: RealtimeHours = 6

export type ViewMode = 'realtime' | 'dateRange'
export const DEFAULT_VIEW_MODE: ViewMode = 'realtime'
