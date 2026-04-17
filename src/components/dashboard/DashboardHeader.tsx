import { Flex, Button } from "@chakra-ui/react"
import type { ReactNode } from "react"
import { Drawer } from "@/components/ui/drawer"
import { EventTimeline } from "./EventTimeline"
import { LuHistory, LuDownload } from "react-icons/lu"
import type { SystemEvent, DashboardData } from "@/services/mockData"
import { exportDashboardToExcel } from "@/utils/exportToExcel"

interface DashboardHeaderProps {
  children?: ReactNode
  events?: SystemEvent[]
  isLoading?: boolean
  maxEvents?: number
  dashboardData?: DashboardData
  enableExport?: boolean
}

export function DashboardHeader({ 
  children = null, 
  events, 
  isLoading = false,
  maxEvents = 100,
  dashboardData,
  enableExport = false,
}: DashboardHeaderProps) {
  const handleExport = () => {
    if (!dashboardData) return
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `sand-battery-dashboard-${timestamp}`
    
    try {
      exportDashboardToExcel(dashboardData, filename)
    } catch (error) {
      console.error('Failed to export dashboard data:', error)
    }
  }

  return (
    <Flex 
      direction={{ base: "column", lg: "row" }}
      align={{ base: "start", lg: "center" }}
      w="-webkit-fill-available"
      gap={3}
      wrap="wrap"
      position="sticky"
      top={0}
      zIndex={10}
      bg="bg"
      py={3}
      borderBottomWidth="1px"
      borderColor="rgba(0, 255, 170, 0.2)"
      mx={-4}
      px={4}
      mt={-4}
    >
      {/* Left side controls */}
      {children}

      <Flex gap={3} ml={{ base: 0, lg: "auto" }} wrap="wrap">
        {/* Export Button */}
        {enableExport && !isLoading && dashboardData && (
          <Button 
            variant="outline" 
            size={{ base: "sm", md: "md" }}
            onClick={handleExport}
            colorPalette="teal"
          >
            <LuDownload />
            Export to Excel
          </Button>
        )}

        {/* System Events Drawer */}
        {!isLoading && events && (
          <Drawer
            placement="end"
            size={{ base: "full", md: "md" }}
            trigger={
              <Button variant="outline" size={{ base: "sm", md: "md" }}>
                <LuHistory />
                System Events ({events.length})
              </Button>
            }
            title="System Event Timeline"
          >
            <EventTimeline events={events} maxEvents={maxEvents} />
          </Drawer>
        )}
      </Flex>
    </Flex>
  )
}
