import { WEBSOCKET_CONFIG } from "../config/api"

/**
 * WebSocket Event Types
 */
export const WebSocketEventType = {
  CONNECT: "ws/connect",
  DISCONNECT: "ws/disconnect",
  MESSAGE: "ws/message",
  ERROR: "ws/error",
  RECONNECTING: "ws/reconnecting",
  RECONNECTED: "ws/reconnected",
} as const

export type WebSocketEventType = typeof WebSocketEventType[keyof typeof WebSocketEventType]

/**
 * WebSocket Message Structure
 */
export interface WebSocketMessage<T = unknown> {
  type: string
  payload: T
  timestamp?: number
}

/**
 * WebSocket Manager Options
 */
interface WebSocketManagerOptions {
  url: string
  protocols?: string | string[]
  reconnect?: boolean
  onOpen?: (event: Event) => void
  onClose?: (event: CloseEvent) => void
  onError?: (event: Event) => void
  onMessage?: (data: unknown) => void
}

/**
 * WebSocket Manager Class
 * Handles WebSocket connection, reconnection, and message handling
 */
export class WebSocketManager {
  private ws: WebSocket | null = null
  private url: string
  private protocols?: string | string[]
  private reconnectAttempts = 0
  private reconnectTimer: number | null = null
  private heartbeatTimer: number | null = null
  private heartbeatTimeoutTimer: number | null = null
  private shouldReconnect = true
  private messageQueue: string[] = []
  private apiKey: string | null = null

  // Callbacks
  private onOpenCallback?: (event: Event) => void
  private onCloseCallback?: (event: CloseEvent) => void
  private onErrorCallback?: (event: Event) => void
  private onMessageCallback?: (data: unknown) => void

  constructor(options: WebSocketManagerOptions) {
    this.url = options.url
    this.protocols = options.protocols
    this.shouldReconnect = options.reconnect ?? WEBSOCKET_CONFIG.reconnect.enabled
    this.onOpenCallback = options.onOpen
    this.onCloseCallback = options.onClose
    this.onErrorCallback = options.onError
    this.onMessageCallback = options.onMessage
  }

  /**
   * Set API key for authentication
   */
  setApiKey(apiKey: string | null) {
    this.apiKey = apiKey
  }

  /**
   * Connect to WebSocket
   */
  connect() {
    if (this.ws?.readyState === WebSocket.OPEN) {
      console.warn("WebSocket is already connected")
      return
    }

    try {
      // Add API key as query parameter if available
      const url = this.apiKey
        ? `${this.url}?token=${encodeURIComponent(this.apiKey)}`
        : this.url

      this.ws = new WebSocket(url, this.protocols)

      this.ws.onopen = this.handleOpen.bind(this)
      this.ws.onclose = this.handleClose.bind(this)
      this.ws.onerror = this.handleError.bind(this)
      this.ws.onmessage = this.handleMessage.bind(this)
    } catch (error) {
      console.error("Failed to create WebSocket connection:", error)
      this.scheduleReconnect()
    }
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this.shouldReconnect = false
    this.cleanup()
    
    if (this.ws) {
      this.ws.close(1000, "Client disconnecting")
      this.ws = null
    }
  }

  /**
   * Send message through WebSocket
   */
  send<T = unknown>(type: string, payload: T) {
    const message: WebSocketMessage<T> = {
      type,
      payload,
      timestamp: Date.now(),
    }

    const messageStr = JSON.stringify(message)

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(messageStr)
    } else {
      // Queue message if not connected
      this.messageQueue.push(messageStr)
      console.warn("WebSocket not connected. Message queued.")
    }
  }

  /**
   * Get current connection state
   */
  getState(): number {
    return this.ws?.readyState ?? WebSocket.CLOSED
  }

  /**
   * Check if connected
   */
  isConnected(): boolean {
    return this.ws?.readyState === WebSocket.OPEN
  }

  private handleOpen(event: Event) {
    console.log("WebSocket connected")
    this.reconnectAttempts = 0

    // Send queued messages
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift()
      if (message && this.ws) {
        this.ws.send(message)
      }
    }

    // Start heartbeat
    if (WEBSOCKET_CONFIG.heartbeat.enabled) {
      this.startHeartbeat()
    }

    this.onOpenCallback?.(event)
  }

  private handleClose(event: CloseEvent) {
    console.log("WebSocket disconnected", event.code, event.reason)
    this.cleanup()
    this.onCloseCallback?.(event)

    // Reconnect if needed
    if (this.shouldReconnect && event.code !== 1000) {
      this.scheduleReconnect()
    }
  }

  private handleError(event: Event) {
    console.error("WebSocket error", event)
    this.onErrorCallback?.(event)
  }

  private handleMessage(event: MessageEvent) {
    try {
      const data = JSON.parse(event.data)

      // Handle pong response
      if (data.type === "pong") {
        this.handlePong()
        return
      }

      this.onMessageCallback?.(data)
    } catch (error) {
      console.error("Failed to parse WebSocket message:", error)
    }
  }

  private startHeartbeat() {
    this.stopHeartbeat()

    this.heartbeatTimer = setInterval(() => {
      if (this.ws?.readyState === WebSocket.OPEN) {
        this.send("ping", {})
        
        // Set timeout for pong response
        this.heartbeatTimeoutTimer = setTimeout(() => {
          console.warn("Heartbeat timeout - closing connection")
          this.ws?.close()
        }, WEBSOCKET_CONFIG.heartbeat.timeout)
      }
    }, WEBSOCKET_CONFIG.heartbeat.interval)
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer)
      this.heartbeatTimer = null
    }
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  private handlePong() {
    // Clear the timeout since we received pong
    if (this.heartbeatTimeoutTimer) {
      clearTimeout(this.heartbeatTimeoutTimer)
      this.heartbeatTimeoutTimer = null
    }
  }

  private scheduleReconnect() {
    if (!this.shouldReconnect) return

    const maxAttempts = WEBSOCKET_CONFIG.reconnect.maxAttempts
    if (this.reconnectAttempts >= maxAttempts) {
      console.error(`Max reconnection attempts (${maxAttempts}) reached`)
      return
    }

    this.reconnectAttempts++

    // Exponential backoff
    const delay = Math.min(
      WEBSOCKET_CONFIG.reconnect.delay *
        Math.pow(WEBSOCKET_CONFIG.reconnect.backoffMultiplier, this.reconnectAttempts - 1),
      WEBSOCKET_CONFIG.reconnect.maxDelay
    )

    console.log(`Reconnecting in ${delay}ms... (attempt ${this.reconnectAttempts}/${maxAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      this.connect()
    }, delay)
  }

  private cleanup() {
    this.stopHeartbeat()
    
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }
  }
}

/**
 * Create a WebSocket manager instance
 */
export const createWebSocketManager = (
  url: string,
  options?: Partial<WebSocketManagerOptions>
): WebSocketManager => {
  return new WebSocketManager({
    url,
    ...options,
  })
}
