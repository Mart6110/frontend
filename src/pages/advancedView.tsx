import { VStack, Grid, GridItem, Box } from "@chakra-ui/react"
import { useEffect, useRef, useMemo } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import * as dashboardService from "@/services/dashboardService"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { HeaterStatusCard } from "@/components/dashboard/HeaterStatusCard"
import { ControlModal } from "@/components/dashboard/ControlModal"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { FlowChart } from "@/components/dashboard/FlowChart"
import { ElectricityPriceChart } from "@/components/dashboard/ElectricityPriceChart"
import { TemperatureVsPumpChart } from "@/components/dashboard/TemperatureVsPumpChart"
import { ChartSkeleton } from "@/components/dashboard/Skeletons"
import { ViewModeToggle } from "@/components/dashboard/ViewModeToggle"
import { RealtimeTimeSelector } from "@/components/dashboard/RealtimeHoursSelector"
import { DateRangeSelector } from "@/components/dashboard/DateRangeSelector"
import { IntervalSelector } from "@/components/dashboard/IntervalSelector"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { Widget } from "@/components/ui/widget"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { api } from "@/store/apiSlice"
import type { RealtimeTimeConfig } from "@/constants/timeRanges"
import {
  setAllData,
  setDisplayData,
  setIsLoading,
  setViewMode,
  setRealtimeConfig,
  setStartDate,
  setEndDate,
  setInterval as setDataInterval,
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
    interval,
    startDate: startDateISO,
    endDate: endDateISO,
  } = useAppSelector((state) => state.dashboard.advanced)

  // Fetch electricity price data for today
  const today = new Date().toISOString().split('T')[0]
  const { data: electricityPriceData } = api.useGetElectricityPriceQuery({ date: today, area: 'DK2' })

  // Track if this is a realtime update vs user-triggered filter change
  const isRealtimeUpdateRef = useRef(false)

  // Control handler for modal updates
  const handleControlUpdate = async () => {
    // Refetch full dashboard data after control action to update UI
    try {
      dispatch(setIsLoading(true))
      
      if (viewMode === 'realtime') {
        const to = new Date()
        const milliseconds = timeConfigToMilliseconds(realtimeConfig)
        const from = new Date(to.getTime() - milliseconds)
        const selectedInterval = interval === '' ? undefined : interval
        
        const updatedData = await dashboardService.fetchDashboardData({ from, to, interval: selectedInterval })
        dispatch(setAllData(updatedData))
        dispatch(setDisplayData(updatedData))
      } else {
        // Date range mode
        if (startDate && endDate) {
          const selectedInterval = interval === '' ? undefined : interval
          const updatedData = await dashboardService.fetchDashboardData({ 
            from: startDate, 
            to: endDate,
            interval: selectedInterval 
          })
          dispatch(setAllData(updatedData))
          dispatch(setDisplayData(updatedData))
        }
      }
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error)
    } finally {
      dispatch(setIsLoading(false))
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

  // Fetch data based on view mode and parameters
  useEffect(() => {
    const loadData = async () => {
      dispatch(setIsLoading(true))
      try {
        let from: Date
        let to: Date

        if (viewMode === 'realtime') {
          // Fetch data based on realtime config
          to = new Date()
          const milliseconds = timeConfigToMilliseconds(realtimeConfig)
          from = new Date(to.getTime() - milliseconds)
        } else {
          // Fetch data based on date range
          if (!startDate || !endDate) {
            dispatch(setIsLoading(false))
            return
          }
          from = startDate
          to = endDate
        }

        // Use selected interval or let backend auto-calculate (undefined)
        const selectedInterval = interval === '' ? undefined : interval

        const fetchedData = await dashboardService.fetchDashboardData({ from, to, interval: selectedInterval })
        dispatch(setAllData(fetchedData))
        dispatch(setDisplayData(fetchedData))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        dispatch(setIsLoading(false))
      }
    }

    loadData()
  }, [dispatch, viewMode, realtimeConfig, interval, startDate, endDate])

  // Update display data when realtime updates come in
  useEffect(() => {
    if (!allData) return

    // Only update display if this is a realtime update
    if (isRealtimeUpdateRef.current && viewMode === 'realtime') {
      isRealtimeUpdateRef.current = false
      dispatch(setDisplayData(allData))
    }
  }, [allData, viewMode, dispatch])

  // Real-time updates every 30 seconds
  useEffect(() => {
    if (!allData) return

    const updateInterval = setInterval(async () => {
      try {
        const { data, energyData, controlStatus, events } = await dashboardService.fetchLatestData()
        isRealtimeUpdateRef.current = true
        const updatedData = dashboardService.updateDashboardWithLatest(allData, data, energyData, controlStatus, events)
        dispatch(setAllData(updatedData))
      } catch (error) {
        console.error('Failed to fetch latest data:', error)
      }
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(updateInterval)
  }, [allData, dispatch])

  return (
    <Box display="flex" flexDirection="column" h="full">
      {/* Fixed Header with Controls */}
      <Box px={{ base: 4, md: 8 }} pt={{ base: 3 }}>
        <DashboardHeader
          events={displayData?.events}
          isLoading={isLoading}
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

          <IntervalSelector
            value={interval}
            onChange={(value) => dispatch(setDataInterval(value))}
            disabled={isLoading || isFiltering}
            size="sm"
          />
        </DashboardHeader>
      </Box>

      {/* Scrollable Content */}
      <Box flex="1" overflowY="auto" px={{ base: 4, md: 8 }} py={4}>
        <VStack align="start" gap={4} w="-webkit-fill-available">
          {/* KPI Cards Grid */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(4, 1fr)", md: "repeat(4, 1fr)", lg: "repeat(4, 1fr)" }}
            gap={4}
            w="full"
          >
            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.SAND_SIDE}
                value={displayData?.currentSandSide.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.SAND_CORE}
                value={displayData?.currentSandCore.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.WATER_TEMP_IN}
                value={displayData?.currentWaterTempIn.toFixed(1) ?? "0.0"}
                unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                isLoading={isLoading}
              />
            </GridItem>

            <GridItem>
              <KPICard
                label={APP_TEXT.DASHBOARD.KPI.WATER_TEMP_OUT}
                value={displayData?.currentWaterTempOut.toFixed(1) ?? "0.0"}
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

          {/* System Status */}
          <Grid
            templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
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
                    heaters={displayData?.heaters?.map(h => ({ index: h.index, active: h.active })) ?? []}
                    onUpdate={handleControlUpdate}
                  />
                }
              />
            </GridItem>

            <GridItem>
              <HeaterStatusCard
                isActive={displayData?.heaters?.some(h => h.active) ?? false}
                size="lg"
                isLoading={isLoading}
                activeCount={displayData?.heaters?.filter(h => h.active).length ?? 0}
                totalCount={displayData?.heaters?.length ?? 0}
                controlButton={
                  <ControlModal
                    trigger={
                      <Button size="sm">
                        Kontrol
                      </Button>
                    }
                    isPumpActive={displayData?.isPumpActive ?? false}
                    heaters={displayData?.heaters?.map(h => ({ index: h.index, active: h.active })) ?? []}
                    onUpdate={handleControlUpdate}
                  />
                }
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

                {/* Electricity Price Chart */}
                <GridItem>
                  <Widget>
                    <ElectricityPriceChart
                      data={electricityPriceData?.prices ?? []}
                      height={300}
                      area={electricityPriceData?.area}
                      date={electricityPriceData?.date}
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
