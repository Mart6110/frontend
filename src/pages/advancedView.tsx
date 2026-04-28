import { VStack, Grid, GridItem, Box } from "@chakra-ui/react"
import { useEffect, useRef, useMemo } from "react"
import { subHours } from "date-fns"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import * as dashboardService from "@/services/dashboardService"
import * as dataTransform from "@/services/dataTransform"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { HeaterStatusCard } from "@/components/dashboard/HeaterStatusCard"
import { ControlModal } from "@/components/dashboard/ControlModal"
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
import { Button } from "@/components/ui/button"
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

  // Control handler for modal updates
  const handleControlUpdate = async () => {
    // Refresh data after any control action from modal
    if (viewMode === 'realtime') {
      const { data: latestData, controlStatus, events } = await dashboardService.fetchLatestData()
      const updatedData = dashboardService.updateDashboardWithLatest(allData!, latestData, controlStatus, events)
      dispatch(setAllData(updatedData))
    }
  }

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
    const loadData = async () => {
      dispatch(setIsLoading(true))
      try {
        // Fetch 30 days of historical data
        const to = new Date()
        const from = subHours(to, 24 * 30) // 30 days
        const interval = dashboardService.calculateInterval(from, to)
        
        const initialData = await dashboardService.fetchDashboardData({ from, to, interval })
        dispatch(setAllData(initialData))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        // Could dispatch an error action here
      } finally {
        dispatch(setIsLoading(false))
      }
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
      const filteredData = dataTransform.filterDataByTimeRange(allData, milliseconds)
      dispatch(setDisplayData(filteredData))
      return
    }

    isRealtimeUpdateRef.current = false
    dispatch(setIsFiltering(true))

    let filteredData

    if (viewMode === 'realtime') {
      // Realtime mode: show last X time from now
      const milliseconds = timeConfigToMilliseconds(realtimeConfig)
      filteredData = dataTransform.filterDataByTimeRange(allData, milliseconds)
    } else {
      // Date range mode: show specific date range
      if (!startDate || !endDate) {
        dispatch(setIsFiltering(false))
        return
      }
      filteredData = dataTransform.filterDataByDateRange(allData, startDate, endDate)
    }

    dispatch(setDisplayData(filteredData))
    dispatch(setIsFiltering(false))
  }, [allData, viewMode, realtimeConfig, startDate, endDate, dispatch])

  // Real-time updates every 30 seconds
  useEffect(() => {
    if (!allData) return

    const interval = setInterval(async () => {
      try {
        const { data, controlStatus, events } = await dashboardService.fetchLatestData()
        isRealtimeUpdateRef.current = true
        const updatedData = dashboardService.updateDashboardWithLatest(allData, data, controlStatus, events)
        dispatch(setAllData(updatedData))
      } catch (error) {
        console.error('Failed to fetch latest data:', error)
      }
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [allData, dispatch])

  return (
    <Box display="flex" flexDirection="column" h="full">
      {/* Fixed Header with Controls */}
      <Box px={{ base: 4, md: 8 }} pt={{ base: 3 }}>
        <DashboardHeader
          events={displayData?.events}
          isLoading={isLoading}
          maxEvents={100}
          dashboardData={displayData ?? undefined}
          enableExport={true}
        >
          <ViewModeToggle
            value={viewMode}
            onChange={(value) => dispatch(setViewMode(value))}
            disabled={isLoading || isFiltering}
            size="sm"
          />

          {viewMode === 'realtime' && (
            <RealtimeTimeSelector
              value={realtimeConfig}
              onChange={(config) => dispatch(setRealtimeConfig(config))}
              disabled={isLoading || isFiltering}
              size="sm"
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
      </Box>

      {/* Scrollable Content */}
      <Box flex="1" overflowY="auto" px={{ base: 4, md: 8 }} py={4}>
        <VStack align="start" gap={4} w="-webkit-fill-available">
          {/* KPI Cards Grid */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={4}
            w="full"
          >
            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.TEMPERATURE}
                value={displayData?.currentTemperature.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.POWER}
                value={displayData?.currentPower.toFixed(0) ?? "0"}
                unit={APP_TEXT.DASHBOARD.UNITS.POWER}
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.FLOW_RATE}
                value={displayData?.currentFlow.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.FLOW}
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.ENERGY}
                value={displayData?.currentEnergy.toFixed(2) ?? "0.00"}
                unit={APP_TEXT.DASHBOARD.UNITS.ENERGY}
                isLoading={isLoading}
              />
            </GridItem>
          </Grid>

          {/* System Status and Water Temperature */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={4}
            w="full"
          >
            <GridItem>
              <PumpStatusCard
                isActive={displayData?.isPumpActive ?? false}
                size="lg"
                isLoading={isLoading}
                controlButton={
                  <ControlModal
                    trigger={
                      <Button size="sm">
                        Kontrol
                      </Button>
                    }
                    isPumpActive={displayData?.isPumpActive ?? false}
                    heater1Active={displayData?.isHeaterActive ?? false}
                    heater2Active={displayData?.isHeaterActive ?? false}
                    heater3Active={displayData?.isHeaterActive ?? false}
                    onUpdate={handleControlUpdate}
                  />
                }
              />
            </GridItem>

            <GridItem>
              <HeaterStatusCard
                isActive={displayData?.isHeaterActive ?? false}
                size="lg"
                isLoading={isLoading}
                activeCount={displayData?.isHeaterActive ? 3 : 0}
                totalCount={3}
                controlButton={
                  <ControlModal
                    trigger={
                      <Button size="sm">
                        Kontrol
                      </Button>
                    }
                    isPumpActive={displayData?.isPumpActive ?? false}
                    heater1Active={displayData?.isHeaterActive ?? false}
                    heater2Active={displayData?.isHeaterActive ?? false}
                    heater3Active={displayData?.isHeaterActive ?? false}
                    onUpdate={handleControlUpdate}
                  />
                }
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.WATER_TEMP_IN}
                value={displayData?.currentWaterTempIn.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                size="lg"
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.WATER_TEMP_OUT}
                value={displayData?.currentWaterTempOut.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
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
            ) : (
              <>
                {/* Temperature Chart */}
                <GridItem>
                  <Widget>
                    <TemperatureChart
                      data={displayData?.temperatureHistory ?? []}
                      height={300}
                    />
                  </Widget>
                </GridItem>

                {/* Energy Transfer Chart */}
                <GridItem>
                  <Widget>
                    <EnergyChart
                      data={displayData?.energyHistory ?? []}
                      height={300}
                    />
                  </Widget>
                </GridItem>

                {/* Flow Rate Chart */}
                <GridItem>
                  <Widget>
                    <FlowChart
                      data={displayData?.flowHistory ?? []}
                      height={300}
                    />
                  </Widget>
                </GridItem>

                {/* Efficiency Trend Chart */}
                <GridItem>
                  <Widget>
                    <EfficiencyChart
                      data={displayData?.energyHistory ?? []}
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
            ) : (
              <GridItem>
                <Widget>
                  <TemperatureVsPumpChart
                    temperatureData={displayData?.temperatureHistory ?? []}
                    pumpData={displayData?.pumpHistory ?? []}
                    height={300}
                  />
                </Widget>
              </GridItem>
            )}
          </Grid>

        </VStack>
      </Box>
    </Box>
  )
}
