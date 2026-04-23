# API Configuration Guide

## Overview

This project uses RTK Query for API calls with environment-based configuration.

## Environment Setup

### Local Development

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. The default configuration proxies API requests through Vite dev server:
   ```
   VITE_API_BASE_URL=/api
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. API requests will be proxied to `http://localhost:8080/api/` (configured in `vite.config.ts`)

### Production Build

1. Create `.env.production` (or use the provided one):
   ```
   VITE_API_BASE_URL=https://api.dunepower.acceptable.pro
   ```

2. Build for production:
   ```bash
   npm run build
   ```

3. The built app will make API requests directly to `https://api.dunepower.acceptable.pro`

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

For production, the nginx.conf should proxy to your actual backend:

```nginx
location /api/ {
    proxy_pass https://api.dunepower.acceptable.pro/api/;
    ...
}
```

## Using RTK Query in Components

### Example: Fetching Dashboard Data

```typescript
import { useGetDashboardDataQuery } from '@/store/apiSlice'

function DashboardComponent() {
  const { data, error, isLoading } = useGetDashboardDataQuery({
    startDate: '2024-01-01',
    endDate: '2024-01-31',
  })

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error loading data</div>

  return (
    <div>
      <h1>Temperature: {data?.currentTemperature}°C</h1>
      <p>Efficiency: {data?.currentEfficiency}%</p>
    </div>
  )
}
```

### Example: Fetching with Polling

```typescript
const { data } = useGetDashboardDataQuery(
  { timeRange: 'last-24h' },
  {
    pollingInterval: 30000, // Poll every 30 seconds
  }
)
```

### Example: Using Mutations

```typescript
import { useUpdateSettingsMutation } from '@/store/apiSlice'

function SettingsForm() {
  const [updateSettings, { isLoading }] = useUpdateSettingsMutation()

  const handleSubmit = async (values) => {
    try {
      await updateSettings(values).unwrap()
      alert('Settings updated!')
    } catch (error) {
      console.error('Failed to update settings:', error)
    }
  }

  return <form onSubmit={handleSubmit}>...</form>
}
```

## API Endpoints

The following endpoints are configured in `apiSlice.ts`:

- `GET /api/dashboard` - Get dashboard data
  - Query params: `startDate`, `endDate`, `timeRange`
  
- `GET /api/events` - Get system events
  - Query params: `limit`, `types`, `severities`
  
- `PUT /api/settings` - Update system settings

## Authentication

API requests automatically include the API key from Redux state:

```typescript
headers.set('Authorization', `Bearer ${apiKey}`)
```

The API key is managed by the `apiKeySlice` and stored in cookies.

## Environment Variables

All environment variables must be prefixed with `VITE_` to be exposed to the client:

```env
VITE_API_BASE_URL=/api           # Development
VITE_API_BASE_URL=https://...    # Production
```

## Troubleshooting

### API requests fail in development

1. Check that backend is running on port 8080
2. Verify proxy configuration in `vite.config.ts`
3. Check browser network tab for actual request URL

### API requests fail in production

1. Verify `VITE_API_BASE_URL` in `.env.production`
2. Check CORS settings on backend
3. Verify nginx proxy configuration if using Docker

### Environment variables not updating

1. Restart the dev server after changing `.env` files
2. Clear browser cache
3. Check that variables are prefixed with `VITE_`
