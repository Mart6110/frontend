# Redux Store

This directory contains the Redux store configuration and state management using Redux Toolkit (RTK).

## Structure

```
store/
├── index.ts                 # Store configuration and types
├── hooks.ts                 # Typed Redux hooks
├── selectors.ts             # Reusable selectors
├── apiSlice.ts              # RTK Query base API configuration
├── websocketMiddleware.ts   # WebSocket middleware and state
├── apiKeySlice.ts           # API key state management
├── dashboardSlice.ts        # Dashboard state management
└── endpoints/               # API endpoint definitions
    ├── exampleApi.ts        # Example endpoint (template)
    ├── realtimeApi.ts       # Example WebSocket endpoint
    └── README.md            # Endpoint documentation
```

## Core Files

### `index.ts`
Configures the Redux store with:
- All reducers (slices and API)
- RTK Query middleware
- TypeScript types for RootState and AppDispatch

### `hooks.ts`
Exports typed versions of Redux hooks:
- `useAppDispatch` - Typed dispatch hook
- `useAppSelector` - Typed selector hook

### `apiSlice.ts`
Base RTK Query API configuration:
- Configured with base URL from `/src/config/api.ts`
- Automatically adds API key to request headers
- Defines cache tags for data invalidation
- All endpoints extend this base configuration

### `websocketMiddleware.ts`
WebSocket middleware and state management:
- Manages WebSocket connection lifecycle
- Auto-reconnection with exponential backoff
- Syncs API key changes with WebSocket connection
- Provides Redux actions for WebSocket control

## Usage

### Using RTK Query for API Calls

1. **Create an endpoint file** in `endpoints/` directory:

```typescript
// src/store/endpoints/energyApi.ts
import { api } from "../apiSlice"

interface EnergyData {
  timestamp: string
  value: number
}

export const energyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getEnergyData: builder.query<EnergyData[], { start: string; end: string }>({
      query: (params) => ({
        url: "/energy",
        params,
      }),
      providesTags: ["Energy"],
    }),
  }),
})

export const { useGetEnergyDataQuery } = energyApi
```

2. **Use the hook in your component**:

```typescript
import { useGetEnergyDataQuery } from "@/store/endpoints/energyApi"

function EnergyChart() {
  const { data, isLoading, error } = useGetEnergyDataQuery({
    start: "2024-01-01",
    end: "2024-01-31",
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error!</div>

  return <div>{/* Render data */}</div>
}
```

### Using Regular Slices

For local state management, use the existing slice hooks:

```typescript
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setApiKey } from "@/store/apiKeySlice"

function MyComponent() {
  const dispatch = useAppDispatch()
  const apiKey = useAppSelector((state) => state.apiKey.apiKey)

  const handleSetKey = (key: string) => {
    dispatch(setApiKey(key))
  }
}
```

## RTK Query Benefits

- **Automatic caching**: Requests are cached and shared across components
- **Background refetching**: Data stays fresh automatically
- **Optimistic updates**: Update UI before server responds
- **Request deduplication**: Multiple components requesting same data only trigger one request
- **TypeScript support**: Full type safety for requests and responses
- **Auto-generated hooks**: No need to write custom hooks

## Configuration

API base URL is configured in `/src/config/api.ts` and can be overridden with environment variables:

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

API key is automatically included in all requests from the Redux state.

## WebSocket Integration

### Using WebSocket in Components

The easiest way to use WebSocket is with the `useWebSocket` hook:

```typescript
import { useWebSocket } from "@/hooks/useWebSocket"

function RealtimeComponent() {
  const { connected, send } = useWebSocket()

  useEffect(() => {
    if (connected) {
      // Send a message
      send("subscribe", { channel: "updates" })
    }
  }, [connected, send])

  return <div>WebSocket: {connected ? "Connected" : "Disconnected"}</div>
}
```

### WebSocket with RTK Query

Combine WebSocket updates with RTK Query caching:

```typescript
import { useGetRealtimeDataQuery } from "@/store/endpoints/realtimeApi"
import { useWebSocket } from "@/hooks/useWebSocket"

function Dashboard() {
  // Fetch initial data via HTTP
  const { data } = useGetRealtimeDataQuery()
  
  // Connect to WebSocket for real-time updates
  useWebSocket({ autoConnect: true })
  
  // RTK Query cache is automatically updated via onCacheEntryAdded
  return <div>{/* data updates in real-time */}</div>
}
```

### Manual WebSocket Control

Use Redux actions directly for fine-grained control:

```typescript
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { wsConnect, wsDisconnect, wsSend } from "@/store/websocketMiddleware"

function WebSocketControl() {
  const dispatch = useAppDispatch()
  const { connected } = useAppSelector((state) => state.websocket)

  const connect = () => dispatch(wsConnect())
  const disconnect = () => dispatch(wsDisconnect())
  const sendMessage = () => dispatch(wsSend("ping", {}))

  return (
    <div>
      <button onClick={connect}>Connect</button>
      <button onClick={disconnect}>Disconnect</button>
      <button onClick={sendMessage} disabled={!connected}>Send</button>
    </div>
  )
}
```

### WebSocket Configuration

WebSocket URL is configured in `/src/config/api.ts`:

```env
VITE_WS_URL=ws://localhost:3000/ws
```

If not set, it auto-converts from `VITE_API_BASE_URL`.

See `/src/store/endpoints/realtimeApi.ts` for a complete example of integrating WebSocket with RTK Query.
