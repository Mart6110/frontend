# React Hooks

Custom React hooks for the application.

## WebSocket Hooks

### `useWebSocket`

Main hook for managing WebSocket connections with automatic lifecycle management.

```typescript
import { useWebSocket } from "@/hooks/useWebSocket"

function MyComponent() {
  const { connected, connecting, error, send, connect, disconnect } = useWebSocket({
    autoConnect: true,  // Auto-connect on mount (default: true)
  })

  const handleSend = () => {
    send("message_type", { data: "value" })
  }

  return (
    <div>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <button onClick={handleSend} disabled={!connected}>
        Send Message
      </button>
    </div>
  )
}
```

**Features:**
- Auto-connects on mount and disconnects on unmount
- Exposes connection state (connected, connecting, error)
- Provides `send`, `connect`, and `disconnect` methods

### `useWebSocketMessage`

Listen to specific WebSocket message types.

```typescript
import { useWebSocketMessage } from "@/hooks/useWebSocket"

function NotificationListener() {
  useWebSocketMessage("notification", (payload) => {
    console.log("Received notification:", payload)
    // Handle the notification
  })

  return <div>Listening for notifications...</div>
}
```

**Note:** This requires additional setup with store subscription to work properly.

### `useWebSocketChannel`

Subscribe to a specific WebSocket channel/topic (useful for pub/sub patterns).

```typescript
import { useWebSocketChannel } from "@/hooks/useWebSocket"

function ChannelComponent() {
  const { send } = useWebSocketChannel("sensor-updates")

  const sendUpdate = () => {
    send({ value: 42 })
  }

  return <button onClick={sendUpdate}>Send Update</button>
}
```

## Usage Patterns

### Real-time Dashboard

```typescript
function Dashboard() {
  // Fetch initial data
  const { data } = useGetDashboardDataQuery()
  
  // Connect to WebSocket for updates
  const { connected } = useWebSocket({ autoConnect: true })
  
  return (
    <div>
      <StatusIndicator connected={connected} />
      <DataDisplay data={data} />
    </div>
  )
}
```

### Manual Connection Control

```typescript
function ControlledWebSocket() {
  const { connected, connect, disconnect, send } = useWebSocket({
    autoConnect: false,  // Don't auto-connect
  })

  return (
    <div>
      {!connected ? (
        <button onClick={connect}>Connect</button>
      ) : (
        <>
          <button onClick={() => send("ping", {})}>Ping</button>
          <button onClick={disconnect}>Disconnect</button>
        </>
      )}
    </div>
  )
}
```

### Conditional Connection

```typescript
function ConditionalWebSocket() {
  const apiKey = useAppSelector((state) => state.apiKey.apiKey)
  
  // Only connect if API key is present
  const { connected } = useWebSocket({
    autoConnect: !!apiKey,
  })

  if (!apiKey) {
    return <div>Please set API key first</div>
  }

  return <div>WebSocket: {connected ? "Connected" : "Connecting..."}</div>
}
```

## Best Practices

1. **Auto-connect for simple cases**: Use `autoConnect: true` when you need WebSocket for the entire component lifecycle

2. **Manual control for complex scenarios**: Use `autoConnect: false` when you need to control connection timing

3. **Clean up properly**: The hook automatically disconnects on unmount, but be mindful of multiple components connecting/disconnecting

4. **Handle connection states**: Always check `connected` state before sending messages

5. **Combine with RTK Query**: Use WebSocket for real-time updates and RTK Query for initial data fetching

## Related

- WebSocket middleware: `/src/store/websocketMiddleware.ts`
- WebSocket utilities: `/src/utils/websocket.ts`
- WebSocket configuration: `/src/config/api.ts`
- Example endpoint: `/src/store/endpoints/realtimeApi.ts`
