import { Box, Text } from "@chakra-ui/react"
import { APP_TEXT } from "@/constants/text"

export function Footer() {
  return (
    <Box 
      as="footer" 
      px={{ base: 4, md: 8 }}
      py={{ base: 3, md: 4 }}
      borderTop="1px solid" 
      borderColor="gray.200"
      textAlign="center"
      display={{ base: "none", md: "block" }}
    >
      <Text fontSize="sm" color="gray.600">
        {APP_TEXT.FOOTER.COPYRIGHT(new Date().getFullYear())}
      </Text>
    </Box>
  )
}
