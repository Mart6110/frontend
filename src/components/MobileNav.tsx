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

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.currentTarget.blur()
  }

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
          textDecoration={currentPath === "/simpleView" ? "underline" : "none"}
          textUnderlineOffset={currentPath === "/simpleView" ? "4px" : undefined}
        >
          <RouterLink to="/simpleView" onClick={handleLinkClick}>{APP_TEXT.NAV.SIMPLE_VIEW.replace(" Dashboard", "")}</RouterLink>
        </Link>
        <Link
          asChild
          fontWeight={currentPath === "/advancedView" ? "bold" : "normal"}
          colorPalette={currentPath === "/advancedView" ? "teal" : undefined}
          textDecoration={currentPath === "/advancedView" ? "underline" : "none"}
          textUnderlineOffset={currentPath === "/advancedView" ? "4px" : undefined}
        >
          <RouterLink to="/advancedView" onClick={handleLinkClick}>{APP_TEXT.NAV.ADVANCED_VIEW.replace(" Dashboard", "")}</RouterLink>
        </Link>
      </HStack>
    </Box>
  )
}
