import { Box, Flex, HStack, Link } from "@chakra-ui/react"
import { Link as RouterLink } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { ColorModeButton } from "@/components/ui/color-mode"

export function Navbar() {
  const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)

  return (
    <Box px={8} py={4} borderBottom="1px solid" borderColor="gray.200">
      <Flex justify="space-between" align="center">
        <HStack gap={6}>
          <Link asChild fontWeight="bold">
            <RouterLink to="/">Home</RouterLink>
          </Link>
          {apiKey && (
            <>
              <Link asChild>
                <RouterLink to="/simpleView">Simple View</RouterLink>
              </Link>
              <Link asChild>
                <RouterLink to="/advancedView">Advanced View</RouterLink>
              </Link>
            </>
          )}
        </HStack>
        <ColorModeButton />
      </Flex>
    </Box>
  )
}

