import { Outlet } from "@tanstack/react-router"
import { Box, Flex } from "@chakra-ui/react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { MobileNav } from "@/components/MobileNav"

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box 
        as="main" 
        flex="1" 
        display="flex" 
        flexDirection="column"
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
