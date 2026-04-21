# API Configuration

This directory contains configuration files for the application's API and WebSocket settings.

## Configuration Files

### `api.ts`

Centralizes all API-related and WebSocket configuration:

**API Configuration:**
- **baseUrl**: The base URL for all API requests
- **timeout**: Default timeout for API requests (30 seconds)
- **apiVersion**: API version prefix (if applicable)

**WebSocket Configuration:**
- **url**: WebSocket server URL (auto-converts from HTTP URL)
- **reconnect**: Automatic reconnection settings
  - `enabled`: Enable auto-reconnect
  - `maxAttempts`: Maximum reconnection attempts
  - `delay`: Initial delay between reconnects
  - `maxDelay`: Maximum delay (with exponential backoff)
  - `backoffMultiplier`: Exponential backoff multiplier
- **heartbeat**: Keep-alive settings
  - `enabled`: Enable heartbeat/ping
  - `interval`: Time between pings
  - `timeout`: Timeout waiting for pong

## Environment Variables

Create a `.env.local` file in the project root to override the default URLs:

```env
# API Base URL
VITE_API_BASE_URL=http://localhost:3000/api

# WebSocket URL (optional - auto-converts from API URL if not set)
VITE_WS_URL=ws://localhost:3000/ws
```

For production, set these in your deployment environment.

### Auto-conversion

If `VITE_WS_URL` is not set, it automatically converts from `VITE_API_BASE_URL`:
- `http://` → `ws://`
- `https://` → `wss://`
- Removes `/api` suffix and adds `/ws`

## Usage

The configuration is automatically used by:
- **RTK Query** through `apiSlice.ts` - inherits base URL
- **WebSocket middleware** through `websocketMiddleware.ts` - uses WebSocket URL
- All endpoints inherit these settings automatically

You don't need to import the config in individual endpoint files - just define your endpoints and they'll use the configured URLs.

### Example

```typescript
// In your endpoint file - HTTP requests
import { api } from "@/store/apiSlice"

export const myApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getData: builder.query({
      query: () => "/data", // Automatically uses baseUrl + "/data"
    }),
  }),
})
```

```typescript
// In your component - WebSocket
import { useWebSocket } from "@/hooks/useWebSocket"

function MyComponent() {
  const { connected, send } = useWebSocket()
  // Automatically connects to WebSocket URL from config
}
```

## Changing URLs

1. **Development**: Update `.env.local` or use the defaults
2. **Production**: Set `VITE_API_BASE_URL` and `VITE_WS_URL` environment variables
3. **Override in code**: Modify `API_CONFIG` or `WEBSOCKET_CONFIG` in `api.ts` (not recommended)

## Configuration Reference

### Reconnection Strategy

The WebSocket uses exponential backoff for reconnection:
1. First retry: 3 seconds
2. Second retry: 4.5 seconds (3 × 1.5)
3. Third retry: 6.75 seconds
4. Continues up to `maxDelay` (30 seconds)
5. Stops after `maxAttempts` (5 attempts)

### Heartbeat

Heartbeat keeps the WebSocket connection alive:
- Sends ping every 30 seconds
- Expects pong within 5 seconds
- Closes connection if no pong received

This prevents idle connections from being dropped by proxies or load balancers.
