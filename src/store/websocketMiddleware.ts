import type { Middleware } from "@reduxjs/toolkit"
import { getWebSocketUrl } from "../config/api"
import { WebSocketManager } from "../utils/websocket"

/**
 * WebSocket Action Types
 */
export const WS_CONNECT = "ws/connect"
export const WS_DISCONNECT = "ws/disconnect"
export const WS_SEND = "ws/send"
export const WS_CONNECTED = "ws/connected"
export const WS_DISCONNECTED = "ws/disconnected"
export const WS_MESSAGE = "ws/message"
export const WS_ERROR = "ws/error"

/**
 * WebSocket Action Creators
 */
export const wsConnect = () => ({ type: WS_CONNECT })
export const wsDisconnect = () => ({ type: WS_DISCONNECT })
export const wsSend = <T = unknown>(messageType: string, payload: T) => ({
  type: WS_SEND,
  payload: { messageType, payload },
})

/**
 * WebSocket Action Interface
 */
interface WebSocketAction {
  type: string
  payload?: any
}

/**
 * WebSocket Middleware
 * Manages WebSocket connections and integrates with Redux
 */
export const createWebSocketMiddleware = () => {
  let wsManager: WebSocketManager | null = null

  const middleware: Middleware = (store) => (next) => (action: unknown) => {
    const result = next(action)

    // Type guard for action
    const wsAction = action as WebSocketAction

    // Get current API key from state
    const state = store.getState() as { apiKey: { apiKey: string | null } }
    const apiKey = state.apiKey.apiKey

    switch (wsAction.type) {
      case WS_CONNECT: {
        // Disconnect existing connection
        if (wsManager) {
          wsManager.disconnect()
        }

        // Create new WebSocket manager
        wsManager = new WebSocketManager({
          url: getWebSocketUrl(),
          reconnect: true,
          onOpen: () => {
            store.dispatch({ type: WS_CONNECTED })
          },
          onClose: () => {
            store.dispatch({ type: WS_DISCONNECTED })
          },
          onError: () => {
            store.dispatch({
              type: WS_ERROR,
              payload: { error: "WebSocket connection error" },
            })
          },
          onMessage: (data) => {
            store.dispatch({
              type: WS_MESSAGE,
              payload: data,
            })
          },
        })

        // Set API key if available
        if (apiKey) {
          wsManager.setApiKey(apiKey)
        }

        // Connect
        wsManager.connect()
        break
      }

      case WS_DISCONNECT: {
        if (wsManager) {
          wsManager.disconnect()
          wsManager = null
        }
        break
      }

      case WS_SEND: {
        if (wsManager?.isConnected()) {
          const { messageType, payload } = wsAction.payload
          wsManager.send(messageType, payload)
        } else {
          console.warn("WebSocket not connected. Cannot send message.")
        }
        break
      }

      // Update API key in WebSocket connection when it changes
      case "apiKey/setApiKey": {
        if (wsManager && wsAction.payload) {
          wsManager.setApiKey(wsAction.payload as string)
          // Reconnect with new API key
          wsManager.disconnect()
          setTimeout(() => {
            wsManager?.connect()
          }, 100)
        }
        break
      }

      case "apiKey/clearApiKey": {
        if (wsManager) {
          wsManager.setApiKey(null)
          wsManager.disconnect()
        }
        break
      }
    }

    return result
  }
  
  return middleware
}

/**
 * WebSocket Slice for tracking connection state
 */
import { createSlice } from "@reduxjs/toolkit"

interface WebSocketState {
  connected: boolean
  connecting: boolean
  error: string | null
}

const initialState: WebSocketState = {
  connected: false,
  connecting: false,
  error: null,
}

export const websocketSlice = createSlice({
  name: "websocket",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        (action): action is { type: typeof WS_CONNECT } => action.type === WS_CONNECT,
        (state) => {
          state.connecting = true
          state.error = null
        }
      )
      .addMatcher(
        (action): action is { type: typeof WS_CONNECTED } => action.type === WS_CONNECTED,
        (state) => {
          state.connected = true
          state.connecting = false
          state.error = null
        }
      )
      .addMatcher(
        (action): action is { type: typeof WS_DISCONNECTED } => action.type === WS_DISCONNECTED,
        (state) => {
          state.connected = false
          state.connecting = false
        }
      )
      .addMatcher(
        (action): action is { type: typeof WS_ERROR; payload: { error: string } } => 
          action.type === WS_ERROR,
        (state, action) => {
          state.error = action.payload?.error || "Unknown error"
          state.connecting = false
        }
      )
      .addMatcher(
        (action): action is { type: typeof WS_DISCONNECT } => action.type === WS_DISCONNECT,
        (state) => {
          state.connected = false
          state.connecting = false
        }
      )
  },
})

export default websocketSlice.reducer
