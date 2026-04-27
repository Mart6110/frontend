import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { subHours } from "date-fns"
import { DEFAULT_VIEW_MODE, DEFAULT_REALTIME_CONFIG, type ViewMode, type RealtimeTimeConfig } from "@/constants/timeRanges"
import type { DashboardData } from "@/services/dataTransform"

interface DashboardState {
  // Advanced View State
  advanced: {
    allData: DashboardData | null
    displayData: DashboardData | null
    isLoading: boolean
    isFiltering: boolean
    viewMode: ViewMode
    realtimeConfig: RealtimeTimeConfig
    startDate: string | null // ISO string for serialization
    endDate: string | null // ISO string for serialization
  }
  // Simple View State
  simple: {
    allData: DashboardData | null
    displayData: DashboardData | null
    data: DashboardData | null
    isLoading: boolean
    realtimeConfig: RealtimeTimeConfig
  }
}

const initialState: DashboardState = {
  advanced: {
    allData: null,
    displayData: null,
    isLoading: true,
    isFiltering: false,
    viewMode: DEFAULT_VIEW_MODE,
    realtimeConfig: DEFAULT_REALTIME_CONFIG,
    startDate: subHours(new Date(), DEFAULT_REALTIME_CONFIG.value).toISOString(),
    endDate: new Date().toISOString(),
  },
  simple: {
    allData: null,
    displayData: null,
    data: null,
    isLoading: true,
    realtimeConfig: DEFAULT_REALTIME_CONFIG,
  },
}

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    // Advanced View Actions
    setAllData(state, action: PayloadAction<DashboardData>) {
      state.advanced.allData = action.payload
    },
    setDisplayData(state, action: PayloadAction<DashboardData>) {
      state.advanced.displayData = action.payload
    },
    setIsLoading(state, action: PayloadAction<boolean>) {
      state.advanced.isLoading = action.payload
    },
    setIsFiltering(state, action: PayloadAction<boolean>) {
      state.advanced.isFiltering = action.payload
    },
    setViewMode(state, action: PayloadAction<ViewMode>) {
      state.advanced.viewMode = action.payload
    },
    setRealtimeConfig(state, action: PayloadAction<RealtimeTimeConfig>) {
      state.advanced.realtimeConfig = action.payload
    },
    // Legacy action for backward compatibility
    setRealtimeHours(state, action: PayloadAction<number>) {
      state.advanced.realtimeConfig = { value: action.payload, unit: 'hours' }
    },
    setStartDate(state, action: PayloadAction<Date | null>) {
      state.advanced.startDate = action.payload ? action.payload.toISOString() : null
    },
    setEndDate(state, action: PayloadAction<Date | null>) {
      state.advanced.endDate = action.payload ? action.payload.toISOString() : null
    },
    setDateRange(state, action: PayloadAction<{ startDate: Date | null; endDate: Date | null }>) {
      state.advanced.startDate = action.payload.startDate ? action.payload.startDate.toISOString() : null
      state.advanced.endDate = action.payload.endDate ? action.payload.endDate.toISOString() : null
    },
    // Simple View Actions
    setSimpleAllData(state, action: PayloadAction<DashboardData>) {
      state.simple.allData = action.payload
    },
    setSimpleDisplayData(state, action: PayloadAction<DashboardData>) {
      state.simple.displayData = action.payload
    },
    setSimpleData(state, action: PayloadAction<DashboardData>) {
      state.simple.data = action.payload
    },
    setSimpleIsLoading(state, action: PayloadAction<boolean>) {
      state.simple.isLoading = action.payload
    },
    setSimpleRealtimeConfig(state, action: PayloadAction<RealtimeTimeConfig>) {
      state.simple.realtimeConfig = action.payload
    },
  },
})

export const {
  setAllData,
  setDisplayData,
  setIsLoading,
  setIsFiltering,
  setViewMode,
  setRealtimeConfig,
  setRealtimeHours,
  setStartDate,
  setEndDate,
  setDateRange,
  setSimpleAllData,
  setSimpleDisplayData,
  setSimpleData,
  setSimpleIsLoading,
  setSimpleRealtimeConfig,
} = dashboardSlice.actions

export default dashboardSlice.reducer
