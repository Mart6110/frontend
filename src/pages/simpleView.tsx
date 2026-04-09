import { Heading, Text, VStack } from "@chakra-ui/react"

export function SimpleViewPage() {
  return (
    <VStack p={8} align="start" gap={4}>
      <Heading size="lg">Simple View</Heading>
      <Text>Dashboard simple view content goes here.</Text>
    </VStack>
  )
}
