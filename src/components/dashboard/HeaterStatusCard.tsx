import { Box, Flex, Text, Spinner } from "@chakra-ui/react"
import { APP_TEXT } from "@/constants/text"
import { memo, useState, useEffect } from "react"

interface HeaterStatusCardProps {
  isActive: boolean
  lastChanged?: number
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  controlButton?: React.ReactNode
  activeCount?: number
  totalCount?: number
}

export const HeaterStatusCard = memo(function HeaterStatusCard({ 
  isActive, 
  lastChanged, 
  size = 'md', 
  isLoading = false,
  controlButton,
  activeCount,
  totalCount = 3
}: HeaterStatusCardProps) {
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
    sm: { value: 'xl', label: 'sm', padding: 4, minHeight: '110px' },
    md: { value: '2xl', label: 'md', padding: 5, minHeight: '130px' },
    lg: { value: '3xl', label: 'lg', padding: 6, minHeight: '150px' },
  }

  return (
    <Box
      borderWidth="1px"
      borderColor={isActive ? "rgba(0, 255, 170, 0.5)" : "rgba(117, 117, 117, 0.3)"}
      borderRadius="12px"
      p={sizes[size].padding}
      minH={sizes[size].minHeight}
      backdropFilter="blur(5px)"
      boxShadow={isActive ? "0 4px 20px rgba(0, 255, 170, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.1)"}
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      transition="all 0.3s"
    >
      <Flex direction="column" gap={1}>
        <Flex justify="space-between" align="center">
          <Text fontSize={sizes[size].label} color="gray.300">
            {APP_TEXT.DASHBOARD.KPI.HEATER_STATUS}
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
        
        <Flex align="center" justify="space-between" gap={2}>
          {isLoading ? (
            <Spinner size="md" color="teal.500" />
          ) : (
            <Flex align="baseline" gap={2}>
              <Text fontSize={sizes[size].value} fontWeight="bold" color={isActive ? "green.400" : "gray.400"}>
                {isActive ? APP_TEXT.DASHBOARD.STATUS.HEATER_ON : APP_TEXT.DASHBOARD.STATUS.HEATER_OFF}
              </Text>
              {activeCount !== undefined && (
                <Text fontSize="md" color="gray.400">
                  ({activeCount}/{totalCount})
                </Text>
              )}
            </Flex>
          )}
          {controlButton}
        </Flex>
        
        {lastChanged && (
          <Text fontSize="sm" color="gray.400">
            {formatLastChanged(lastChanged)}
          </Text>
        )}
      </Flex>
    </Box>
  )
})
