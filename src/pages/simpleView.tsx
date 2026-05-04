import { VStack, Grid, GridItem, Box } from "@chakra-ui/react"
import { useEffect, useRef } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import * as dashboardService from "@/services/dashboardService"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { HeaterStatusCard } from "@/components/dashboard/HeaterStatusCard"
import { ControlModal } from "@/components/dashboard/ControlModal"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { ChartSkeleton } from "@/components/dashboard/Skeletons"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { RealtimeTimeSelector } from "@/components/dashboard/RealtimeHoursSelector"
import { IntervalSelector } from "@/components/dashboard/IntervalSelector"
import { Widget } from "@/components/ui/widget"
import { Button } from "@/components/ui/button"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import type { RealtimeTimeConfig } from "@/constants/timeRanges"
import { 
  setSimpleAllData,
  setSimpleData, 
  setSimpleIsLoading,
  setSimpleRealtimeConfig,
  setSimpleInterval
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
  const { allData, data, isLoading, realtimeConfig, interval } = useAppSelector((state) => state.dashboard.simple)
  
  // Track if this is a realtime update vs user-triggered filter change
  const isRealtimeUpdateRef = useRef(false)

  // Control handler for modal updates
  const handleControlUpdate = async () => {
    // Refetch full dashboard data after control action to update UI
    try {
      const to = new Date()
      const milliseconds = timeConfigToMilliseconds(realtimeConfig)
      const from = new Date(to.getTime() - milliseconds)
      const selectedInterval = interval === '' ? undefined : interval
      
      const updatedData = await dashboardService.fetchDashboardData({ from, to, interval: selectedInterval, useAbsoluteLatest: true })
      dispatch(setSimpleAllData(updatedData))
      dispatch(setSimpleData(updatedData))
    } catch (error) {
      console.error('Failed to refresh dashboard data:', error)
    }
  }

  // Initialize with historical data based on initial realtime config
  useEffect(() => {
    const loadData = async () => {
      dispatch(setSimpleIsLoading(true))
      try {
        const to = new Date()
        const milliseconds = timeConfigToMilliseconds(realtimeConfig)
        const from = new Date(to.getTime() - milliseconds)
        
        // Use selected interval or let backend auto-calculate (undefined)
        const selectedInterval = interval === '' ? undefined : interval
        
        const initialData = await dashboardService.fetchDashboardData({ from, to, interval: selectedInterval, useAbsoluteLatest: true })
        dispatch(setSimpleAllData(initialData))
        dispatch(setSimpleData(initialData))
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        dispatch(setSimpleIsLoading(false))
      }
    }
    
    loadData()
  }, [dispatch, realtimeConfig, interval])

  // Update display data when allData changes
  useEffect(() => {
    if (!allData) return

    // Data in allData is already filtered correctly by the rolling window logic
    // in updateDashboardWithLatest, so we just pass it through
    if (isRealtimeUpdateRef.current) {
      isRealtimeUpdateRef.current = false
    }
    
    dispatch(setSimpleData(allData))
  }, [allData, dispatch])

  // Real-time updates every 15 seconds
  useEffect(() => {
    if (!allData) return

    const interval = setInterval(async () => {
      try {
        const { data, energyData, controlStatus, events } = await dashboardService.fetchLatestData()
        isRealtimeUpdateRef.current = true
        // Pass time window in milliseconds to maintain rolling window
        const timeWindowMs = timeConfigToMilliseconds(realtimeConfig)
        const updatedData = dashboardService.updateDashboardWithLatest(allData, data, energyData, controlStatus, events, timeWindowMs)
        dispatch(setSimpleAllData(updatedData))
      } catch (error) {
        console.error('Failed to fetch latest data:', error)
      }
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [allData, dispatch, realtimeConfig])

  return (
    <Box display="flex" flexDirection="column" h="full">
      {/* Fixed Header with Controls */}
      <Box px={{ base: 4, md: 8 }} pt={{ base: 3}}>
        <DashboardHeader 
          events={data?.events}
          isLoading={isLoading}
          dashboardData={data ?? undefined}
          enableExport={true}
        >
          <RealtimeTimeSelector
            value={realtimeConfig}
            onChange={(config) => dispatch(setSimpleRealtimeConfig(config))}
            disabled={isLoading}
            size="sm"
          />
          <IntervalSelector
            value={interval}
            onChange={(value) => dispatch(setSimpleInterval(value))}
            disabled={isLoading}
            size="sm"
          />
        </DashboardHeader>
      </Box>
      
      {/* Scrollable Content */}
      <Box flex="1" overflowY="auto" px={{ base: 4, md: 8 }} py={4}>
        <VStack align="start" gap={4} w="-webkit-fill-available">
          {/* KPI Cards Grid */}
          <Grid
            templateColumns={{ base: "1fr", sm: "repeat(3, 1fr)", md: "repeat(3, 1fr)", lg: "repeat(3, 1fr)" }}
            gap={4}
            w="full"
          >
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.SAND_SIDE}
              value={data?.currentSandSide.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.SAND_CORE}
              value={data?.currentSandCore.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.WATER_TEMP_IN}
              value={data?.currentWaterTempIn.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.WATER_TEMP_OUT}
              value={data?.currentWaterTempOut.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.ENERGY}
              value={data?.currentEnergy.toFixed(2) ?? "0.00"}
              unit={APP_TEXT.DASHBOARD.UNITS.ENERGY}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.FLOW_RATE}
              value={data?.currentFlow.toFixed(1) ?? "0.0"}
              unit={APP_TEXT.DASHBOARD.UNITS.FLOW}
              isLoading={isLoading}
            />
          </GridItem>
        </Grid>

        {/* Pump & Heater Status */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)", lg: "repeat(3, 1fr)" }}
          gap={4}
          w="full"
        >
          <GridItem>
            <PumpStatusCard 
              isActive={data?.isPumpActive ?? false} 
              size="lg"
              isLoading={isLoading}
              controlButton={
                <ControlModal
                  trigger={
                    <Button size="sm">
                      Control
                    </Button>
                  }
                  isPumpActive={data?.isPumpActive ?? false}
                  heaters={data?.heaters?.map(h => ({ index: h.index, active: h.active })) ?? []}
                  onUpdate={handleControlUpdate}
                />
              }
            />
          </GridItem>
          
          <GridItem>
            <HeaterStatusCard
              isActive={data?.heaters?.some(h => h.active) ?? false}
              size="lg"
              isLoading={isLoading}
              activeCount={data?.heaters?.filter(h => h.active).length ?? 0}
              totalCount={data?.heaters?.length ?? 0}
              controlButton={
                <ControlModal
                  trigger={
                    <Button size="sm">
                      Kontrol
                    </Button>
                  }
                  isPumpActive={data?.isPumpActive ?? false}
                  heaters={data?.heaters?.map(h => ({ index: h.index, active: h.active })) ?? []}
                  onUpdate={handleControlUpdate}
                />
              }
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
          ) : (
            <>
              <GridItem>
                <Widget>
                  <TemperatureChart 
                    data={data?.temperatureHistory ?? []}
                    height={300}
                  />
                </Widget>
              </GridItem>

              <GridItem>
                <Widget>
                  <EnergyChart 
                    data={data?.energyHistory ?? []}
                    height={300}
                  />
                </Widget>
              </GridItem>
            </>
          )}
        </Grid>
      </VStack>
      </Box>
    </Box>
  )
}
