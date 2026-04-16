import { Heading, VStack, Grid, GridItem, Box, Flex } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import { mockDataService, type DashboardData } from "@/services/mockData"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { EventTimeline } from "@/components/dashboard/EventTimeline"
import { KPICardSkeleton, PumpStatusCardSkeleton, ChartSkeleton } from "@/components/dashboard/Skeletons"
import { Drawer } from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { LuHistory } from "react-icons/lu"

export function SimpleViewPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize with historical data
  useEffect(() => {
    // Simulate realistic loading time
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1000)) // 1 second delay
      const initialData = mockDataService.generateHistoricalData(6) // 6 hours
      setData(initialData)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Real-time updates every 15 seconds
  useEffect(() => {
    if (!data) return

    const interval = setInterval(() => {
      setData(prevData => {
        if (!prevData) return prevData
        return mockDataService.generateRealtimeUpdate(prevData)
      })
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [data])

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
          {isLoading || !data ? (
            <>
              <GridItem><KPICardSkeleton /></GridItem>
              <GridItem><KPICardSkeleton /></GridItem>
              <GridItem><KPICardSkeleton /></GridItem>
              <GridItem><KPICardSkeleton /></GridItem>
            </>
          ) : (
            <>
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.TEMPERATURE}
                  value={data.currentTemperature.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                  status="success"
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.POWER}
                  value={data.currentPower.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.POWER}
                  status={data.isPumpActive ? "success" : "info"}
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.EFFICIENCY}
                  value={data.currentEfficiency.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
                  status={data.currentEfficiency > 80 ? "success" : "warning"}
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.STATE_OF_CHARGE}
                  value={data.stateOfCharge.toFixed(0)}
                  unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
                  status="info"
                />
              </GridItem>
            </>
          )}
        </Grid>

        {/* Pump Status */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }}
          gap={4}
          w="full"
        >
          {isLoading || !data ? (
            <>
              <GridItem><PumpStatusCardSkeleton /></GridItem>
              <GridItem><KPICardSkeleton /></GridItem>
            </>
          ) : (
            <>
              <GridItem>
                <PumpStatusCard isActive={data.isPumpActive} />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.FLOW_RATE}
                  value={data.currentFlow.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.FLOW}
                  status="info"
                  size="lg"
                />
              </GridItem>
            </>
          )}
        </Grid>

        {/* Charts */}
        <Grid
          templateColumns={{ base: "1fr", lg: "1fr" }}
          gap={6}
          w="full"
        >
          {isLoading || !data ? (
            <>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
              <GridItem><ChartSkeleton height="300px" /></GridItem>
            </>
          ) : (
            <>
              <GridItem>
                <Box
                  borderWidth="1px"
                  borderColor="rgba(0, 255, 170, 0.3)"
                  borderRadius="12px"
                  p={{ base: 4, md: 6 }}
                  backdropFilter="blur(5px)"
                  boxShadow="0 4px 20px rgba(0, 255, 170, 0.1)"
                  css={{ WebkitBackdropFilter: "blur(5px)" }}
                >
                  <TemperatureChart 
                    data={data.temperatureHistory}
                    height={300}
                  />
                </Box>
              </GridItem>

              <GridItem>
                <Box
                  borderWidth="1px"
                  borderColor="rgba(0, 255, 170, 0.3)"
                  borderRadius="12px"
                  p={{ base: 4, md: 6 }}
                  backdropFilter="blur(5px)"
                  boxShadow="0 4px 20px rgba(0, 255, 170, 0.1)"
                  css={{ WebkitBackdropFilter: "blur(5px)" }}
                >
                  <EnergyChart 
                    data={data.energyHistory}
                    height={300}
                  />
                </Box>
              </GridItem>
            </>
          )}
        </Grid>
      </VStack>
    </Box>
  )
}
