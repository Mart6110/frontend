# WebSocket Utilities

This directory contains utilities for managing WebSocket connections in the application.

## Files

### `websocket.ts`

Core WebSocket manager class that handles:
- Connection lifecycle (connect, disconnect, reconnect)
- Automatic reconnection with exponential backoff
- Heartbeat/ping-pong to keep connections alive
- Message queuing when disconnected
- API key authentication

## WebSocketManager Class

### Features

- **Auto-reconnection**: Automatically reconnects with exponential backoff
- **Heartbeat**: Sends periodic pings to keep connection alive
- **Message Queue**: Queues messages when disconnected and sends them when reconnected
- **Authentication**: Supports API key authentication via query parameters

### Usage

```typescript
import { WebSocketManager } from "@/utils/websocket"

const wsManager = new WebSocketManager({
  url: "ws://localhost:3000/ws",
  onOpen: (event) => console.log("Connected"),
  onClose: (event) => console.log("Disconnected"),
  onMessage: (data) => console.log("Message:", data),
  onError: (error) => console.error("Error:", error),
})

// Set API key
wsManager.setApiKey("your-api-key")

// Connect
wsManager.connect()

// Send message
wsManager.send("message_type", { data: "payload" })

// Disconnect
wsManager.disconnect()
```

## Message Format

WebSocket messages follow this structure:

```typescript
{
  type: string      // Message type identifier
  payload: unknown  // Message data
  timestamp: number // Optional timestamp
}
```

## Configuration

WebSocket configuration is in `/src/config/api.ts`:

```typescript
WEBSOCKET_CONFIG = {
  url: "ws://localhost:3000/ws",  // Auto-converts from HTTP URL
  reconnect: {
    enabled: true,
    maxAttempts: 5,
    delay: 3000,
    maxDelay: 30000,
    backoffMultiplier: 1.5,
  },
  heartbeat: {
    enabled: true,
    interval: 30000,
    timeout: 5000,
  },
}
```

## Environment Variables

```env
VITE_WS_URL=ws://localhost:3000/ws
```

If not set, automatically converts from `VITE_API_BASE_URL`.
