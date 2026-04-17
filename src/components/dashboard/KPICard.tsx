import { Box, Flex, Text, Badge, Spinner } from "@chakra-ui/react"
import { ReactNode, memo } from "react"

interface KPICardProps {
  label: string
  value: string | number
  unit?: string
  icon?: ReactNode
  status?: 'success' | 'warning' | 'error' | 'info'
  size?: 'sm' | 'md' | 'lg'
  isLoading?: boolean
}

export const KPICard = memo(function KPICard({ label, value, unit, icon, status, size = 'md', isLoading = false }: KPICardProps) {
  const sizes = {
    sm: { value: 'xl', label: 'sm', padding: 4 },
    md: { value: '2xl', label: 'md', padding: 5 },
    lg: { value: '3xl', label: 'lg', padding: 6 },
  }

  const statusColors = {
    success: 'green',
    warning: 'orange',
    error: 'red',
    info: 'blue',
  }

  return (
    <Box
      borderWidth="1px"
      borderColor="rgba(0, 255, 170, 0.3)"
      borderRadius="12px"
      p={sizes[size].padding}
      backdropFilter="blur(5px)"
      boxShadow="0 4px 20px rgba(0, 255, 170, 0.1)"
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      transition="all 0.2s"
      _hover={{
        boxShadow: "0 6px 30px rgba(0, 255, 170, 0.15)",
        borderColor: "rgba(0, 255, 170, 0.5)",
      }}
    >
      <Flex direction="column" gap={2}>
        <Flex justify="space-between" align="center">
          <Text fontSize={sizes[size].label} color="gray.300">
            {label}
          </Text>
          {icon && <Box color="teal.400">{icon}</Box>}
        </Flex>
        
        <Flex align="baseline" gap={2}>
          {isLoading ? (
            <Spinner size="md" color="teal.500" />
          ) : (
            <>
              <Text fontSize={sizes[size].value} fontWeight="bold" color="fg">
                {value}
              </Text>
              {unit && (
                <Text fontSize="lg" color="gray.400">
                  {unit}
                </Text>
              )}
            </>
          )}
        </Flex>
        
        {status && (
          <Badge
            colorScheme={statusColors[status]}
            alignSelf="flex-start"
            px={2}
            py={1}
            borderRadius="full"
          >
            {status.toUpperCase()}
          </Badge>
        )}
      </Flex>
    </Box>
  )
})
