import { Box, Flex, Text } from "@chakra-ui/react"
import { useState } from "react"
import type { ReactNode } from "react"
import { ChartViewToggle } from "./ChartViewToggle"
import type { ChartViewMode } from "./ChartViewToggle"
import type { Column } from "./DataTable"

interface ChartWithTableWrapperProps {
  chartComponent: ReactNode
  tableComponent: ReactNode
  title?: string
  defaultView?: ChartViewMode
  showToggle?: boolean
}

export function ChartWithTableWrapper({ 
  chartComponent, 
  tableComponent, 
  title,
  defaultView = 'graph',
  showToggle = true 
}: ChartWithTableWrapperProps) {
  const [viewMode, setViewMode] = useState<ChartViewMode>(defaultView)

  return (
    <Box>
      {(title || showToggle) && (
        <Flex justify="space-between" align="center" mb={3}>
          {title && (
            <Text fontSize="lg" fontWeight="semibold">
              {title}
            </Text>
          )}
          {showToggle && (
            <ChartViewToggle value={viewMode} onChange={setViewMode} />
          )}
        </Flex>
      )}
      {viewMode === 'graph' ? chartComponent : tableComponent}
    </Box>
  )
}

// Re-export for convenience
export type { Column, ChartViewMode }
export { ChartViewToggle }
