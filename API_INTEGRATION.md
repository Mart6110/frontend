# API Integration Documentation

## Overview

The frontend application has been fully integrated with the REST API backend. All dashboard widgets and components now fetch real data from the API endpoints instead of using mock data.

## Architecture

### Service Layer

The API integration is organized into three main service files:

#### 1. **api.ts** - Low-level API Client
Location: `src/services/api.ts`

- Handles all HTTP requests to the backend API
- Manages authentication headers (X-Product-Key)
- Provides type-safe functions for each API endpoint
- Base URL: `/api/v1`

**Key Functions:**
- `getLatestData()` - Fetch latest sensor reading
- `getHistoryData()` - Fetch historical data with date range and interval
- `controlPump()` - Start/stop water pump
- `controlHeater()` - Turn heater on/off
- `getControlStatus()` - Get current pump/heater status
- `getSettings()` / `updateSettings()` - Manage user settings
- `getElectricityPrice()` - Fetch electricity prices
- `getEvents()` - Fetch system events
- `getAlerts()` - Fetch active alerts
- `acknowledgeAlert()` - Acknowledge an alert
- `validateKey()` - Validate product key

#### 2. **dataTransform.ts** - Data Transformation Layer
Location: `src/services/dataTransform.ts`

- Converts API responses to dashboard-compatible data structures
- Handles data filtering by time range and date range
- Merges real-time updates with existing data
- Calculates derived metrics (efficiency, state of charge)

**Key Functions:**
- `convertHistoryToDashboard()` - Convert API history to dashboard format
- `convertLatestToDashboard()` - Convert single reading to dashboard format
- `mergeLatestData()` - Merge new data point into existing dashboard data
- `filterDataByTimeRange()` - Filter data by milliseconds from now
- `filterDataByDateRange()` - Filter data by date range

#### 3. **dashboardService.ts** - High-level Dashboard Service
Location: `src/services/dashboardService.ts`

- Provides business logic for dashboard operations
- Orchestrates multiple API calls
- Calculates optimal data intervals based on time range
- Simplifies dashboard data fetching

**Key Functions:**
- `fetchDashboardData()` - Fetch initial dashboard data with optimal interval
- `fetchLatestData()` - Fetch latest data for real-time updates
- `updateDashboardWithLatest()` - Update dashboard with new data point
- `controlPump()` / `controlHeater()` - Control actuators
- `getSettings()` / `updateSettings()` - Manage settings
- `calculateInterval()` - Calculate optimal data interval for time range

### Data Flow

```
API Backend (/api/v1)
    ↓
api.ts (HTTP requests, authentication)
    ↓
dataTransform.ts (convert to dashboard format)
    ↓
dashboardService.ts (business logic)
    ↓
Redux Store (state management)
    ↓
React Components (UI)
```

## Authentication

All API requests (except `/auth/validate-key`) require a product key sent in the `X-Product-Key` header.

The product key is:
1. Stored in a cookie named `apiKey`
2. Automatically retrieved and added to all requests
3. Managed by `apiKeySlice.ts` in the Redux store

## Real-time Updates

Both dashboard views fetch fresh data every 30 seconds:

```typescript
// Automatically fetches latest data every 30 seconds
useEffect(() => {
  const interval = setInterval(async () => {
    const { data, controlStatus, events } = await dashboardService.fetchLatestData()
    const updatedData = dashboardService.updateDashboardWithLatest(...)
    dispatch(setAllData(updatedData))
  }, 30000)
  
  return () => clearInterval(interval)
}, [allData])
```

## Data Intervals

The system automatically selects optimal data intervals based on time range to balance data resolution and API performance:

| Time Range | Interval | Max Points |
|------------|----------|------------|
| ≤ 2 hours | 1 minute | ~120 |
| ≤ 12 hours | 5 minutes | ~144 |
| ≤ 24 hours | 15 minutes | ~96 |
| ≤ 3 days | 30 minutes | ~144 |
| ≤ 7 days | 1 hour | ~168 |
| ≤ 30 days | 6 hours | ~120 |
| > 30 days | 1 day | varies |

## Updated Components

### Pages

**Advanced View** (`src/pages/advancedView.tsx`)
- Fetches 30 days of historical data on load
- Supports both realtime and date range modes
- Filters data based on user selection
- Updates every 30 seconds with latest readings

**Simple View** (`src/pages/simpleView.tsx`)
- Fetches 30 days of historical data on load
- Realtime mode only
- Updates every 30 seconds with latest readings

### Redux Store

**dashboardSlice.ts**
- Updated imports from `mockData` to `dataTransform`
- All reducers remain unchanged (data structure is compatible)

### Dashboard Components

All dashboard components work with the new API data structure without modifications:
- KPICard
- PumpStatusCard
- TemperatureChart
- EnergyChart
- FlowChart
- EfficiencyChart
- TemperatureVsPumpChart
- EventTimeline

