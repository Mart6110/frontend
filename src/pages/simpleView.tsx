import { Heading, VStack, Grid, GridItem, Box, Flex } from "@chakra-ui/react"
import { useEffect } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import { mockDataService } from "@/services/mockData"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { EventTimeline } from "@/components/dashboard/EventTimeline"
import { ChartSkeleton } from "@/components/dashboard/Skeletons"
import { Drawer } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { Widget } from "@/components/ui/widget"
import { LuHistory } from "react-icons/lu"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { setSimpleData, setSimpleIsLoading } from "@/store/dashboardSlice"

export function SimpleViewPage() {
  const dispatch = useAppDispatch()
  const { data, isLoading } = useAppSelector((state) => state.dashboard.simple)

  // Initialize with historical data
  useEffect(() => {
    // Simulate realistic loading time
    const loadData = async () => {
      dispatch(setSimpleIsLoading(true))
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
      const initialData = mockDataService.generateHistoricalData(6) // 6 hours
      dispatch(setSimpleData(initialData))
      dispatch(setSimpleIsLoading(false))
    }
    
    loadData()
  }, [dispatch])

  // Real-time updates every 15 seconds
  useEffect(() => {
    if (!data) return

    const interval = setInterval(() => {
      const updatedData = mockDataService.generateRealtimeUpdate(data)
      dispatch(setSimpleData(updatedData))
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [data, dispatch])

  return (
    <Box p={{ base: 4, md: 8 }}>
      <VStack align="start" gap={6} w="full">
        {/* Header */}
        <Flex 
          direction={{ base: "column", sm: "row" }}
          justify="space-between" 
          align={{ base: "start", sm: "center" }}
          w="full"
          gap={4}
        >
          <Heading size={{ base: "md", md: "lg" }}>{APP_TEXT.SIMPLE_VIEW.TITLE}</Heading>
          {!isLoading && data && (
            <Drawer
              placement="end"
              size={{ base: "full", md: "md" }}
              trigger={
                <Button variant="outline" size={{ base: "sm", md: "md" }}>
                  <LuHistory />
                  System Events ({data.events.length})
                </Button>
              }
              title="System Event Timeline"
            >
              <EventTimeline events={data.events} maxEvents={50} />
            </Drawer>
          )}
        </Flex>
        
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
              status="success"
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
              status={data && data.currentEfficiency > 80 ? "success" : "warning"}
              isLoading={isLoading}
            />
          </GridItem>
          
          <GridItem>
            <KPICard
              label={APP_TEXT.DASHBOARD.KPI.STATE_OF_CHARGE}
              value={data?.stateOfCharge.toFixed(0) ?? "0"}
              unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
              status="info"
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
              status="info"
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
