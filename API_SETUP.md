# API Configuration Guide

## Overview

This project uses RTK Query for API calls with environment-based configuration.  
The backend API is documented at: **Base URL: `/api/v1`**

## Authentication

All API requests (except `/auth/validate-key`) require the product key to be sent in the header:

```
X-Product-Key: <your-product-key>
```

The frontend automatically includes this header using the API key stored in Redux state and cookies.

## Environment Setup

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. The default configuration proxies API requests through Vite dev server:
   ```
   VITE_API_BASE_URL=/api/v1
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. API requests will be proxied to `http://localhost:8080/api/v1` (configured in `vite.config.ts`)

### Production Build

1. Create `.env.production` (or use the provided one):
   ```
   VITE_API_BASE_URL=https://api.dunepower.acceptable.pro/api/v1
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. The built app will make API requests directly to `https://api.dunepower.acceptable.pro/api/v1`

## Docker Setup

### Local Development with Docker Compose

The `nginx.conf` is configured to proxy API requests to a backend service:

```nginx
location /api/ {
    proxy_pass http://backend:8080/api/;
    ...
}
```

Use `docker-compose.yml` to run both frontend and backend:

```yaml
services:
  frontend:
    build: .
    ports:
      - "80:80"
  
  backend:
    image: your-backend-image
    ports:
      - "8080:8080"
```

### Production Deployment

For production, the nginx.conf proxies to your actual backend at `http://backend:8080/api/`.

## Available API Endpoints

### Data Endpoints (`/data`)

- **`useGetLatestDataQuery()`** - `GET /data/latest`  
  Returns the latest sensor readings (sand temp, water temps, flow rate, power, energy, status)

- **`useGetHistoryDataQuery({ from, to, interval?, limit? })`** - `GET /data/history`  
  Returns historical sensor data within a date range with optional interval sampling

### Control Endpoints (`/control`)

- **`useControlPumpMutation()`** - `POST /control/pump`  
  Start/stop the water pump. Body: `{ action: 'start' | 'stop', source: 'manual' | 'rule' }`

- **`useControlHeaterMutation()`** - `POST /control/heater`  
  Turn heater on/off. Body: `{ action: 'on' | 'off', source: 'manual' | 'rule' }`

- **`useGetControlStatusQuery()`** - `GET /control/status`  
  Get current status of pump and heater (active, source, last_changed)

### Settings Endpoints (`/settings`)

- **`useGetSettingsQuery()`** - `GET /settings`  
  Get system configuration (max temps, intervals, price limits, auto modes)

- **`useUpdateSettingsMutation()`** - `PUT /settings`  
  Update settings (partial update). Body: any fields from SettingsResponse

- **`useGetElectricityPriceQuery({ date?, area? })`** - `GET /settings/electricity-price`  
  Get cached electricity prices for DK1/DK2 areas

### Events Endpoints (`/events`)

- **`useGetEventsQuery({ from?, to?, type?, source?, limit?, offset? })`** - `GET /events`  
  Get paginated system events (pump actions, heater actions, warnings, errors)

- **`useGetAlertsQuery()`** - `GET /events/alerts`  
  Get active alerts (critical/warning/error) that need attention

- **`useAcknowledgeAlertMutation()`** - `POST /events/alerts/:id/acknowledge`  
  Acknowledge an alert by ID

### Auth Endpoints (`/auth`)

- **`useValidateKeyMutation()`** - `POST /auth/validate-key`  
  Validate a product key. This endpoint does NOT require an existing X-Product-Key header.

## Using RTK Query in Components

### Example: Fetching Latest Data

```typescript
import { useGetLatestDataQuery } from '@/store/apiSlice'

function DashboardComponent() {
  const { data, error, isLoading } = useGetLatestDataQuery()

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (
    <div>
      <h1>Sand Temperature: {data?.sand_temp}°C</h1>
      <p>Power: {data?.power_w}W</p>
      <p>Status: {data?.status}</p>
    </div>
  )
}
```

### Example: Fetching with Polling

```typescript
const { data } = useGetLatestDataQuery(
  undefined,
  {
    pollingInterval: 30000, // Poll every 30 seconds
  }
)
```

### Example: Historical Data

