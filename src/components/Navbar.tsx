import { Box, Flex, HStack, IconButton } from "@chakra-ui/react"
import { Link as RouterLink } from "@tanstack/react-router"
import { useSelector } from "react-redux"
import type { RootState } from "@/store"
import { Link } from "@/components/ui/link"
import { Drawer } from "@/components/ui/drawer"
import { Settings } from "@/components/Settings"
import { ClearApiKeyDialog } from "@/components/ClearApiKeyDialog"
import { Logo } from "@/components/Logo"
import { LuLogOut, LuSettings } from "react-icons/lu"
import { ColorModeButton } from "./ui/color-mode"
import { APP_TEXT } from "@/constants/text"

export function Navbar() {
    const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        e.currentTarget.blur()
    }

    return (
        <Box px={{ base: 4, md: 8 }} py={4} borderBottom="1px solid" borderColor="gray.200">
            <Flex justify="space-between" align="center" gap={2}>
                <Logo size={{ base: "md", md: "lg" }} />
                {apiKey && (
                    <>
                        <HStack gap={{ base: 2, md: 4 }} display={{ base: "none", md: "flex" }}>
                            <Link asChild>
                                <RouterLink 
                                    to="/simpleView"
                                    onClick={handleLinkClick}
                                    activeProps={{
                                        style: {
                                            textDecoration: 'underline',
                                            textUnderlineOffset: '4px',
                                        }
                                    }}
                                >
                                    {APP_TEXT.NAV.SIMPLE_VIEW}
                                </RouterLink>
                            </Link>
                            <Link asChild>
                                <RouterLink 
                                    to="/advancedView"
                                    onClick={handleLinkClick}
                                    activeProps={{
                                        style: {
                                            textDecoration: 'underline',
                                            textUnderlineOffset: '4px',
                                        }
                                    }}
                                >
                                    {APP_TEXT.NAV.ADVANCED_VIEW}
                                </RouterLink>
                            </Link>
                        </HStack>
                        <HStack gap={{ base: 1, md: 4 }}>
                            <ColorModeButton />
                            <Drawer
                                trigger={
                                    <IconButton
                                        variant="ghost"
                                        aria-label={APP_TEXT.ARIA.SETTINGS_BUTTON}
                                        size="sm"
                                        colorPalette="teal"
                                    >
                                        <LuSettings />
                                    </IconButton>
                                }
                                title={APP_TEXT.NAV.SETTINGS}
                                placement="end"
                                size={{ base: "full", md: "md" }}
                            >
                                <Settings />
                            </Drawer>
                            <ClearApiKeyDialog
                                trigger={
                                    <IconButton
                                        variant="ghost"
                                        aria-label={APP_TEXT.ARIA.CLEAR_API_KEY_BUTTON}
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


