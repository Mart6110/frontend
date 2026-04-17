# Chart/Table View Toggle Feature

## Overview
All chart components in the dashboard now support toggling between graph and table views, allowing users to see the same data in different formats.

## Components Added

### 1. ChartViewToggle
- **Location**: `src/components/dashboard/ChartViewToggle.tsx`
- **Purpose**: A toggle button component for switching between graph and table views
- **Props**:
  - `value`: Current view mode ('graph' | 'table')
  - `onChange`: Callback when view mode changes
  - `disabled`: Optional disable state
  - `size`: Button size (default: 'sm')

### 2. DataTable
- **Location**: `src/components/dashboard/DataTable.tsx`
- **Purpose**: Generic table component for displaying chart data in tabular format
- **Props**:
  - `data`: Array of data points
  - `columns`: Array of column definitions
  - `height`: Table height (default: 300)
  - `title`: Optional table title
  - `maxRows`: Maximum rows to display (default: 100)
- **Features**:
  - Shows most recent data first
  - Scrollable container
  - Formatted timestamps
  - Custom formatters per column
  - Row count indicator when data exceeds maxRows

### 3. ChartWithTableWrapper
- **Location**: `src/components/dashboard/ChartWithTableWrapper.tsx`
- **Purpose**: Wrapper component that adds toggle functionality to charts
- **Props**:
  - `chartComponent`: React node containing the chart
  - `tableComponent`: React node containing the table
  - `defaultView`: Initial view mode (default: 'graph')
  - `showToggle`: Whether to show the toggle button (default: true)

## Updated Chart Components

All chart components now support table view:

1. **TemperatureChart**
   - Table columns: Time, Temperature

2. **EnergyChart**
   - Table columns: Time, Energy In, Energy Out

3. **FlowChart**
   - Table columns: Time, Flow Rate

4. **EfficiencyChart**
   - Table columns: Time, Energy In, Energy Out, Efficiency (calculated)

5. **TemperatureVsPumpChart**
   - Table columns: Time, Temperature, Pump Status (Active/Inactive)

## Usage

### Basic Usage
All chart components now accept an optional `enableTableView` prop:

```tsx
<TemperatureChart 
  data={temperatureData} 
  enableTableView={true} // default
/>
```

### Disable Table View
To show only the graph without toggle:

```tsx
<TemperatureChart 
  data={temperatureData} 
  enableTableView={false}
/>
```

### Custom Table Columns
When creating new chart components with table support:

```tsx
const tableColumns: Column[] = [
  { key: 'timestamp', label: 'Time' },
  { key: 'value', label: 'Value', unit: 'kW' },
  { key: 'status', label: 'Status', format: (val) => val ? 'On' : 'Off' }
]
```

## Implementation Details

### Data Format
- Tables show the most recent 100 data points by default
- Data is displayed in reverse chronological order (newest first)
- Timestamps are automatically formatted for readability

### Styling
- Tables inherit the app's theme with custom styling
- Border color: `rgba(0, 255, 170, 0.2)` (matching dashboard aesthetic)
- Striped rows for better readability
- Responsive design with scrollable container

### Performance
- Tables limit displayed rows to prevent performance issues
- Chart data sampling is maintained for graph view
- Table view uses raw data for accuracy

## Future Enhancements

Potential improvements:
1. Export table data to CSV
2. Sorting and filtering capabilities
3. Column visibility toggles
4. Customizable date/time formats
5. Search functionality within table data
