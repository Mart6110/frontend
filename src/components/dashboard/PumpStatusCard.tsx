import { Box, Flex, Text, Badge } from "@chakra-ui/react"
import { APP_TEXT } from "@/constants/text"

interface PumpStatusCardProps {
  isActive: boolean
  lastChanged?: number
}

export function PumpStatusCard({ isActive, lastChanged }: PumpStatusCardProps) {
  const formatLastChanged = (timestamp: number) => {
    const seconds = Math.floor((Date.now() - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={isActive ? "rgba(0, 255, 170, 0.5)" : "rgba(117, 117, 117, 0.3)"}
      borderRadius="12px"
      p={5}
      backdropFilter="blur(5px)"
      boxShadow={isActive ? "0 4px 20px rgba(0, 255, 170, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.1)"}
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      transition="all 0.3s"
    >
      <Flex direction="column" gap={3}>
        <Flex justify="space-between" align="center">
          <Text fontSize="md" color="gray.400">
            {APP_TEXT.DASHBOARD.KPI.PUMP_STATUS}
          </Text>
          <Box
            w="12px"
            h="12px"
            borderRadius="full"
            bg={isActive ? "green.400" : "gray.600"}
            boxShadow={isActive ? "0 0 10px rgba(34, 197, 94, 0.5)" : "none"}
            animation={isActive ? "pulse 2s infinite" : "none"}
          />
        </Flex>
        
        <Text fontSize="2xl" fontWeight="bold" color={isActive ? "green.400" : "gray.500"}>
          {isActive ? APP_TEXT.DASHBOARD.STATUS.PUMP_ON : APP_TEXT.DASHBOARD.STATUS.PUMP_OFF}
        </Text>
        
        <Flex gap={2}>
          <Badge
            colorScheme={isActive ? "green" : "gray"}
            px={2}
            py={1}
            borderRadius="full"
          >
            {isActive ? APP_TEXT.DASHBOARD.STATUS.SYSTEM_ACTIVE : APP_TEXT.DASHBOARD.STATUS.SYSTEM_IDLE}
          </Badge>
          
          {lastChanged && (
            <Text fontSize="sm" color="gray.500">
              {formatLastChanged(lastChanged)}
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  )
}
