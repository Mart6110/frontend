import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { API_CONFIG } from "../config/api"
import type { RootState } from "./index"

/**
 * Base API slice using RTK Query
 * This is the foundation for all API endpoints in the application
 * 
 * Usage:
 * - Import this api in your endpoint files
 * - Use api.injectEndpoints() to add new endpoints
 * - Endpoints automatically get the base URL and API key
 */
export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: API_CONFIG.baseUrl,
    prepareHeaders: (headers, { getState }) => {
      // Get API key from Redux state
      const apiKey = (getState() as RootState).apiKey.apiKey

      // Add API key to headers if it exists
      if (apiKey) {
        headers.set("Authorization", `Bearer ${apiKey}`)
        // Alternative: headers.set("X-API-Key", apiKey)
      }

      // Add content type
      if (!headers.has("Content-Type")) {
        headers.set("Content-Type", "application/json")
      }

      return headers
    },
    timeout: API_CONFIG.timeout,
  }),
  // Define tag types for cache invalidation
  tagTypes: ["Energy", "Temperature", "Pump", "Flow", "Efficiency", "Events"],
  // Endpoints will be injected in separate files
  endpoints: () => ({}),
})

// Export hooks will be auto-generated when endpoints are injected
export const {} = api
