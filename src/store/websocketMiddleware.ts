import type { Middleware } from "@reduxjs/toolkit"
import { getWebSocketUrl } from "../config/api"
import { WebSocketManager, WebSocketEventType } from "../utils/websocket"
import type { RootState } from "./index"

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
 * WebSocket Middleware
 * Manages WebSocket connections and integrates with Redux
 */
export const createWebSocketMiddleware = (): Middleware<
  object,
  RootState
> => {
  let wsManager: WebSocketManager | null = null

  return (store) => (next) => (action) => {
    const result = next(action)

    // Get current API key from state
    const state = store.getState()
    const apiKey = state.apiKey.apiKey

    switch (action.type) {
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
          onError: (event) => {
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
          const { messageType, payload } = action.payload
          wsManager.send(messageType, payload)
        } else {
          console.warn("WebSocket not connected. Cannot send message.")
        }
        break
      }

      // Update API key in WebSocket connection when it changes
      case "apiKey/setApiKey": {
        if (wsManager) {
          wsManager.setApiKey(action.payload)
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
      .addCase(WS_CONNECT, (state) => {
        state.connecting = true
        state.error = null
      })
      .addCase(WS_CONNECTED, (state) => {
        state.connected = true
        state.connecting = false
        state.error = null
      })
      .addCase(WS_DISCONNECTED, (state) => {
        state.connected = false
        state.connecting = false
      })
      .addCase(WS_ERROR, (state, action: any) => {
        state.error = action.payload?.error || "Unknown error"
        state.connecting = false
      })
      .addCase(WS_DISCONNECT, (state) => {
        state.connected = false
        state.connecting = false
      })
  },
})

export default websocketSlice.reducer
