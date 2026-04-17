import { Flex, Box, Button } from "@chakra-ui/react"
import type { ReactNode } from "react"
import { Drawer } from "@/components/ui/drawer"
import { EventTimeline } from "./EventTimeline"
import { LuHistory } from "react-icons/lu"
import type { SystemEvent } from "@/services/mockData"

interface DashboardHeaderProps {
  children?: ReactNode
  events?: SystemEvent[]
  isLoading?: boolean
  maxEvents?: number
}

export function DashboardHeader({ 
  children = null, 
  events, 
  isLoading = false,
  maxEvents = 100 
}: DashboardHeaderProps) {
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

      {/* System Events Drawer */}
      {!isLoading && events && (
        <Box ml={{ base: 0, lg: "auto" }}>
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
        </Box>
      )}
    </Flex>
  )
}
