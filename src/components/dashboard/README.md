# Time Range Components

Reusable components for managing time-based data filtering in dashboard views.

## Components

### ViewModeToggle

Toggle between "Realtime" and "Date Range" view modes.

**Usage:**
```tsx
import { ViewModeToggle } from "@/components/dashboard/ViewModeToggle"
import { useState } from "react"
import type { ViewMode } from "@/constants/timeRanges"

function MyDashboard() {
  const [mode, setMode] = useState<ViewMode>('realtime')
  
  return (
    <ViewModeToggle
      value={mode}
      onChange={setMode}
      disabled={false}
      size="md"
    />
  )
}
```

**Props:**
- `value: ViewMode` - Current mode ('realtime' | 'dateRange')
- `onChange: (mode: ViewMode) => void` - Callback when mode changes
- `disabled?: boolean` - Disable the toggle
- `size?: "xs" | "sm" | "md" | "lg"` - Button size (default: "md")

---

### RealtimeHoursSelector

Select time range for realtime mode (1h, 2h, 3h, 5h, 6h, 12h, 24h).

**Usage:**
```tsx
import { RealtimeHoursSelector } from "@/components/dashboard/RealtimeHoursSelector"
import { useState } from "react"
import type { RealtimeHours } from "@/constants/timeRanges"

function MyDashboard() {
  const [hours, setHours] = useState<RealtimeHours>(6)
  
  return (
    <RealtimeHoursSelector
      value={hours}
      onChange={setHours}
      disabled={false}
      size="sm"
    />
  )
}
```

**Props:**
- `value: RealtimeHours` - Currently selected hours
- `onChange: (hours: RealtimeHours) => void` - Callback when selection changes
- `disabled?: boolean` - Disable all buttons
- `size?: "xs" | "sm" | "md" | "lg"` - Button size (default: "sm")

---

### DateRangeSelector

Select custom date range with start and end date pickers.

**Usage:**
```tsx
import { DateRangeSelector } from "@/components/dashboard/DateRangeSelector"
import { useState } from "react"
import { subDays } from "date-fns"

function MyDashboard() {
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 7))
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  
  return (
    <DateRangeSelector
      startDate={startDate}
      endDate={endDate}
      onStartDateChange={setStartDate}
      onEndDateChange={setEndDate}
      disabled={false}
      showTime={true}
    />
  )
}
```

**Props:**
- `startDate: Date | null` - Start date
- `endDate: Date | null` - End date
- `onStartDateChange: (date: Date | null) => void` - Start date change callback
- `onEndDateChange: (date: Date | null) => void` - End date change callback
- `disabled?: boolean` - Disable both pickers
- `showTime?: boolean` - Include time selection (default: true)

**Features:**
- Automatic validation: prevents invalid date ranges
- Smart adjustment: if start > end, end is adjusted automatically (and vice versa)
- Max date constraint: end date cannot exceed current time

---

## Constants

### timeRanges.ts

Centralized constants for time range options.

```tsx
import { 
  REALTIME_HOURS, 
  DEFAULT_REALTIME_HOURS, 
  DEFAULT_VIEW_MODE,
  type RealtimeHours,
  type ViewMode 
} from "@/constants/timeRanges"

// Available realtime hour options: [1, 2, 3, 5, 6, 12, 24]
console.log(REALTIME_HOURS)

// Default: 6
console.log(DEFAULT_REALTIME_HOURS)

// Default: 'realtime'
console.log(DEFAULT_VIEW_MODE)
```

**Exports:**
- `REALTIME_HOURS` - Array of available hour options: `[1, 2, 3, 5, 6, 12, 24]`
- `DEFAULT_REALTIME_HOURS` - Default value: `6`
- `DEFAULT_VIEW_MODE` - Default mode: `'realtime'`
- `RealtimeHours` - Type for valid hour values
- `ViewMode` - Type: `'realtime' | 'dateRange'`

---

## Complete Example

Full implementation with all components:

```tsx
import { useState, useEffect } from "react"
import { Flex, VStack } from "@chakra-ui/react"
import { ViewModeToggle } from "@/components/dashboard/ViewModeToggle"
import { RealtimeHoursSelector } from "@/components/dashboard/RealtimeHoursSelector"
import { DateRangeSelector } from "@/components/dashboard/DateRangeSelector"
import { 
  DEFAULT_VIEW_MODE, 
  DEFAULT_REALTIME_HOURS,
  type ViewMode, 
  type RealtimeHours 
} from "@/constants/timeRanges"
import { subHours, differenceInHours } from "date-fns"

function Dashboard() {
  const [viewMode, setViewMode] = useState<ViewMode>(DEFAULT_VIEW_MODE)
  const [realtimeHours, setRealtimeHours] = useState<RealtimeHours>(DEFAULT_REALTIME_HOURS)
  const [startDate, setStartDate] = useState<Date | null>(() => subHours(new Date(), DEFAULT_REALTIME_HOURS))
  const [endDate, setEndDate] = useState<Date | null>(new Date())
  const [isLoading, setIsLoading] = useState(false)

  // Calculate effective time range
  useEffect(() => {
    let hours: number
    
    if (viewMode === 'realtime') {
      hours = realtimeHours
    } else {
      if (!startDate || !endDate) return
      hours = differenceInHours(endDate, startDate)
    }
    
    // Use hours to filter your data
    console.log(`Showing last ${hours} hours of data`)
  }, [viewMode, realtimeHours, startDate, endDate])

  return (
    <VStack gap={4} align="stretch">
      <Flex gap={3} direction="column">
        <ViewModeToggle
          value={viewMode}
          onChange={setViewMode}
          disabled={isLoading}
        />

        {viewMode === 'realtime' && (
          <RealtimeHoursSelector
            value={realtimeHours}
            onChange={setRealtimeHours}
            disabled={isLoading}
          />
        )}

        {viewMode === 'dateRange' && (
          <DateRangeSelector
            startDate={startDate}
            endDate={endDate}
            onStartDateChange={setStartDate}
            onEndDateChange={setEndDate}
            disabled={isLoading}
          />
        )}
      </Flex>
    </VStack>
  )
}
```
