import { Heading, Text, VStack, Center } from "@chakra-ui/react"
import { useNavigate, useRouterState } from "@tanstack/react-router"
import { Button } from "@/components/ui/button"
import { APP_TEXT } from "@/constants/text"

interface ErrorPageProps {
  error?: Error
  statusCode?: number
}

export function ErrorPage({ error, statusCode = 404 }: ErrorPageProps) {
  const navigate = useNavigate()
  const routerState = useRouterState()

  const getErrorMessage = () => {
    if (statusCode === 404) {
      return {
        title: APP_TEXT.ERROR.NOT_FOUND_TITLE,
        message: APP_TEXT.ERROR.NOT_FOUND_MESSAGE,
      }
    }
    return {
      title: APP_TEXT.ERROR.GENERAL_TITLE,
      message: error?.message || APP_TEXT.ERROR.GENERAL_MESSAGE,
    }
  }

  const { title, message } = getErrorMessage()

  return (
    <Center flex="1" w="100%" px={{ base: 4, md: 0 }}>
      <VStack gap={6} maxW="md" textAlign="center">
        <Heading size="3xl" color="red.500">
          {statusCode}
        </Heading>
        <Heading size="xl">{title}</Heading>
        <Text color="gray.600" fontSize="lg">
          {message}
        </Text>
        {error && import.meta.env.DEV && (
          <VStack
            gap={2}
            p={4}
            bg="red.50"
            borderRadius="md"
            w="100%"
            textAlign="left"
          >
            <Text fontWeight="bold" color="red.700">
              {APP_TEXT.ERROR.DEBUG_INFO}
            </Text>
            <Text fontSize="sm" color="red.600" fontFamily="mono">
              {error.stack}
            </Text>
          </VStack>
        )}
        <VStack gap={3} w="100%">
          <Button
            onClick={() => navigate({ to: "/" })}
            size="lg"
            w="100%"
          >
            {APP_TEXT.ERROR.GO_HOME}
          </Button>
          {routerState.location.pathname !== "/" && (
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              w="100%"
            >
              {APP_TEXT.ERROR.GO_BACK}
            </Button>
          )}
        </VStack>
      </VStack>
    </Center>
  )
}
