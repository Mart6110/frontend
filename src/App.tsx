import { Outlet } from "@tanstack/react-router"
import { Box, Flex } from "@chakra-ui/react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MobileNav } from "@/components/MobileNav"

function App() {
  return (
    <Flex direction="column" h="100vh" overflow="hidden">
      <Navbar />
      <Box 
        as="main" 
        flex="1" 
        display="flex" 
        flexDirection="column"
        overflow="hidden"
        pb={{ base: "60px", md: 0 }}
      >
        <Outlet />
      </Box>
      <MobileNav />
      <Footer />
    </Flex>
  )
}

export default App
