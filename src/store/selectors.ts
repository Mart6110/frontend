import { createSelector } from "@reduxjs/toolkit"
import type { RootState } from "./index"

// Advanced View Selectors
export const selectAdvancedDashboard = (state: RootState) => state.dashboard.advanced

export const selectAllData = createSelector(
  [selectAdvancedDashboard],
  (advanced) => advanced.allData
)

export const selectDisplayData = createSelector(
  [selectAdvancedDashboard],
  (advanced) => advanced.displayData
)

export const selectIsLoading = createSelector(
  [selectAdvancedDashboard],
  (advanced) => advanced.isLoading
)

export const selectIsFiltering = createSelector(
  [selectAdvancedDashboard],
  (advanced) => advanced.isFiltering
)

export const selectViewMode = createSelector(
  [selectAdvancedDashboard],
  (advanced) => advanced.viewMode
)

export const selectRealtimeHours = createSelector(
  [selectAdvancedDashboard],
  (advanced) => advanced.realtimeHours
)

export const selectDateRange = createSelector(
  [selectAdvancedDashboard],
  (advanced) => ({
    startDate: advanced.startDate ? new Date(advanced.startDate) : null,
    endDate: advanced.endDate ? new Date(advanced.endDate) : null,
  })
)

// Simple View Selectors
export const selectSimpleDashboard = (state: RootState) => state.dashboard.simple

export const selectSimpleData = createSelector(
  [selectSimpleDashboard],
  (simple) => simple.data
)

export const selectSimpleIsLoading = createSelector(
  [selectSimpleDashboard],
  (simple) => simple.isLoading
)
