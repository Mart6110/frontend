import { Box, Flex, HStack, IconButton, Heading } from "@chakra-ui/react"
import { Link as RouterLink } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Link } from "@/components/ui/link"
import { Drawer } from "@/components/ui/drawer"
import { Settings } from "@/components/Settings"
import { ClearApiKeyDialog } from "@/components/ClearApiKeyDialog"
import { LuLogOut, LuSettings } from "react-icons/lu"
import { ColorModeButton } from "./ui/color-mode"

export function Navbar() {
    const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)

    return (
        <Box px={8} py={4} borderBottom="1px solid" borderColor="gray.200">
            <Flex justify="space-between" align="center">
                <Heading size="lg">Sandbatteri</Heading>
                {apiKey && (
                    <>
                        <HStack gap={4}>
                            <Link asChild>
                                <RouterLink to="/simpleView">Simple View</RouterLink>
                            </Link>
                            <Link asChild>
                                <RouterLink to="/advancedView">Advanced View</RouterLink>
                            </Link>
                        </HStack>
                        <HStack gap={4}>
                            <ColorModeButton />
                            <Drawer
                                trigger={
                                    <IconButton
                                        variant="ghost"
                                        aria-label="Settings"
                                        size="sm"
                                        colorPalette="teal"
                                    >
                                        <LuSettings />
                                    </IconButton>
                                }
                                title="Settings"
                                placement="end"
                                size="md"
                            >
                                <Settings />
                            </Drawer>
                            <ClearApiKeyDialog
                                trigger={
                                    <IconButton
                                        variant="ghost"
                                        aria-label="Clear API Key"
                                        size="sm"
                                        colorPalette="teal"
                                    >
                                        <LuLogOut />
                                    </IconButton>
                                }
                            />
                        </HStack>
                    </>
                )}
                {!apiKey && (
                    <ColorModeButton />
                )}
            </Flex>
        </Box>
    )
}


