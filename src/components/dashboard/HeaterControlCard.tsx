import { Box, Flex, Text, Badge, Spinner, IconButton, Grid } from "@chakra-ui/react"
import { APP_TEXT } from "@/constants/text"
import { memo, useState } from "react"

interface HeaterControlCardProps {
  heater1Active: boolean
  heater2Active: boolean
  heater3Active: boolean
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
  onToggleHeater1?: () => Promise<void>
  onToggleHeater2?: () => Promise<void>
  onToggleHeater3?: () => Promise<void>
  canControl?: boolean
}

export const HeaterControlCard = memo(function HeaterControlCard({ 
  heater1Active,
  heater2Active,
  heater3Active,
  size = 'md', 
  isLoading = false,
  onToggleHeater1,
  onToggleHeater2,
  onToggleHeater3,
  canControl = false 
}: HeaterControlCardProps) {
  const [isToggling1, setIsToggling1] = useState(false)
  const [isToggling2, setIsToggling2] = useState(false)
  const [isToggling3, setIsToggling3] = useState(false)

  const handleToggle1 = async () => {
    if (!onToggleHeater1 || isToggling1) return
    setIsToggling1(true)
    try {
      await onToggleHeater1()
    } finally {
      setIsToggling1(false)
    }
  }

  const handleToggle2 = async () => {
    if (!onToggleHeater2 || isToggling2) return
    setIsToggling2(true)
    try {
      await onToggleHeater2()
    } finally {
      setIsToggling2(false)
    }
  }

  const handleToggle3 = async () => {
    if (!onToggleHeater3 || isToggling3) return
    setIsToggling3(true)
    try {
      await onToggleHeater3()
    } finally {
      setIsToggling3(false)
    }
  }

  const activeCount = [heater1Active, heater2Active, heater3Active].filter(Boolean).length
  const anyActive = activeCount > 0

  const sizes = {
    sm: { label: 'sm', padding: 4, button: 'xs' as const, badge: 'sm' as const },
    md: { label: 'md', padding: 5, button: 'sm' as const, badge: 'md' as const },
    lg: { label: 'lg', padding: 6, button: 'md' as const, badge: 'lg' as const },
  }

  const HeaterPart = ({ 
    label, 
    isActive, 
    onToggle, 
    isToggling 
  }: { 
    label: string
    isActive: boolean
    onToggle?: () => void
    isToggling: boolean
  }) => (
    <Box
      borderWidth="1px"
      borderColor={isActive ? "rgba(255, 100, 0, 0.5)" : "rgba(117, 117, 117, 0.3)"}
      borderRadius="8px"
      p={3}
      bg={isActive ? "rgba(255, 100, 0, 0.1)" : "transparent"}
      transition="all 0.3s"
    >
      <Flex direction="column" gap={2} align="center">
        <Flex align="center" gap={2} w="full" justify="space-between">
          <Text fontSize="sm" color="gray.300" fontWeight="medium">
            {label}
          </Text>
          <Box
            w="8px"
            h="8px"
            borderRadius="full"
            bg={isActive ? "orange.400" : "gray.600"}
            boxShadow={isActive ? "0 0 8px rgba(251, 146, 60, 0.5)" : "none"}
            animation={isActive ? "pulse 2s infinite" : "none"}
          />
        </Flex>
        
        <Badge
          colorScheme={isActive ? "orange" : "gray"}
          size={sizes[size].badge}
          px={2}
          py={1}
          w="full"
          textAlign="center"
        >
          {isActive ? "On" : "Off"}
        </Badge>
        
        {canControl && onToggle && (
          <IconButton
            aria-label={isActive ? `Turn off ${label}` : `Turn on ${label}`}
            size={sizes[size].button}
            colorPalette={isActive ? "red" : "orange"}
            variant="solid"
            onClick={onToggle}
            loading={isToggling}
            disabled={isLoading}
            w="full"
          >
            {isActive ? "OFF" : "ON"}
          </IconButton>
        )}
      </Flex>
    </Box>
  )

  return (
    <Box
      borderWidth="1px"
      borderColor={anyActive ? "rgba(255, 100, 0, 0.5)" : "rgba(117, 117, 117, 0.3)"}
      borderRadius="12px"
      p={sizes[size].padding}
      backdropFilter="blur(5px)"
      boxShadow={anyActive ? "0 4px 20px rgba(255, 100, 0, 0.2)" : "0 4px 20px rgba(0, 0, 0, 0.1)"}
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      transition="all 0.3s"
    >
      <Flex direction="column" gap={3}>
        <Flex justify="space-between" align="center">
          <Text fontSize={sizes[size].label} color="gray.300">
            {APP_TEXT.DASHBOARD.KPI.HEATER_STATUS}
          </Text>
          <Badge
            colorScheme={anyActive ? "orange" : "gray"}
            px={3}
            py={1}
            borderRadius="full"
          >
            {activeCount}/3 Active
          </Badge>
        </Flex>
        
        {isLoading ? (
          <Flex justify="center" py={4}>
            <Spinner size="lg" color="orange.500" />
          </Flex>
        ) : (
          <Grid templateColumns="repeat(3, 1fr)" gap={3}>
            <HeaterPart 
              label="Heater 1" 
              isActive={heater1Active} 
              onToggle={handleToggle1}
              isToggling={isToggling1}
            />
            <HeaterPart 
              label="Heater 2" 
              isActive={heater2Active} 
              onToggle={handleToggle2}
              isToggling={isToggling2}
            />
            <HeaterPart 
              label="Heater 3" 
              isActive={heater3Active} 
              onToggle={handleToggle3}
              isToggling={isToggling3}
            />
          </Grid>
        )}
      </Flex>
    </Box>
  )
})