```typescript
import { useGetHistoryDataQuery } from '@/store/apiSlice'

function HistoryChart() {
  const { data, isLoading } = useGetHistoryDataQuery({
    from: '2024-01-01T00:00:00Z',
    to: '2024-01-31T23:59:59Z',
    interval: '1h',
    limit: 500,
  })

  if (isLoading) return <div>Loading history...</div>

  return (
    <div>
      <p>Showing {data?.count} data points</p>
      {data?.data.map((point) => (
        <div key={point.timestamp}>
          {point.timestamp}: {point.sand_temp}°C
        </div>
      ))}
    </div>
  )
}
```

### Example: Control Pump

```typescript
import { useControlPumpMutation } from '@/store/apiSlice'

function PumpControl() {
  const [controlPump, { isLoading }] = useControlPumpMutation()

  const handleStart = async () => {
    try {
      await controlPump({ 
        action: 'start', 
        source: 'manual' 
      }).unwrap()
      alert('Pump started!')
    } catch (error) {
      console.error('Failed to start pump:', error)
    }
  }

  return <button onClick={handleStart} disabled={isLoading}>Start Pump</button>
}
```

### Example: Update Settings

```typescript
import { useUpdateSettingsMutation } from '@/store/apiSlice'

function SettingsForm() {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation()

  const handleSubmit = async (values) => {
    try {
      await updateSettings({
        max_sand_temp: values.maxTemp,
        pump_interval_seconds: values.interval,
        auto_heating_enabled: values.autoHeating,
      }).unwrap()
      alert('Settings updated!')
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## API Response Types

All TypeScript interfaces are defined in `src/store/apiTypes.ts` and re-exported from `src/store/apiSlice.ts`:

- `LatestDataResponse` - Latest sensor readings
- `HistoryDataResponse` - Historical data with array of points
- `HistoryDataPoint` - Individual historical data point
- `ControlStatusResponse` - Pump and heater status
- `ControlActionResponse` - Response from pump/heater control actions
- `SettingsResponse` - System configuration
- `EventsResponse` - Paginated events list
- `SystemEvent` - Individual system event
- `AlertsResponse` - Active alerts
- `Alert` - Individual alert
- `ElectricityPriceResponse` - Electricity prices by hour
- `ElectricityPrice` - Individual price point
- `ValidateKeyResponse` - Product key validation result

You can import types directly from either file:

```typescript
// From apiSlice (convenience re-export)
import { type LatestDataResponse, useGetLatestDataQuery } from '@/store/apiSlice'

// Or from apiTypes (direct import)
import type { LatestDataResponse } from '@/store/apiTypes'
```

## Authentication Flow

1. User enters product key on login page
2. Frontend calls `useValidateKeyMutation(productKey)`
3. If valid, product key is stored in Redux state and cookies (7 days)
4. All subsequent API requests automatically include `X-Product-Key` header
5. Backend validates the key on each request (401 if invalid)

## Troubleshooting

### API requests fail in development

1. Check that backend is running on port 8080
2. Verify proxy configuration in `vite.config.ts`
3. Check browser network tab for actual request URL
4. Ensure backend is serving on `/api/v1/*` path

### API requests fail in production

1. Verify `VITE_API_BASE_URL` in `.env.production`
2. Check CORS settings on backend
3. Verify nginx proxy configuration if using Docker
4. Check that backend is accessible at `https://api.dunepower.acceptable.pro/api/v1`

### 401 Unauthorized errors

1. Check that product key is stored in Redux state
2. Verify `X-Product-Key` header is being sent (check Network tab)
3. Test product key validation with `/auth/validate-key` endpoint
4. Check backend logs for key validation errors

### Environment variables not updating

1. Restart the dev server after changing `.env` files
2. Clear browser cache
3. Check that variables are prefixed with `VITE_`
4. Rebuild for production: `npm run build`

## HTTP Status Codes

The backend uses standard HTTP status codes:

- **200 OK** - Request succeeded (GET, PUT)
- **201 Created** - Resource created (POST)
- **204 No Content** - Action succeeded, no content returned
- **400 Bad Request** - Invalid parameters or missing fields
- **401 Unauthorized** - Missing or invalid X-Product-Key header
- **404 Not Found** - Resource not found
- **422 Unprocessable Entity** - Validation failed (e.g., temp out of range)
- **500 Internal Server Error** - Backend error
