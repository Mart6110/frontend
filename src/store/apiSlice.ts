import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './index'

// Define types for your API responses
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
  events: SystemEvent[]
}

export interface SystemEvent {
  id: string
  timestamp: number
  type: 'pump' | 'temperature' | 'energy' | 'error' | 'warning'
  severity: 'info' | 'warning' | 'error'
  message: string
}

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      // Get API key from Redux state
      const apiKey = (getState() as RootState).apiKey.apiKey
      
      if (apiKey) {
        headers.set('Authorization', `Bearer ${apiKey}`)
      }
      
      return headers
    },
  }),
  tagTypes: ['Dashboard', 'Events'],
  endpoints: (builder) => ({
    // Get dashboard data
    getDashboardData: builder.query<DashboardData, { 
      startDate?: string
      endDate?: string
      timeRange?: string 
    }>({
      query: (params) => ({
        url: '/dashboard',
        params,
      }),
      providesTags: ['Dashboard'],
    }),
    
    // Get system events
    getSystemEvents: builder.query<SystemEvent[], { 
      limit?: number
      types?: string[]
      severities?: string[]
    }>({
      query: (params) => ({
        url: '/events',
        params: {
          ...params,
          types: params.types?.join(','),
          severities: params.severities?.join(','),
        },
      }),
      providesTags: ['Events'],
    }),
    
    // Update system settings (example mutation)
    updateSettings: builder.mutation<void, {
      capacity?: number
      maxChargeRate?: number
      maxDischargeRate?: number
      operatingMode?: string
      targetTemperature?: number
    }>({
      query: (settings) => ({
        url: '/settings',
        method: 'PUT',
        body: settings,
      }),
      invalidatesTags: ['Dashboard'],
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetDashboardDataQuery,
  useGetSystemEventsQuery,
  useUpdateSettingsMutation,
} = api
