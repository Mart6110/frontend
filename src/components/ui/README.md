# UI Components

## Widget Component

A reusable container component for wrapping charts, cards, and other dashboard content with consistent styling.

### Usage

```tsx
import { Widget } from "@/components/ui/widget"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"

// Basic usage
<Widget>
  <TemperatureChart data={data} height={300} />
</Widget>

// With variants
<Widget variant="default">  {/* Standard styling */}
  <Content />
</Widget>

<Widget variant="subtle">   {/* Lighter, more subtle */}
  <Content />
</Widget>

<Widget variant="elevated">  {/* More prominent with stronger glow */}
  <Content />
</Widget>

// With custom props (extends BoxProps)
<Widget variant="elevated" p={8} bg="rgba(0, 0, 0, 0.3)">
  <Content />
</Widget>
```

### Props

- `children: ReactNode` - Content to display inside the widget
- `variant?: "default" | "subtle" | "elevated"` - Visual variant (default: "default")
- All Chakra UI `BoxProps` are also supported

## DatePicker Component

A date picker component with optional time selection, using date-fns for date formatting and parsing. Built on native HTML date/datetime inputs with Chakra UI styling.

### Usage

```tsx
import { DatePicker } from "@/components/ui/date-picker"
import { useState } from "react"

function MyComponent() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  return (
    <>
      {/* Basic date picker */}
      <DatePicker
        label="Select Date"
        value={selectedDate}
        onChange={setSelectedDate}
      />

      {/* Date and time picker */}
      <DatePicker
        label="Select Date & Time"
        value={selectedDate}
        onChange={setSelectedDate}
        showTime
      />

      {/* With date constraints */}
      <DatePicker
        label="Future Date Only"
        value={selectedDate}
        onChange={setSelectedDate}
        minDate={new Date()}
        maxDate={new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)}
      />

      {/* With validation */}
      <DatePicker
        label="Required Date"
        value={selectedDate}
        onChange={setSelectedDate}
        required
        error={!selectedDate ? "Date is required" : undefined}
      />

      {/* Without label (inline) */}
      <DatePicker
        placeholder="Pick a date"
        value={selectedDate}
        onChange={setSelectedDate}
      />
    </>
  )
}
```

### Props

- `label?: string` - Label text for the date picker
- `value?: Date` - Currently selected date
- `onChange?: (date: Date | null) => void` - Callback when date changes
- `minDate?: Date` - Minimum selectable date
- `maxDate?: Date` - Maximum selectable date
- `placeholder?: string` - Placeholder text (default: "Select date")
- `error?: string` - Error message to display
- `required?: boolean` - Whether the field is required
- `disabled?: boolean` - Whether the picker is disabled
- `showTime?: boolean` - Whether to include time selection (default: false)

### Example: Date Range Filter

```tsx
import { DatePicker } from "@/components/ui/date-picker"
import { Widget } from "@/components/ui/widget"
import { Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import { subDays, addDays, isAfter, isBefore } from "date-fns"

function DateRangeFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)

  // Validate date range
  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date)
    if (date && endDate && isAfter(date, endDate)) {
      setEndDate(null) // Clear end date if start is after end
    }
  }

  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date)
    if (date && startDate && isBefore(date, startDate)) {
      setStartDate(null) // Clear start date if end is before start
    }
  }

  return (
    <Widget variant="subtle">
      <Text fontSize="lg" fontWeight="bold" mb={4}>
        Filter by Date Range
      </Text>
      <Flex gap={4} direction={{ base: "column", md: "row" }}>
        <DatePicker
          label="Start Date"
          value={startDate}
          onChange={handleStartDateChange}
          maxDate={endDate || undefined}
        />
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={handleEndDateChange}
          minDate={startDate || undefined}
        />
      </Flex>
    </Widget>
  )
}
```

### Using with date-fns utilities

```tsx
import { DatePicker } from "@/components/ui/date-picker"
import { subDays, addDays, startOfWeek, endOfWeek, format } from "date-fns"

// Last 7 days range
const [date, setDate] = useState<Date | null>(new Date())
<DatePicker
  value={date}
  onChange={setDate}
  minDate={subDays(new Date(), 7)}
  maxDate={new Date()}
/>

// This week only
<DatePicker
  value={date}
  onChange={setDate}
  minDate={startOfWeek(new Date())}
  maxDate={endOfWeek(new Date())}
/>

// Display formatted date
{date && <Text>Selected: {format(date, "PPP")}</Text>}
```
