import { Box, Flex, Text, Badge, Spinner } from "@chakra-ui/react"
import { APP_TEXT } from "@/constants/text"
import { memo, useState, useEffect } from "react"

interface PumpStatusCardProps {
  isActive: boolean
  lastChanged?: number
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const PumpStatusCard = memo(function PumpStatusCard({ isActive, lastChanged, size = 'md', isLoading = false }: PumpStatusCardProps) {
  const [now, setNow] = useState(() => Date.now())
  
  useEffect(() => {
    const interval = setInterval(() => setNow(Date.now()), 1000)
    return () => clearInterval(interval)
  }, [])
  
  const formatLastChanged = (timestamp: number) => {
    const seconds = Math.floor((now - timestamp) / 1000)
    if (seconds < 60) return `${seconds}s ago`
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    return `${hours}h ago`
  }

  const sizes = {
    sm: { value: 'xl', label: 'sm', padding: 4 },
    md: { value: '2xl', label: 'md', padding: 5 },
    lg: { value: '3xl', label: 'lg', padding: 6 },
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={isActive ? "rgba(0, 255, 170, 0.5)" : "rgba(117, 117, 117, 0.3)"}
      borderRadius="12px"
      p={sizes[size].padding}
      backdropFilter="blur(5px)"
      boxShadow={isActive ? "0 4px 20px rgba(0, 255, 170, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.1)"}
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      transition="all 0.3s"
    >
      <Flex direction="column" gap={2}>
        <Flex justify="space-between" align="center">
          <Text fontSize={sizes[size].label} color="gray.300">
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
        
        {isLoading ? (
          <Spinner size="md" color="teal.500" />
        ) : (
          <Text fontSize={sizes[size].value} fontWeight="bold" color={isActive ? "green.400" : "gray.400"}>
            {isActive ? APP_TEXT.DASHBOARD.STATUS.PUMP_ON : APP_TEXT.DASHBOARD.STATUS.PUMP_OFF}
          </Text>
        )}
        
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
            <Text fontSize="sm" color="gray.400">
              {formatLastChanged(lastChanged)}
            </Text>
          )}
        </Flex>
      </Flex>
    </Box>
  )
})
