import { Heading, VStack, Grid, GridItem, Box, Flex, Button, ButtonGroup } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import { mockDataService, type DashboardData } from "@/services/mockData"
import { KPICard } from "@/components/dashboard/KPICard"
import { PumpStatusCard } from "@/components/dashboard/PumpStatusCard"
import { TemperatureChart } from "@/components/dashboard/TemperatureChart"
import { EnergyChart } from "@/components/dashboard/EnergyChart"
import { FlowChart } from "@/components/dashboard/FlowChart"
import { EfficiencyChart } from "@/components/dashboard/EfficiencyChart"
import { TemperatureVsPumpChart } from "@/components/dashboard/TemperatureVsPumpChart"
import { EventTimeline } from "@/components/dashboard/EventTimeline"
import { KPICardSkeleton, PumpStatusCardSkeleton, ChartSkeleton } from "@/components/dashboard/Skeletons"
import { Drawer } from "@/components/ui/drawer"
import { LuHistory } from "react-icons/lu"

type TimeRange = 'ONE_HOUR' | 'SIX_HOURS' | 'TWELVE_HOURS' | 'ONE_DAY' | 'ONE_WEEK'

export function AdvancedViewPage() {
  const [allData, setAllData] = useState<DashboardData | null>(null)
  const [displayData, setDisplayData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [timeRange, setTimeRange] = useState<TimeRange>('SIX_HOURS')

  // Initialize with historical data
  useEffect(() => {
    // Simulate realistic loading time
    const loadData = async () => {
      setIsLoading(true)
      await new Promise(resolve => setTimeout(resolve, 1200)) // 1.2 second delay
      const initialData = mockDataService.generateHistoricalData(24) // 24 hours
      setAllData(initialData)
      setIsLoading(false)
    }
    
    loadData()
  }, [])

  // Update display data when time range changes
  useEffect(() => {
    if (!allData) return

    const rangeMap: Record<TimeRange, number> = {
      'ONE_HOUR': APP_CONFIG.DASHBOARD.TIME_RANGES.ONE_HOUR,
      'SIX_HOURS': APP_CONFIG.DASHBOARD.TIME_RANGES.SIX_HOURS,
      'TWELVE_HOURS': APP_CONFIG.DASHBOARD.TIME_RANGES.TWELVE_HOURS,
      'ONE_DAY': APP_CONFIG.DASHBOARD.TIME_RANGES.ONE_DAY,
      'ONE_WEEK': APP_CONFIG.DASHBOARD.TIME_RANGES.ONE_WEEK,
    }

    const filteredData = mockDataService.getDataForTimeRange(allData, rangeMap[timeRange])
    setDisplayData(filteredData)
  }, [allData, timeRange])

  // Real-time updates every 15 seconds
  useEffect(() => {
    if (!allData) return

    const interval = setInterval(() => {
      setAllData(prevData => {
        if (!prevData) return prevData
        return mockDataService.generateRealtimeUpdate(prevData)
      })
    }, APP_CONFIG.DASHBOARD.UPDATE_INTERVALS.REAL_TIME)

    return () => clearInterval(interval)
  }, [allData])

  return (
    <Box p={{ base: 4, md: 8 }}>
      <VStack align="start" gap={6} w="full">
        {/* Header with Time Range Selector */}
        <Flex 
          direction={{ base: "column", md: "row" }}
          justify="space-between" 
          align={{ base: "start", md: "center" }}
          w="full"
          gap={4}
        >
          <Heading size={{ base: "md", md: "lg" }}>{APP_TEXT.ADVANCED_VIEW.TITLE}</Heading>
          
          <Flex gap={3} direction={{ base: "column", sm: "row" }} w={{ base: "full", md: "auto" }}>
            {!isLoading && displayData && (
              <Drawer
                placement="end"
                size={{ base: "full", md: "md" }}
                trigger={
                  <Button variant="outline" size={{ base: "sm", md: "md" }}>
                    <LuHistory />
                    System Events ({displayData.events.length})
                  </Button>
                }
                title="System Event Timeline"
              >
                <EventTimeline events={displayData.events} maxEvents={100} />
              </Drawer>
            )}
            <ButtonGroup size={{ base: "sm", md: "md" }} attached variant="outline">
            <Button 
              onClick={() => setTimeRange('ONE_HOUR')}
              colorScheme={timeRange === 'ONE_HOUR' ? 'teal' : 'gray'}
              disabled={isLoading}
            >
              {APP_TEXT.DASHBOARD.TIME_RANGE.ONE_HOUR}
            </Button>
            <Button 
              onClick={() => setTimeRange('SIX_HOURS')}
              colorScheme={timeRange === 'SIX_HOURS' ? 'teal' : 'gray'}
              disabled={isLoading}
            >
              {APP_TEXT.DASHBOARD.TIME_RANGE.SIX_HOURS}
            </Button>
            <Button 
              onClick={() => setTimeRange('TWELVE_HOURS')}
              colorScheme={timeRange === 'TWELVE_HOURS' ? 'teal' : 'gray'}
              disabled={isLoading}
            >
              {APP_TEXT.DASHBOARD.TIME_RANGE.TWELVE_HOURS}
            </Button>
            <Button 
              onClick={() => setTimeRange('ONE_DAY')}
              colorScheme={timeRange === 'ONE_DAY' ? 'teal' : 'gray'}
              disabled={isLoading}
            >
              {APP_TEXT.DASHBOARD.TIME_RANGE.ONE_DAY}
            </Button>
          </ButtonGroup>
          </Flex>
        </Flex>
        
        {/* KPI Cards Grid */}
        <Grid
          templateColumns={{ base: "1fr", sm: "repeat(2, 1fr)", lg: "repeat(5, 1fr)" }}
          gap={4}
          w="full"
        >
          {isLoading || !displayData ? (
            <>
              <GridItem><KPICardSkeleton /></GridItem>
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
                  value={displayData.currentTemperature.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}
                  status="success"
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.POWER}
                  value={displayData.currentPower.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.POWER}
                  status={displayData.isPumpActive ? "success" : "info"}
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.EFFICIENCY}
                  value={displayData.currentEfficiency.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
                  status={displayData.currentEfficiency > 80 ? "success" : "warning"}
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.FLOW_RATE}
                  value={displayData.currentFlow.toFixed(1)}
                  unit={APP_TEXT.DASHBOARD.UNITS.FLOW}
                  status="info"
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.STATE_OF_CHARGE}
                  value={displayData.stateOfCharge.toFixed(0)}
                  unit={APP_TEXT.DASHBOARD.UNITS.EFFICIENCY}
                  status="info"
                />
              </GridItem>
            </>
          )}
        </Grid>

        {/* System Status and Energy KPIs */}
        <Grid
          templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
          gap={4}
          w="full"
        >
          {isLoading || !displayData ? (
            <>
              <GridItem><PumpStatusCardSkeleton /></GridItem>
              <GridItem><KPICardSkeleton /></GridItem>
              <GridItem><KPICardSkeleton /></GridItem>
            </>
          ) : (
            <>
              <GridItem>
                <PumpStatusCard isActive={displayData.isPumpActive} />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.ENERGY_IN}
                  value={displayData.currentEnergyIn.toFixed(2)}
                  unit={APP_TEXT.DASHBOARD.UNITS.ENERGY}
                  status="info"
                  size="lg"
                />
              </GridItem>
              
              <GridItem>
                <KPICard
                  label={APP_TEXT.DASHBOARD.KPI.ENERGY_OUT}
                  value={displayData.currentEnergyOut.toFixed(2)}
                  unit={APP_TEXT.DASHBOARD.UNITS.ENERGY}
                  status="success"
                  size="lg"
                />
              </GridItem>
            </>
          )}
        </Grid>

        {/* Main Charts Grid */}
        <Grid
          templateColumns={{ base: "1fr", lg: "repeat(2, 1fr)" }}
          gap={6}
          w="full"
        >
          {isLoading || !displayData ? (
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
                    data={displayData.temperatureHistory}
                    height={300}
                  />
                </Box>
              </GridItem>

              {/* Energy Transfer Chart */}
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
                    data={displayData.energyHistory}
                    height={300}
                  />
                </Box>
              </GridItem>

              {/* Flow Rate Chart */}
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
                  <FlowChart 
                    data={displayData.flowHistory}
                    height={300}
                  />
                </Box>
              </GridItem>

              {/* Efficiency Trend Chart */}
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
                  <EfficiencyChart 
                    data={displayData.energyHistory}
                    height={300}
                  />
                </Box>
              </GridItem>
            </>
          )}
        </Grid>

        {/* Correlation Chart - Temperature vs Pump */}
        <Grid templateColumns="1fr" w="full">
          {isLoading || !displayData ? (
            <GridItem><ChartSkeleton height="300px" /></GridItem>
          ) : (
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
                <TemperatureVsPumpChart 
                  temperatureData={displayData.temperatureHistory}
                  pumpData={displayData.pumpHistory}
                  height={300}
                />
              </Box>
            </GridItem>
          )}
        </Grid>

      </VStack>
    </Box>
  )
}
