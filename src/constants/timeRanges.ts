export const REALTIME_HOURS = [1, 2, 3, 5, 6, 12, 24] as const

export type RealtimeHours = typeof REALTIME_HOURS[number]

export const DEFAULT_REALTIME_HOURS: RealtimeHours = 6

export type ViewMode = 'realtime' | 'dateRange'

export const DEFAULT_VIEW_MODE: ViewMode = 'realtime'
