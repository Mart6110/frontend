import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import { subHours } from "date-fns"
import { DEFAULT_VIEW_MODE, DEFAULT_REALTIME_HOURS, type ViewMode, type RealtimeHours } from "@/constants/timeRanges"
import type { DashboardData } from "@/services/mockData"

interface DashboardState {
  // Advanced View State
  advanced: {
    allData: DashboardData | null
    displayData: DashboardData | null
    isLoading: boolean
    isFiltering: boolean
    viewMode: ViewMode
    realtimeHours: RealtimeHours
    startDate: string | null // ISO string for serialization
    endDate: string | null // ISO string for serialization
  }
  // Simple View State
  simple: {
    data: DashboardData | null
    isLoading: boolean
  }
}

const initialState: DashboardState = {
  advanced: {
    allData: null,
    displayData: null,
    isLoading: true,
    isFiltering: false,
    viewMode: DEFAULT_VIEW_MODE,
    realtimeHours: DEFAULT_REALTIME_HOURS,
    startDate: subHours(new Date(), DEFAULT_REALTIME_HOURS).toISOString(),
    endDate: new Date().toISOString(),
  },
  simple: {
    data: null,
    isLoading: true,
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
    setRealtimeHours(state, action: PayloadAction<RealtimeHours>) {
      state.advanced.realtimeHours = action.payload
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
    setSimpleData(state, action: PayloadAction<DashboardData>) {
      state.simple.data = action.payload
    },
    setSimpleIsLoading(state, action: PayloadAction<boolean>) {
      state.simple.isLoading = action.payload
    },
  },
})

export const {
  setAllData,
  setDisplayData,
  setIsLoading,
  setIsFiltering,
  setViewMode,
  setRealtimeHours,
  setStartDate,
  setEndDate,
  setDateRange,
  setSimpleData,
  setSimpleIsLoading,
} = dashboardSlice.actions

export default dashboardSlice.reducer
