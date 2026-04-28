import { Flex, Button } from "@chakra-ui/react"
import type { ReactNode } from "react"
import { Drawer } from "@/components/ui/drawer"
import { EventTimeline } from "./EventTimeline"
import { LuHistory, LuDownload } from "react-icons/lu"
import type { DashboardEvent, DashboardData } from "@/services/dataTransform"
import { exportDashboardToExcel } from "@/utils/exportToExcel"

interface DashboardHeaderProps {
  children?: ReactNode
  events?: DashboardEvent[]
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
      gap={2}
      wrap="wrap"
      pb={2}
      borderBottomWidth="1px"
      borderColor="rgba(0, 255, 170, 0.2)"
    >
      {/* Left side controls */}
      {children}

      <Flex gap={2} ml={{ base: 0, lg: "auto" }} wrap="wrap">
        {/* Export Button */}
        {enableExport && !isLoading && dashboardData && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleExport}
            colorPalette="teal"
          >
            <LuDownload />
            Eksportér til Excel
          </Button>
        )}

        {/* System Events Drawer */}
        {!isLoading && events && (
          <Drawer
            placement="end"
            size={{ base: "full", md: "md" }}
            trigger={
              <Button variant="outline" size="sm">
                <LuHistory />
                Systemhændelser ({events.length})
              </Button>
            }
            title="Systemhændelser Tidslinje"
          >
            <EventTimeline events={events} maxEvents={maxEvents} />
          </Drawer>
        )}
      </Flex>
    </Flex>
  )
}
