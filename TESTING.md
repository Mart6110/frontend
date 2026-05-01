# Test Suite Documentation

This document describes the test suite for the Sand Battery Dashboard application.

## Running Tests

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test src/services/__tests__/dataTransform.test.ts
```

## Test Coverage

### 1. Data Transformation Tests (`dataTransform.test.ts`)

Tests the core data transformation logic that converts API responses to dashboard data.

**Coverage:**
- `convertHistoryToDashboard()` - Converting historical data using last point as "latest"
- `convertHistoryToDashboardWithLatest()` - Converting with absolute latest sensor data
- `mergeLatestData()` - Merging new sensor readings into existing dashboard data
- Edge cases: empty data, duplicate timestamps, max history limits

**Key Test Scenarios:**
- ✅ Uses absolute latest sensor data for KPI cards
- ✅ Appends latest data point to chart history
- ✅ Prevents duplicate data points
- ✅ Maintains maximum history point limits
- ✅ Correctly maps sensor labels to dashboard fields
- ✅ Handles empty datasets gracefully

### 2. Dashboard Service Tests (`dashboardService.test.ts`)

Tests the service layer that orchestrates data fetching from the API.

**Coverage:**
- `fetchDashboardData()` - Main data fetching function with realtime/historical modes
- `fetchLatestData()` - Fetching current sensor readings
- `controlPump()` - Pump control operations
- `controlHeater()` - Heater control operations

**Key Test Scenarios:**
- ✅ Uses absolute latest when `useAbsoluteLatest: true` (realtime mode)
- ✅ Uses historical data when `useAbsoluteLatest: false` (date range mode)
- ✅ Auto-detects realtime vs historical based on time range
- ✅ Passes correct parameters to API calls
- ✅ Handles API errors gracefully
- ✅ Fetches data in parallel for performance

### 3. Electricity Price Chart Tests (`ElectricityPriceChart.test.tsx`)

Tests the electricity price visualization component.

**Coverage:**
- Chart rendering with various data sets
- Title formatting with date and area
- Table/Graph view toggle functionality
- Custom height and styling options

**Key Test Scenarios:**
- ✅ Renders with default and custom titles
- ✅ Displays area code (DK1/DK2) and date in title
- ✅ Handles empty data gracefully
- ✅ Shows Graph/Table toggle when enabled
- ✅ Handles extreme price values
- ✅ Works with single or multiple price entries

### 4. Electricity Price Current Hour Tests (`advancedView.electricity-price.test.ts`)

Tests the logic for calculating the current hour's electricity price.

**Coverage:**
- Current hour price extraction from price data
- Edge cases for hour matching
- Timezone and date format handling

**Key Test Scenarios:**
- ✅ Returns null when no price data
- ✅ Finds price for current hour correctly
- ✅ Returns null when current hour not in data
- ✅ Handles full 24-hour dataset
- ✅ Handles midnight (hour 0) correctly
- ✅ Handles late evening (hour 23) correctly
- ✅ Works with different ISO date formats

## Test Structure

```
Frontend/frontend/
├── src/
│   ├── services/
│   │   └── __tests__/
│   │       ├── dataTransform.test.ts
│   │       └── dashboardService.test.ts
│   ├── components/
│   │   └── dashboard/
│   │       └── __tests__/
│   │           └── ElectricityPriceChart.test.tsx
│   └── pages/
│       └── __tests__/
│           └── advancedView.electricity-price.test.ts
└── vitest.config.ts
```

## Key Features Tested

### 1. **Realtime vs Historical Data Logic**
The most critical feature - ensuring KPI cards show:
- **Realtime mode**: Absolute latest sensor readings (always current)
- **Date range mode**: Last data point from selected historical range

### 2. **Data Synchronization**
- KPI values match the last point in chart data
- No discrepancy between displayed values and charts
- Latest data point is appended to history when newer

### 3. **Electricity Price Integration**
- Current hour price calculation
- Price chart rendering
- Timezone handling for hourly data

## Mocking Strategy

### API Mocking
Tests use `vi.mock()` to mock the API module, allowing:
- Predictable test data
- Testing error scenarios
- Fast test execution without network calls

### Component Testing
Uses `@testing-library/react` with Chakra UI providers:
- Renders components in test environment
- Tests user interactions
- Validates displayed content

## Coverage Goals

Current test coverage focuses on:
1. **Critical business logic** (data transformation, service layer)
2. **New features** (electricity price integration)
3. **Bug fixes** (realtime vs historical data synchronization)

## Running Specific Test Suites

```bash
# Data transformation tests
npm run test dataTransform

# Service layer tests
npm run test dashboardService

# Component tests
npm run test ElectricityPriceChart

# All electricity price tests
npm run test electricity-price
```

## Continuous Integration

Tests should be run in CI/CD pipeline:
```yaml
# Example GitHub Actions
- name: Run Tests
  run: npm run test:coverage
  
- name: Upload Coverage
  uses: codecov/codecov-action@v3
```

## Future Test Additions

Recommended areas for additional test coverage:
- [ ] Redux store slices (dashboardSlice, apiSlice)
- [ ] Other chart components (TemperatureChart, EnergyChart, etc.)
- [ ] KPICard component
- [ ] Form validation in Settings
- [ ] Date range selectors
- [ ] Control modal interactions
- [ ] Real-time update mechanism
- [ ] Error boundary behavior

## Test Best Practices

1. **Arrange-Act-Assert**: Each test follows AAA pattern
2. **Descriptive names**: Test names describe behavior, not implementation
3. **Isolated tests**: Each test is independent and can run in any order
4. **Mock external dependencies**: API calls, timers, etc. are mocked
5. **Test behavior**: Focus on what the code does, not how it does it
6. **Edge cases**: Test empty data, null values, extreme values
7. **Error cases**: Test error handling and edge conditions

## Debugging Tests

```bash
# Run tests with verbose output
npm run test -- --reporter=verbose

# Run single test in watch mode
npm run test -- --watch ElectricityPriceChart

# Debug specific test
node --inspect-brk ./node_modules/.bin/vitest run dataTransform.test.ts
```
