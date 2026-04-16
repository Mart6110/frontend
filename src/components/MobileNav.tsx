import { Box, HStack } from "@chakra-ui/react"
import { Link as RouterLink, useRouterState } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Link } from "@/components/ui/link"
import { APP_TEXT } from "@/constants/text"

export function MobileNav() {
  const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)
  const router = useRouterState()
  const currentPath = router.location.pathname

  if (!apiKey) return null

  return (
    <Box
      display={{ base: "block", md: "none" }}
      position="fixed"
      bottom={0}
      left={0}
      right={0}
      bg="bg"
      borderTop="1px solid"
      borderColor="border"
      px={4}
      py={3}
      zIndex={100}
    >
      <HStack justify="space-around" w="full">
        <Link
          asChild
          fontWeight={currentPath === "/simpleView" ? "bold" : "normal"}
          colorPalette={currentPath === "/simpleView" ? "teal" : undefined}
        >
          <RouterLink to="/simpleView">{APP_TEXT.NAV.SIMPLE_VIEW.replace(" View", "")}</RouterLink>
        </Link>
        <Link
          asChild
          fontWeight={currentPath === "/advancedView" ? "bold" : "normal"}
          colorPalette={currentPath === "/advancedView" ? "teal" : undefined}
        >
          <RouterLink to="/advancedView">{APP_TEXT.NAV.ADVANCED_VIEW.replace(" View", "")}</RouterLink>
        </Link>
      </HStack>
    </Box>
  )
}