The `DashboardEvent` interface is compatible with the previous `SystemEvent` interface.

## API Response Mapping

### Sensor Data Mapping

| API Field | Dashboard Field | Transform |
|-----------|----------------|-----------|
| `sand_temp` | `currentTemperature` | Direct |
| `water_temp_in` | - | Used in efficiency calc |
| `water_temp_out` | - | Used in efficiency calc |
| `flow_rate` | `currentFlow` | Direct |
| `power_w` | `currentPower` | Direct |
| `power_w` | `currentEnergyIn` | Convert W to kW |
| `power_w` * `efficiency` | `currentEnergyOut` | Calculated |
| - | `currentEfficiency` | Calculated from temp diff |
| `sand_temp` | `stateOfCharge` | Calculated (20-70°C range) |

### Event Type Mapping

| API Event Type | Dashboard Event Type | Severity |
|---------------|---------------------|----------|
| `pump_start` | `pump` | `info` |
| `pump_stop` | `pump` | `info` |
| `heat_on` | `energy` | `info` |
| `heat_off` | `energy` | `info` |
| `warning` | `warning` | `warning` |
| `error` | `error` | `error` |

## Removed Files

The following test/mock components have been removed from the advanced view:
- ExampleApiUsage component
- ApiTester component

These were temporary testing components and are no longer needed.

## Migration from Mock Data

The `mockData.ts` file is still present in the codebase but is no longer imported or used by any components. It can be safely deleted or kept for reference.

All imports have been updated:
```typescript
// Before
import { mockDataService } from "@/services/mockData"
import type { DashboardData, SystemEvent } from "@/services/mockData"

// After
import * as dashboardService from "@/services/dashboardService"
import type { DashboardData, DashboardEvent } from "@/services/dataTransform"
```

## Error Handling

All API calls include try-catch error handling:

```typescript
try {
  const data = await dashboardService.fetchDashboardData(...)
  dispatch(setAllData(data))
} catch (error) {
  console.error('Failed to load dashboard data:', error)
  // Error state is maintained - loading spinner stops
}
```

Errors are logged to console. Future enhancement could include:
- User-facing error messages
- Retry logic
- Fallback to cached data

## Backend Requirements

The backend must implement all endpoints as specified in the REST API documentation:

### Required Endpoints

**Data Endpoints:**
- `GET /api/v1/data/latest` - Latest sensor reading
- `GET /api/v1/data/history` - Historical data with filtering
- `POST /api/v1/data` - Submit sensor data (Arduino)

**Control Endpoints:**
- `POST /api/v1/control/pump` - Control pump
- `POST /api/v1/control/heater` - Control heater
- `GET /api/v1/control/status` - Get actuator status

**Settings Endpoints:**
- `GET /api/v1/settings` - Get user settings
- `PUT /api/v1/settings` - Update user settings
- `GET /api/v1/settings/electricity-price` - Get electricity prices

**Events Endpoints:**
- `GET /api/v1/events` - Get system events
- `GET /api/v1/events/alerts` - Get active alerts
- `POST /api/v1/events/alerts/:id/acknowledge` - Acknowledge alert
- `POST /api/v1/events/heartbeat` - Heartbeat signal (Arduino)

**Auth Endpoints:**
- `POST /api/v1/auth/validate-key` - Validate product key

### Authentication

All endpoints (except `/auth/validate-key`) must:
1. Accept `X-Product-Key` header
2. Return `401 Unauthorized` if missing or invalid
3. Return data scoped to that product key

## Future Enhancements

1. **Settings Component**: Update the Settings component to use the real API fields (currently uses placeholder fields)

2. **Control Actions**: Add pump/heater control buttons to dashboard widgets

3. **Alerts UI**: Implement alert notification system with acknowledge functionality

4. **Offline Mode**: Add support for offline operation with cached data

5. **WebSocket**: Replace polling with WebSocket for true real-time updates

6. **Error UI**: Add user-facing error messages and retry functionality

7. **Loading States**: Add skeleton loaders for better UX during data fetching

## Testing

To test the API integration:

1. Ensure backend is running and accessible at `/api/v1`
2. Set a valid product key via the authentication flow
3. Navigate to dashboard - should see data loading from API
4. Check browser console for any API errors
5. Verify data updates every 30 seconds
6. Test different time range selections
7. Check network tab to verify correct API calls

## Troubleshooting

**No data showing:**
- Check if backend is running
- Verify product key is valid (check cookies)
- Check browser console for API errors
- Verify API base URL is correct

**Data not updating:**
- Check browser console for fetch errors
- Verify product key hasn't expired
- Check if backend is returning data

**Wrong time range:**
- Verify timezone settings (API uses UTC)
- Check date format in API calls (ISO 8601)
- Verify interval calculation is correct
