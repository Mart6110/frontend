import { Outlet } from "@tanstack/react-router"
import { Box, Flex } from "@chakra-ui/react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <Flex direction="column" minH="100vh">
      <Navbar />
      <Box as="main" flex="1">
        <Outlet />
      </Box>
      <Footer />
    </Flex>
  )
}

export default App
