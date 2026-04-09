import { Button, Input, VStack, Heading, Text, HStack } from "@chakra-ui/react"
import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "@tanstack/react-router"
import { setApiKey, clearApiKey } from "@/store/apiKeySlice"
import type { AppDispatch, RootState } from "@/store"

export function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)
  const navigate = useNavigate()
  const [input, setInput] = useState("")

  function handleApply() {
    const trimmed = input.trim()
    if (!trimmed) return
    dispatch(setApiKey(trimmed))
    setInput("")
  }

  function handleClear() {
    dispatch(clearApiKey())
  }

  return (
    <VStack p={8} align="start" gap={6} maxW="md">
      <Heading size="lg">Welcome</Heading>
      {apiKey ? (
        <>
          <Text>API key is set. Choose a view:</Text>
          <HStack>
            <Button onClick={() => navigate({ to: "/simpleView" })}>
              Simple View
            </Button>
            <Button onClick={() => navigate({ to: "/advancedView" })}>
              Advanced View
            </Button>
            <Button variant="outline" onClick={handleClear}>
              Clear Key
            </Button>
          </HStack>
        </>
      ) : (
        <>
          <Text>Enter your API key to access the dashboard.</Text>
          <HStack w="full">
            <Input
              placeholder="API key"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleApply()}
            />
            <Button onClick={handleApply}>Apply</Button>
          </HStack>
        </>
      )}
    </VStack>
  )
}
