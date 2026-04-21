/**
 * API Configuration
 * Centralized configuration for API endpoints and settings
 */

export const API_CONFIG = {
  /**
   * Base URL for API endpoints
   * Update this to match your backend API URL
   */
  baseUrl: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",

  /**
   * Default timeout for API requests (in milliseconds)
   */
  timeout: 30000,

  /**
   * API version prefix (if applicable)
   */
  apiVersion: "v1",
} as const

/**
 * WebSocket Configuration
 */
export const WEBSOCKET_CONFIG = {
  /**
   * WebSocket URL
   * Automatically converts http/https to ws/wss
   */
  url: import.meta.env.VITE_WS_URL || 
    (import.meta.env.VITE_API_BASE_URL || "http://localhost:3000")
      .replace(/^http/, "ws")
      .replace("/api", "/ws"),

  /**
   * Reconnection settings
   */
  reconnect: {
    enabled: true,
    maxAttempts: 5,
    delay: 3000, // Initial delay in ms
    maxDelay: 30000, // Maximum delay in ms
    backoffMultiplier: 1.5, // Exponential backoff multiplier
  },

  /**
   * Heartbeat/ping settings to keep connection alive
   */
  heartbeat: {
    enabled: true,
    interval: 30000, // Send ping every 30 seconds
    timeout: 5000, // Wait 5 seconds for pong response
  },
} as const

/**
 * Get the full API base URL including version if needed
 */
export const getApiBaseUrl = (): string => {
  return API_CONFIG.baseUrl
}

/**
 * Get the WebSocket URL
 */
export const getWebSocketUrl = (): string => {
  return WEBSOCKET_CONFIG.url
}
