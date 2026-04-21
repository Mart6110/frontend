import { useEffect, useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import {
  wsConnect,
  wsDisconnect,
  wsSend,
} from "../store/websocketMiddleware"

/**
 * Hook to manage WebSocket connection
 * Automatically connects and disconnects based on component lifecycle
 */
export const useWebSocket = (options?: {
  autoConnect?: boolean
  onMessage?: (data: unknown) => void
}) => {
  const dispatch = useAppDispatch()
  const { connected, connecting, error } = useAppSelector(
    (state) => state.websocket
  )

  const autoConnect = options?.autoConnect ?? true

  // Connect on mount if autoConnect is true
  useEffect(() => {
    if (autoConnect) {
      dispatch(wsConnect())

      return () => {
        dispatch(wsDisconnect())
      }
    }
  }, [dispatch, autoConnect])

  // Send message helper
  const send = useCallback(
    <T = unknown>(type: string, payload: T) => {
      dispatch(wsSend(type, payload))
    },
    [dispatch]
  )

  // Connect helper
  const connect = useCallback(() => {
    dispatch(wsConnect())
  }, [dispatch])

  // Disconnect helper
  const disconnect = useCallback(() => {
    dispatch(wsDisconnect())
  }, [dispatch])

  return {
    connected,
    connecting,
    error,
    send,
    connect,
    disconnect,
  }
}

/**
 * Hook to listen to specific WebSocket message types
 */
export const useWebSocketMessage = <T = unknown>(
  messageType: string,
  callback: (payload: T) => void
) => {
  const dispatch = useAppDispatch()

  useEffect(() => {
    // In a real implementation, you'd subscribe to the store
    // and filter for specific message types
    // This is a simplified example structure
    
    const handleMessage = (action: any) => {
      if (
        action.type === "ws/message" &&
        action.payload?.type === messageType
      ) {
        callback(action.payload.payload)
      }
    }

    // Subscribe to store changes
    // Note: This requires additional setup with store.subscribe
    // or a custom middleware to expose message handlers
    
    return () => {
      // Cleanup subscription
    }
  }, [messageType, callback, dispatch])
}

/**
 * Hook for subscribing to a WebSocket channel/topic
 * Useful for pub/sub patterns
 */
export const useWebSocketChannel = (channel: string) => {
  const { send, connected } = useWebSocket({ autoConnect: true })

  useEffect(() => {
    if (connected && channel) {
      // Subscribe to channel
      send("subscribe", { channel })

      return () => {
        // Unsubscribe from channel
        send("unsubscribe", { channel })
      }
    }
  }, [channel, connected, send])

  return {
    send: <T = unknown>(payload: T) => send(channel, payload),
  }
}
