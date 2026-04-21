# WebSocket Setup Guide

This guide explains how to use WebSocket with Redux RTK in this application.

## Overview

The WebSocket integration provides:
- ✅ Automatic connection management
- ✅ Auto-reconnection with exponential backoff
- ✅ Heartbeat/ping-pong to keep connections alive
- ✅ Message queuing when disconnected
- ✅ API key authentication
- ✅ Integration with RTK Query for real-time cache updates
- ✅ Redux state for connection status

## Quick Start

### 1. Configure Environment

Create `.env.local` in the project root:

```env
# HTTP API URL
VITE_API_BASE_URL=http://localhost:3000/api

# WebSocket URL (optional - auto-converts from API URL)
VITE_WS_URL=ws://localhost:3000/ws
```

### 2. Use in Components

#### Simple Usage

```typescript
import { useWebSocket } from "@/hooks/useWebSocket"

function MyComponent() {
  const { connected, send } = useWebSocket()

  const handleSendMessage = () => {
    send("my_event", { data: "value" })
  }

  return (
    <div>
      <p>Status: {connected ? "Connected" : "Disconnected"}</p>
      <button onClick={handleSendMessage} disabled={!connected}>
        Send Message
      </button>
    </div>
  )
}
```

#### With Real-time Data

```typescript
import { useGetRealtimeDataQuery } from "@/store/endpoints/realtimeApi"
import { useWebSocket } from "@/hooks/useWebSocket"

function Dashboard() {
  // Fetch initial data via HTTP
  const { data, isLoading } = useGetRealtimeDataQuery()
  
  // Connect to WebSocket for real-time updates
  const { connected } = useWebSocket({ autoConnect: true })
  
  // The data will automatically update via WebSocket
  return (
    <div>
      <StatusBadge connected={connected} />
      {isLoading ? <Loader /> : <DataDisplay data={data} />}
    </div>
  )
}
```

## Architecture

### Components

1. **WebSocket Manager** (`/src/utils/websocket.ts`)
   - Core WebSocket connection handler
   - Manages lifecycle, reconnection, heartbeat

2. **WebSocket Middleware** (`/src/store/websocketMiddleware.ts`)
   - Redux middleware for WebSocket
   - Handles connection state in Redux
   - Auto-syncs API key changes

3. **WebSocket Hooks** (`/src/hooks/useWebSocket.ts`)
   - React hooks for easy WebSocket usage
   - Auto-connect/disconnect on mount/unmount

4. **Configuration** (`/src/config/api.ts`)
   - Centralized WebSocket config
   - Reconnection and heartbeat settings

### Redux Integration

The WebSocket state is managed in Redux:

```typescript
interface WebSocketState {
  connected: boolean    // Currently connected
  connecting: boolean   // Connection in progress
  error: string | null  // Last error
}
```

### Actions

```typescript
import { wsConnect, wsDisconnect, wsSend } from "@/store/websocketMiddleware"

// Connect to WebSocket
dispatch(wsConnect())

// Disconnect
dispatch(wsDisconnect())

// Send message
dispatch(wsSend("message_type", { data: "payload" }))
```

## Message Format

All WebSocket messages follow this structure:

```typescript
{
  type: string,      // Message type identifier
  payload: any,      // Message data
  timestamp: number  // Message timestamp (optional)
}
```

### Sending Messages

```typescript
const { send } = useWebSocket()

send("sensor_update", {
  sensorId: "temp_01",
  value: 23.5,
  unit: "celsius"
})
```

### Receiving Messages

Messages are dispatched as Redux actions with type `ws/message`:

```typescript
{
  type: "ws/message",
  payload: {
    type: "sensor_update",
    payload: { sensorId: "temp_01", value: 23.5 },
    timestamp: 1234567890
  }
}
```

## RTK Query Integration

Combine WebSocket with RTK Query for real-time cache updates:

