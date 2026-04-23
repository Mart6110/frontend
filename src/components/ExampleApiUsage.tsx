import { useGetDashboardDataQuery } from '@/store/apiSlice'
import { Box, Text, Spinner, Alert } from '@chakra-ui/react'

/**
 * Example component showing how to use RTK Query hooks
 * 
 * This is a reference implementation - you can adapt this pattern
 * to replace the mockDataService in your actual components
 */
export function ExampleApiUsage() {
  // Basic query with parameters
  const { 
    data, 
    error, 
    isLoading,
    isError,
    refetch 
  } = useGetDashboardDataQuery(
    {
      timeRange: 'last-24h',
    },
    {
      // Optional: Enable polling for real-time updates
      pollingInterval: 30000, // 30 seconds
      // Optional: Skip the query under certain conditions
      // skip: !apiKey,
    }
  )

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" p={8}>
        <Spinner size="xl" />
      </Box>
    )
  }

  if (isError) {
    return (
      <Alert status="error">
        <Text>
          Error loading dashboard data. 
          {error && 'status' in error && ` Status: ${error.status}`}
        </Text>
      </Alert>
    )
  }

  return (
    <Box>
      <Text fontSize="2xl" fontWeight="bold">
        Current Temperature: {data?.currentTemperature}°C
      </Text>
      <Text>Efficiency: {data?.currentEfficiency}%</Text>
      <Text>Power: {data?.currentPower}kW</Text>
      
      {/* Button to manually refetch */}
      <button onClick={() => refetch()}>Refresh Data</button>
    </Box>
  )
}

/**
 * Example: Conditional queries based on view mode
 */
export function ConditionalQueryExample({ viewMode }: { viewMode: 'realtime' | 'historical' }) {
  const { data: realtimeData } = useGetDashboardDataQuery(
    { timeRange: 'last-1h' },
    { 
      skip: viewMode !== 'realtime',
      pollingInterval: 15000, // Only poll in realtime mode
    }
  )

  const { data: historicalData } = useGetDashboardDataQuery(
    { 
      startDate: '2024-01-01',
      endDate: '2024-01-31',
    },
    { 
      skip: viewMode !== 'historical',
    }
  )

  const data = viewMode === 'realtime' ? realtimeData : historicalData

  return (
    <Box>
      <Text>Mode: {viewMode}</Text>
      <Text>Temperature: {data?.currentTemperature}°C</Text>
    </Box>
  )
}
