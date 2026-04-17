import { VStack, Grid, GridItem, Box } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import { mockDataService } from "@/services/mockData"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { ChartSkeleton } from "@/components/dashboard/Skeletons"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { RealtimeTimeSelector } from "@/components/dashboard/RealtimeHoursSelector"
import { Widget } from "@/components/ui/widget"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RealtimeTimeConfig } from "@/constants/timeRanges"
import { 
  setSimpleAllData,
  setSimpleDisplayData, 
  setSimpleData, 
  setSimpleIsLoading,
  setSimpleRealtimeConfig 
} from "@/store/dashboardSlice"

// Helper function to convert time config to milliseconds
function timeConfigToMilliseconds(config: RealtimeTimeConfig): number {
  const { value, unit } = config
  switch (unit) {
    case 'minutes':
      return value * 60 * 1000
    case 'hours':
      return value * 60 * 60 * 1000
    case 'days':
      return value * 24 * 60 * 60 * 1000
    default:
      return value * 60 * 60 * 1000 // default to hours
  }
}

export function SimpleViewPage() {
  const dispatch = useAppDispatch()
  const { allData, data, isLoading, realtimeConfig } = useAppSelector((state) => state.dashboard.simple)
  
  // Track if this is a realtime update vs user-triggered filter change
  const isRealtimeUpdateRef = useRef(false)

  // Initialize with historical data (30 days to support longer time ranges)
  useEffect(() => {
    // Simulate realistic loading time
    const loadData = async () => {
      dispatch(setSimpleIsLoading(true))
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
      const initialData = mockDataService.generateHistoricalData(24 * 30) // 30 days
      dispatch(setSimpleAllData(initialData))
      dispatch(setSimpleData(initialData))
      dispatch(setSimpleIsLoading(false))
    }
    
    loadData()
  }, [dispatch])

  // Update display data when realtimeConfig changes
  useEffect(() => {
    if (!allData) return

    // Skip filtering if this is just a realtime data update
    if (isRealtimeUpdateRef.current) {
      isRealtimeUpdateRef.current = false
      const milliseconds = timeConfigToMilliseconds(realtimeConfig)
      const filteredData = mockDataService.getDataForTimeRange(allData, milliseconds)
      dispatch(setSimpleDisplayData(filteredData))
      dispatch(setSimpleData(filteredData))
      return
    }

    const milliseconds = timeConfigToMilliseconds(realtimeConfig)
    const filteredData = mockDataService.getDataForTimeRange(allData, milliseconds)
    dispatch(setSimpleDisplayData(filteredData))
    dispatch(setSimpleData(filteredData))
  }, [allData, realtimeConfig, dispatch])

  // Real-time updates every 15 seconds
  useEffect(() => {
    if (!allData) return

    const interval = setInterval(() => {
      isRealtimeUpdateRef.current = true
      const updatedData = mockDataService.generateRealtimeUpdate(allData)
      dispatch(setSimpleAllData(updatedData))
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [allData, dispatch])

  return (
    <Box p={{ base: 4, md: 8 }}>
      <VStack align="start" gap={6} w="-webkit-fill-available">
        {/* Header */}
        <DashboardHeader 
          events={data?.events}
          isLoading={isLoading}
          maxEvents={50}
        >
          <RealtimeTimeSelector
            value={realtimeConfig}
            onChange={(config) => dispatch(setSimpleRealtimeConfig(config))}
            disabled={isLoading}
            size="md"
          />
        </DashboardHeader>
        
        {/* KPI Cards Grid */}
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
          gap={4}
          w="full"
        >
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.TEMPERATURE}
              value={data?.currentTemperature.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
              status={
                data 
                  ? data.currentTemperature > 660 
                    ? "error" 
                    : data.currentTemperature > 640 
                      ? "warning" 
                      : data.currentTemperature < 560 
                        ? "warning" 
                        : "success"
                  : "info"
              }
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.POWER}
              value={data?.currentPower.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.POWER}
              status={data?.isPumpActive ? "success" : "info"}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.EFFICIENCY}
              value={data?.currentEfficiency.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
              status={
                data 
                  ? data.currentEfficiency < 70 
                    ? "error" 
                    : data.currentEfficiency < 75 
                      ? "warning" 
                      : data.currentEfficiency > 85 
                        ? "success" 
                        : "info"
                  : "info"
              }
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.STATE_OF_CHARGE}
              value={data?.stateOfCharge.toFixed(0) ?? "0"}
              unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
              status={
                data 
                  ? data.stateOfCharge < 20 
                    ? "error" 
                    : data.stateOfCharge < 40 
                      ? "warning" 
                      : data.stateOfCharge > 80 
                        ? "success" 
                        : "info"
                  : "info"
              }
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>

        {/* Pump Status */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={4}
          w="full"
        >
          <GridItem>
            <PumpStatusCard 
              isActive={data?.isPumpActive ?? false} 
              size="lg"
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.FLOW_RATE}
              value={data?.currentFlow.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.FLOW}
              status={
                data 
                  ? data.currentFlow < 35 || data.currentFlow > 65 
                    ? "warning" 
                    : "success"
                  : "info"
              }
              size="lg"
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>

        {/* Charts */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr" }}
          gap={6}
          w="full"
        >
          {isLoading ? (
            <>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
            </>
          ) : data && (
            <>
              <GridItem>
                <Widget>
                  <TemperatureChart 
                    data={data.temperatureHistory}
                    height={300}
                  />
                </Widget>
              </GridItem>

              <GridItem>
                <Widget>
                  <EnergyChart 
                    data={data.energyHistory}
                    height={300}
                  />
                </Widget>
              </GridItem>
            </>
          )}
        </Grid>
      </VStack>
    </Box>
  )
}
