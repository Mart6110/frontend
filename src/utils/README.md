# Utility Functions

This directory contains utility functions used throughout the application.

## Files

### `exportToExcel.ts`

Utility for exporting dashboard data to Excel format:
- Exports chart data to `.xlsx` files
- Formats timestamps and values
- Creates separate sheets for different data types
- Uses `xlsx` library for file generation

### `requireApiKey.ts`

Route protection utility:
- Checks if user has entered an API key
- Redirects to home page if no API key is present
- Used in route configuration for protected views

## Usage

### Export to Excel

```typescript
import { exportToExcel } from "@/utils/exportToExcel"

// Export temperature data
exportToExcel(
  temperatureData,
  "Temperature Data",
  "temperature-export.xlsx"
)
```

### Require API Key

```typescript
import { requireApiKey } from "@/utils/requireApiKey"

// In route configuration
export const Route = createFileRoute('/dashboard')({
  beforeLoad: requireApiKey,
  component: Dashboard,
})
```

## Adding New Utilities

When adding new utility functions:
1. Create a new file in this directory
2. Export functions with clear TypeScript types
3. Add JSDoc comments for documentation
4. Update this README with usage examples
