import { VStack, Grid, GridItem, Box } from "@chakra-ui/react"
import { useEffect, useRef, useMemo } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import { mockDataService } from "@/services/mockData"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { FlowChart } from "@/components/dashboard/FlowChart"
import { EfficiencyChart } from "@/components/dashboard/EfficiencyChart"
import { TemperatureVsPumpChart } from "@/components/dashboard/TemperatureVsPumpChart"
import { ChartSkeleton } from "@/components/dashboard/Skeletons"
import { ViewModeToggle } from "@/components/dashboard/ViewModeToggle"
import { RealtimeTimeSelector } from "@/components/dashboard/RealtimeHoursSelector"
import { DateRangeSelector } from "@/components/dashboard/DateRangeSelector"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Widget } from "@/components/ui/widget"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RealtimeTimeConfig } from "@/constants/timeRanges"
import {
  setAllData,
  setDisplayData,
  setIsLoading,
  setIsFiltering,
  setViewMode,
  setRealtimeConfig,
  setStartDate,
  setEndDate,
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

export function AdvancedViewPage() {
  const dispatch = useAppDispatch()
  const {
    allData,
    displayData,
    isLoading,
    isFiltering,
    viewMode,
    realtimeConfig,
    startDate: startDateISO,
    endDate: endDateISO,
  } = useAppSelector((state) => state.dashboard.advanced)

  // Track if this is a realtime update vs user-triggered filter change
  const isRealtimeUpdateRef = useRef(false)

  // Convert ISO strings back to Date objects - memoized to prevent infinite loops
  const startDate = useMemo(
    () => (startDateISO ? new Date(startDateISO) : null),
    [startDateISO]
  )
  const endDate = useMemo(
    () => (endDateISO ? new Date(endDateISO) : null),
    [endDateISO]
  )

  // Initialize with historical data
  useEffect(() => {
    // Simulate realistic loading time
    const loadData = async () => {
      dispatch(setIsLoading(true))
      await new Promise(resolve => setTimeout(resolve, 1200)) // 1.2 second delay
      // Generate 30 days of historical data to support date range selection
      const initialData = mockDataService.generateHistoricalData(24 * 30) // 30 days
      dispatch(setAllData(initialData))
      dispatch(setIsLoading(false))
    }
    
    loadData()
  }, [dispatch])

  // Update display data when parameters change
  useEffect(() => {
    if (!allData) return

    // Skip filtering if this is just a realtime data update in realtime mode
    if (isRealtimeUpdateRef.current && viewMode === 'realtime') {
      isRealtimeUpdateRef.current = false
      // Just update displayData directly from allData for realtime mode
      const milliseconds = timeConfigToMilliseconds(realtimeConfig)
      const filteredData = mockDataService.getDataForTimeRange(allData, milliseconds)
      dispatch(setDisplayData(filteredData))
      return
    }

    isRealtimeUpdateRef.current = false
    dispatch(setIsFiltering(true))
    
    let filteredData
    
    if (viewMode === 'realtime') {
      // Realtime mode: show last X time from now
      const milliseconds = timeConfigToMilliseconds(realtimeConfig)
      filteredData = mockDataService.getDataForTimeRange(allData, milliseconds)
    } else {
      // Date range mode: show specific date range
      if (!startDate || !endDate) {
        dispatch(setIsFiltering(false))
        return
      }
      filteredData = mockDataService.getDataForDateRange(allData, startDate, endDate)
    }
    
    dispatch(setDisplayData(filteredData))
    dispatch(setIsFiltering(false))
  }, [allData, viewMode, realtimeConfig, startDate, endDate, dispatch])

  // Real-time updates every 30 seconds
  useEffect(() => {
    if (!allData) return

    const interval = setInterval(() => {
      isRealtimeUpdateRef.current = true
      const updatedData = mockDataService.generateRealtimeUpdate(allData)
      dispatch(setAllData(updatedData))
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [allData, dispatch])

  return (
    <Box p={{ base: 4, md: 8 }}>
      <VStack align="start" gap={6} w="-webkit-fill-available">
        {/* Header with Time Controls */}
        <DashboardHeader 
          events={displayData?.events}
          isLoading={isLoading}
          maxEvents={100}
        >
          <ViewModeToggle
            value={viewMode}
            onChange={(value) => dispatch(setViewMode(value))}
            disabled={isLoading || isFiltering}
            size="md"
          />

          {viewMode === 'realtime' && (
            <RealtimeTimeSelector
              value={realtimeConfig}
              onChange={(config) => dispatch(setRealtimeConfig(config))}
              disabled={isLoading || isFiltering}
              size="md"
            />
          )}

          {viewMode === 'dateRange' && (
            <DateRangeSelector
              startDate={startDate}
              endDate={endDate}
              onStartDateChange={(date) => dispatch(setStartDate(date))}
              onEndDateChange={(date) => dispatch(setEndDate(date))}
              disabled={isLoading || isFiltering}
              showTime
            />
          )}
        </DashboardHeader>
        
        {/* KPI Cards Grid */}
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }}
          gap={4}
          w="full"
        >
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.TEMPERATURE}
              value={displayData?.currentTemperature.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
              status="success"
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.POWER}
              value={displayData?.currentPower.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.POWER}
              status={displayData?.isPumpActive ? "success" : "info"}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.EFFICIENCY}
              value={displayData?.currentEfficiency.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
              status={displayData && displayData.currentEfficiency > 80 ? "success" : "warning"}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.FLOW_RATE}
              value={displayData?.currentFlow.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.FLOW}
              status="info"
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.STATE_OF_CHARGE}
              value={displayData?.stateOfCharge.toFixed(0) ?? "0"}
              unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
              status="info"
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>

        {/* System Status and Energy KPIs */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
          w="full"
        >
          <GridItem>
            <PumpStatusCard 
              isActive={displayData?.isPumpActive ?? false} 
              size="lg"
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.ENERGY_IN}
              value={displayData?.currentEnergyIn.toFixed(2) ?? "0.00"}
              unit={APP_TEXT.DASHBOARD.UNITS.ENERGY}
              status="info"
              size="lg"
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.ENERGY_OUT}
              value={displayData?.currentEnergyOut.toFixed(2) ?? "0.00"}
              unit={APP_TEXT.DASHBOARD.UNITS.ENERGY}
              status="success"
              size="lg"
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>

        {/* Main Charts Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={6}
          w="full"
        >
          {isLoading ? (
            <>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
            </>
          ) : displayData && (
            <>
              {/* Temperature Chart */}
              <GridItem>
                <Widget>
                  <TemperatureChart 
                    data={displayData.temperatureHistory}
                    height={300}
                  />
                </Widget>
              </GridItem>

              {/* Energy Transfer Chart */}
              <GridItem>
                <Widget>
                  <EnergyChart 
                    data={displayData.energyHistory}
                    height={300}
                  />
                </Widget>
              </GridItem>

              {/* Flow Rate Chart */}
              <GridItem>
                <Widget>
                  <FlowChart 
                    data={displayData.flowHistory}
                    height={300}
                  />
                </Widget>
              </GridItem>

              {/* Efficiency Trend Chart */}
              <GridItem>
                <Widget>
                  <EfficiencyChart 
                    data={displayData.energyHistory}
                    height={300}
                  />
                </Widget>
              </GridItem>
            </>
          )}
        </Grid>

        {/* Correlation Chart - Temperature vs Pump */}
        <Grid templateColumns="1fr" w="full">
          {isLoading ? (
            <GridItem><ChartSkeleton height="300px" /></GridItem>
          ) : displayData && (
            <GridItem>
              <Widget>
                <TemperatureVsPumpChart 
                  temperatureData={displayData.temperatureHistory}
                  pumpData={displayData.pumpHistory}
                  height={300}
                />
              </Widget>
            </GridItem>
          )}
        </Grid>

      </VStack>
    </Box>
  )
}
