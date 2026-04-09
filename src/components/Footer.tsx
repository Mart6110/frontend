import { Box, Text } from "@chakra-ui/react"

export function Footer() {
  return (
    <Box 
      as="footer" 
      px={8} 
      py={4} 
      borderTop="1px solid" 
      borderColor="gray.200"
      textAlign="center"
    >
      <Text fontSize="sm" color="gray.600">
        © {new Date().getFullYear()} Sandbatteri
      </Text>
    </Box>
  )
}
