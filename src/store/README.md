# Redux Store

This directory contains the Redux store configuration and state management using Redux Toolkit (RTK).

## Structure

```
store/
├── index.ts                 # Store configuration and types
├── hooks.ts                 # Typed Redux hooks
├── selectors.ts             # Reusable selectors
├── apiKeySlice.ts           # API key state management
└── dashboardSlice.ts        # Dashboard state management
```

## Core Files

### `index.ts`
Configures the Redux store with:
- All reducers (slices)
- TypeScript types for RootState and AppDispatch

### `hooks.ts`
Exports typed versions of Redux hooks:
- `useAppDispatch` - Typed dispatch hook
- `useAppSelector` - Typed selector hook

### `selectors.ts`
Reusable memoized selectors for optimal performance:
- Dashboard data selectors
- View mode and time range selectors
- Loading state selectors

### `apiKeySlice.ts`
Manages API key state:
- Stores API key in Redux state
- Persists to cookies for session management
- Actions: `setApiKey`, `clearApiKey`

### `dashboardSlice.ts`
Manages dashboard state for both Simple and Advanced views:
- Data storage (allData, displayData)
- Loading states
- View mode (realtime/dateRange)
- Time range configuration
- Date range selection

## Usage

### Using Redux Hooks

```typescript
import { useAppSelector, useAppDispatch } from "@/store/hooks"
import { setApiKey } from "@/store/apiKeySlice"

function MyComponent() {
  const dispatch = useAppDispatch()
  const apiKey = useAppSelector((state) => state.apiKey.apiKey)

  const handleSetKey = (key: string) => {
    dispatch(setApiKey(key))
  }

  return <div>API Key: {apiKey || "Not set"}</div>
}
```

### Using Selectors

```typescript
import { useAppSelector } from "@/store/hooks"
import { selectDisplayData, selectIsLoading } from "@/store/selectors"

function Dashboard() {
  const data = useAppSelector(selectDisplayData)
  const isLoading = useAppSelector(selectIsLoading)

  if (isLoading) return <div>Loading...</div>
  
  return <div>{/* Render dashboard with data */}</div>
}
```

### Dashboard State Management

```typescript
import { useAppDispatch } from "@/store/hooks"
import {
  setDisplayData,
  setViewMode,
  setRealtimeConfig,
  setDateRange,
} from "@/store/dashboardSlice"

function AdvancedView() {
  const dispatch = useAppDispatch()

  // Update data
  dispatch(setDisplayData(newData))

  // Change view mode
  dispatch(setViewMode('dateRange'))

  // Set time range
  dispatch(setRealtimeConfig({ value: 12, unit: 'hours' }))

  // Set custom date range
  dispatch(setDateRange({
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-01-31'),
  }))
}
```

## State Structure

### API Key Slice
```typescript
interface ApiKeyState {
  apiKey: string | null
}
```

### Dashboard Slice
```typescript
interface DashboardState {
  advanced: {
    allData: DashboardData | null
    displayData: DashboardData | null
    isLoading: boolean
    isFiltering: boolean
    viewMode: 'realtime' | 'dateRange'
    realtimeConfig: { value: number; unit: 'hours' }
    startDate: string | null
    endDate: string | null
  }
  simple: {
    allData: DashboardData | null
    displayData: DashboardData | null
    data: DashboardData | null
    isLoading: boolean
    realtimeConfig: { value: number; unit: 'hours' }
  }
}
```

## Best Practices

1. **Use typed hooks**: Always use `useAppDispatch` and `useAppSelector` instead of plain Redux hooks
2. **Use selectors**: Create reusable selectors in `selectors.ts` for complex state access
3. **Memoize selectors**: Use `createSelector` from Redux Toolkit for derived state
4. **Keep actions simple**: Dispatch actions and let reducers handle state updates
5. **Separate concerns**: Advanced and Simple views have separate state slices