```typescript
export const sensorApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getSensorData: builder.query<SensorData[], void>({
      query: () => "/sensors",
      
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved }
      ) {
        await cacheDataLoaded
        
        // Listen for WebSocket updates
        const handleMessage = (action: any) => {
          if (action.type === "ws/message" && 
              action.payload?.type === "sensor_update") {
            
            // Update the cached data
            updateCachedData((draft) => {
              const sensor = draft.find(s => s.id === action.payload.payload.id)
              if (sensor) {
                sensor.value = action.payload.payload.value
              }
            })
          }
        }
        
        // Note: You'll need to set up store subscription
        // See /src/store/endpoints/realtimeApi.ts for complete example
        
        await cacheEntryRemoved
      },
    }),
  }),
})
```

## Configuration

### Reconnection Settings

```typescript
reconnect: {
  enabled: true,
  maxAttempts: 5,           // Stop after 5 failed attempts
  delay: 3000,              // Start with 3 second delay
  maxDelay: 30000,          // Cap at 30 seconds
  backoffMultiplier: 1.5,   // Exponential backoff
}
```

Retry delays: 3s → 4.5s → 6.75s → 10.1s → 15.2s → stops

### Heartbeat Settings

```typescript
heartbeat: {
  enabled: true,
  interval: 30000,  // Ping every 30 seconds
  timeout: 5000,    // Expect pong within 5 seconds
}
```

## Authentication

API key is automatically added to WebSocket connection:

1. Retrieved from Redux state (`state.apiKey.apiKey`)
2. Added as query parameter: `ws://server/ws?token=YOUR_API_KEY`
3. Auto-updates when API key changes in Redux

## Advanced Usage

### Manual Connection Control

```typescript
const { connect, disconnect, connected } = useWebSocket({
  autoConnect: false  // Don't auto-connect
})

// Connect manually
useEffect(() => {
  if (someCondition) {
    connect()
  }
}, [someCondition, connect])

// Disconnect manually
const handleLogout = () => {
  disconnect()
}
```

### Channel Subscriptions

```typescript
import { useWebSocketChannel } from "@/hooks/useWebSocket"

function SensorMonitor() {
  const { send } = useWebSocketChannel("sensor-updates")
  
  // Auto-subscribes to "sensor-updates" channel
  // Auto-unsubscribes on unmount
  
  const updateSensor = (data) => {
    send(data)  // Send to the channel
  }
}
```

### Connection State

```typescript
const { connected, connecting, error } = useWebSocket()

if (error) return <ErrorAlert error={error} />
if (connecting) return <LoadingSpinner />
if (!connected) return <OfflineNotice />
return <OnlineContent />
```

## Troubleshooting

### Connection Fails

1. Check WebSocket URL in `.env.local`
2. Verify backend WebSocket server is running
3. Check browser console for errors
4. Verify API key is set (if required)

### Reconnection Issues

1. Check `maxAttempts` in config (default: 5)
2. Increase `maxDelay` if network is slow
3. Check backend logs for connection rejections

### Messages Not Received

1. Verify connection is established (`connected === true`)
2. Check message format matches expected structure
3. Ensure Redux action listeners are set up
4. Check browser dev tools WebSocket tab

## Examples

See these files for complete examples:

- Basic usage: `/src/hooks/useWebSocket.ts`
- RTK Query integration: `/src/store/endpoints/realtimeApi.ts`
- Configuration: `/src/config/api.ts`
- Middleware: `/src/store/websocketMiddleware.ts`

## Best Practices

1. **Use hooks for components**: Prefer `useWebSocket` over Redux actions
2. **Combine with RTK Query**: Use WebSocket for updates, HTTP for initial data
3. **Handle disconnections**: Always show connection status to users
4. **Clean up**: Let hooks handle cleanup, or manually disconnect when needed
5. **Type safety**: Define TypeScript interfaces for your message payloads
6. **Error handling**: Display errors to users and provide retry options

## Production Checklist

- [ ] Set `VITE_WS_URL` for production (use `wss://` for SSL)
- [ ] Configure CORS on backend for WebSocket
- [ ] Set up load balancer sticky sessions (if needed)
- [ ] Monitor reconnection rates
- [ ] Implement message rate limiting (if needed)
- [ ] Set up WebSocket connection metrics
- [ ] Test with slow/unstable networks
