import { Box, Spinner, Center } from "@chakra-ui/react"

export function KPICardSkeleton() {
  return (
    <Box
      borderWidth="1px"
      borderColor="rgba(0, 255, 170, 0.3)"
      borderRadius="12px"
      p={5}
      backdropFilter="blur(5px)"
      boxShadow="0 4px 20px rgba(0, 255, 170, 0.1)"
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      minH="100px"
    >
      <Center h="100%">
        <Spinner size="lg" color="teal.500" />
      </Center>
    </Box>
  )
}

export function PumpStatusCardSkeleton() {
  return (
    <Box
      borderWidth="1px"
      borderColor="rgba(117, 117, 117, 0.3)"
      borderRadius="12px"
      p={5}
      backdropFilter="blur(5px)"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      minH="100px"
    >
      <Center h="100%">
        <Spinner size="lg" color="teal.500" />
      </Center>
    </Box>
  )
}

export function HeaterStatusCardSkeleton() {
  return (
    <Box
      borderWidth="1px"
      borderColor="rgba(117, 117, 117, 0.3)"
      borderRadius="12px"
      p={5}
      backdropFilter="blur(5px)"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.1)"
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      minH="100px"
    >
      <Center h="100%">
        <Spinner size="lg" color="orange.500" />
      </Center>
    </Box>
  )
}

export function ChartSkeleton({ height = "300px" }: { height?: string }) {
  return (
    <Box
      borderWidth="1px"
      borderColor="rgba(0, 255, 170, 0.3)"
      borderRadius="12px"
      p={6}
      backdropFilter="blur(5px)"
      boxShadow="0 4px 20px rgba(0, 255, 170, 0.1)"
      css={{
        WebkitBackdropFilter: "blur(5px)"
      }}
      height={height}
    >
      <Center h="100%">
        <Spinner size="xl" color="teal.500" />
      </Center>
    </Box>
  )
}

export function TimelineSkeleton() {
  return (
    <Center minH="200px">
      <Spinner size="xl" color="teal.500" />
    </Center>
  )
}

