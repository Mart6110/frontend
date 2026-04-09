import { Outlet } from "@tanstack/react-router"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

function App() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  )
}

export default App
