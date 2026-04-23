import { useGetLatestDataQuery } from '@/store/apiSlice'
import { Box, Text, Spinner } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'

/**
 * Example component showing how to use RTK Query hooks
 * 
 * This is a reference implementation - you can adapt this pattern
 * to replace the mockDataService in your actual components
 */
export function ExampleApiUsage() {
  // Basic query - fetches latest sensor data
  const { 
    data, 
    error, 
    isLoading,
    isError,
    refetch 
  } = useGetLatestDataQuery(
    undefined,
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
      <Box
        p={4}
        borderRadius="md"
        bg="red.500/10"
        borderWidth="1px"
        borderColor="red.500"
      >
        <Text color="red.500" fontWeight="medium">
          Error loading dashboard data. 
          {error && 'status' in error && ` Status: ${error.status}`}
        </Text>
      </Box>
    )
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Sand Temperature: {data?.sand_temp}°C
      </Text>
      <Text fontSize="sm" mb={1}>Water In: {data?.water_temp_in}°C</Text>
      <Text fontSize="sm" mb={1}>Water Out: {data?.water_temp_out}°C</Text>
      <Text fontSize="sm" mb={1}>Flow Rate: {data?.flow_rate} L/min</Text>
      <Text fontSize="sm" mb={1}>Power: {data?.power_w}W</Text>
      <Text fontSize="sm" mb={3}>Energy: {data?.energy_kwh} kWh</Text>
      <Text fontSize="sm" mb={3} fontWeight="bold" color={data?.status === 'OK' ? 'green.500' : 'red.500'}>
        Status: {data?.status}
      </Text>
      
      {/* Button to manually refetch */}
      <Button onClick={() => refetch()} size="sm" colorPalette="blue">
        Refresh Data
      </Button>
    </Box>
  )
}

/**
 * Example: Using history data endpoint
 */
export function HistoryQueryExample() {
  const { data: historyData, isLoading } = useGetLatestDataQuery()

  if (isLoading) {
    return <Text fontSize="sm">Loading history...</Text>
  }

  return (
    <Box>
      <Text fontSize="sm" fontWeight="bold">Latest Reading:</Text>
      <Text fontSize="xs">Sand Temp: {historyData?.sand_temp}°C</Text>
      <Text fontSize="xs">Power: {historyData?.power_w}W</Text>
    </Box>
  )
}
