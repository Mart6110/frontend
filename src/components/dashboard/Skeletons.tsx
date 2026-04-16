import { Box, Flex, Skeleton, SkeletonText } from "@chakra-ui/react"

const skeletonColors = {
  "--start-color": "#D4A373",
  "--end-color": "#0d9488",
}

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
    >
      <Flex direction="column" gap={2}>
        <Skeleton variant="shine" height="20px" width="60%" css={skeletonColors} />
        <Skeleton variant="shine" height="32px" width="80%" mt={2} css={skeletonColors} />
      </Flex>
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
    >
      <Flex direction="column" gap={3}>
        <Flex justify="space-between" align="center">
          <Skeleton variant="shine" height="20px" width="100px" css={skeletonColors} />
          <Skeleton variant="shine" boxSize="12px" borderRadius="full" css={skeletonColors} />
        </Flex>
        <Skeleton variant="shine" height="32px" width="70%" css={skeletonColors} />
        <Skeleton variant="shine" height="16px" width="50%" css={skeletonColors} />
      </Flex>
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
    >
      <Flex direction="column" gap={4}>
        <Skeleton variant="shine" height="24px" width="200px" css={skeletonColors} />
        <Skeleton variant="shine" height={height} width="100%" css={skeletonColors} />
      </Flex>
    </Box>
  )
}

export function TimelineSkeleton() {
  return (
    <Flex direction="column" gap={3}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          borderWidth="1px"
          borderColor="rgba(0, 255, 170, 0.2)"
          borderRadius="8px"
          p={3}
        >
          <Flex direction="column" gap={2}>
            <Flex justify="space-between" align="center">
              <Skeleton variant="shine" height="16px" width="100px" css={skeletonColors} />
              <Skeleton variant="shine" height="20px" width="60px" borderRadius="full" css={skeletonColors} />
            </Flex>
            <SkeletonText variant="shine" noOfLines={2} spaceY={2} css={skeletonColors} />
          </Flex>
        </Box>
      ))}
    </Flex>
  )
}

