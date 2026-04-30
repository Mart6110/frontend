import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { RootState } from './index'
import type {
  LatestDataResponse,
  HistoryDataResponse,
  HistoryDataParams,
  EnergyReading,
  EnergyHistoryResponse,
  EnergyHistoryParams,
  ControlStatusResponse,
  ControlActionResponse,
  SettingsResponse,
  ElectricityPriceResponse,
  ElectricityPriceParams,
  EventsResponse,
  EventsParams,
  AlertsResponse,
  AcknowledgeAlertResponse,
  ValidateKeyResponse,
  PumpAction,
  HeaterAction,
  ActionSource,
} from './apiTypes'

// Create the API slice
export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_BASE_URL,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      // Get API key from Redux state and set X-Product-Key header
      const apiKey = (getState() as RootState).apiKey.apiKey
      
      if (apiKey) {
        headers.set('X-Product-Key', apiKey)
      }
      
      return headers
    },
  }),
  tagTypes: ['Data', 'Control', 'Settings', 'Events', 'Alerts'],
  endpoints: (builder) => ({
    // === /data endpoints ===
    
    // GET /data/latest - Get latest sensor readings
    getLatestData: builder.query<LatestDataResponse, void>({
      query: () => '/data/latest',
      providesTags: ['Data'],
    }),
    
    // GET /data/history - Get historical data
    getHistoryData: builder.query<HistoryDataResponse, HistoryDataParams>({
      query: (params) => ({
        url: '/data/history',
        params,
      }),
      providesTags: ['Data'],
    }),
    
    // GET /data/energy/latest - Get latest energy reading
    getLatestEnergy: builder.query<EnergyReading, void>({
      query: () => '/data/energy/latest',
      providesTags: ['Data'],
    }),
    
    // GET /data/energy/history - Get energy history
    getEnergyHistory: builder.query<EnergyHistoryResponse, EnergyHistoryParams>({
      query: (params) => ({
        url: '/data/energy/history',
        params,
      }),
      providesTags: ['Data'],
    }),
    
    // POST /data/energy - Post new energy reading
    postEnergyReading: builder.mutation<EnergyReading, EnergyReading>({
      query: (body) => ({
        url: '/data/energy',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Data'],
    }),
    
    // === /control endpoints ===
    
    // POST /control/pump - Control water pump
    controlPump: builder.mutation<ControlActionResponse, {
      action: PumpAction
      source: ActionSource
    }>({
      query: (body) => ({
        url: '/control/pump',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Control', 'Events', 'Data'],
    }),
    
    // POST /control/heater - Control heater
    controlHeater: builder.mutation<ControlActionResponse, {
      index: number
      action: HeaterAction
      source: ActionSource
    }>({
      query: (body) => ({
        url: '/control/heater',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Control', 'Events', 'Data'],
    }),
    
    // GET /control/status - Get pump and heater status
    getControlStatus: builder.query<ControlStatusResponse, void>({
      query: () => '/control/status',
      providesTags: ['Control'],
    }),
    
    // === /settings endpoints ===
    
    // GET /settings - Get system settings
    getSettings: builder.query<SettingsResponse, void>({
      query: () => '/settings',
      providesTags: ['Settings'],
    }),
    
    // PUT /settings - Update settings (partial update)
    updateSettings: builder.mutation<{
      success: boolean
      updated_fields: string[]
    }, Partial<SettingsResponse>>({
      query: (body) => ({
        url: '/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    
    // GET /settings/electricity-price - Get electricity prices
    getElectricityPrice: builder.query<ElectricityPriceResponse, ElectricityPriceParams>({
      query: (params) => ({
        url: '/settings/electricity-price',
        params,
      }),
    }),
    
    // === /events endpoints ===
    
    // GET /events - Get system events
    getEvents: builder.query<EventsResponse, EventsParams>({
      query: (params) => ({
        url: '/events',
        params,
      }),
      providesTags: ['Events'],
    }),
    
    // GET /events/alerts - Get active alerts
    getAlerts: builder.query<AlertsResponse, void>({
      query: () => '/events/alerts',
      providesTags: ['Alerts'],
    }),
    
    // POST /events/alerts/:id/acknowledge - Acknowledge an alert
    acknowledgeAlert: builder.mutation<AcknowledgeAlertResponse, number>({
      query: (alertId) => ({
        url: `/events/alerts/${alertId}/acknowledge`,
        method: 'POST',
      }),
      invalidatesTags: ['Alerts'],
    }),
    
    // === /auth endpoints ===
    
    // POST /auth/validate-key - Validate product key
    validateKey: builder.mutation<ValidateKeyResponse, string>({
      query: (productKey) => ({
        url: '/auth/validate-key',
        method: 'POST',
        headers: {
          'X-Product-Key': productKey,
        },
      }),
    }),
  }),
})

// Export hooks for usage in components
export const {
  useGetLatestDataQuery,
  useGetHistoryDataQuery,
  useGetLatestEnergyQuery,
  useGetEnergyHistoryQuery,
  usePostEnergyReadingMutation,
  useControlPumpMutation,
  useControlHeaterMutation,
  useGetControlStatusQuery,
  useGetSettingsQuery,
  useUpdateSettingsMutation,
  useGetElectricityPriceQuery,
  useGetEventsQuery,
  useGetAlertsQuery,
  useAcknowledgeAlertMutation,
  useValidateKeyMutation,
} = api

// Re-export types for convenience
export type * from './apiTypes'
