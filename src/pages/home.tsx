import { Heading, Text, VStack, Center, Box } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "@tanstack/react-router"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { setApiKey } from "@/store/apiKeySlice"
import { Button } from "@/components/ui/button"
import { FormikField } from "@/components/ui/formikField"
import type { AppDispatch, RootState } from "@/store"
import { APP_TEXT } from "@/constants/text"
import { validateKey } from "@/services/api"

const apiKeySchema = Yup.object().shape({
  apiKey: Yup.string()
    .required(APP_TEXT.VALIDATION.API_KEY.REQUIRED)
})

export function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (apiKey) {
      navigate({ to: "/simpleView" })
    }
  }, [apiKey, navigate])

  const handleSubmit = async (values: { apiKey: string }, { setSubmitting }: { setSubmitting: (isSubmitting: boolean) => void }) => {
    setError(null)
    
    try {
      const response = await validateKey(values.apiKey)
      
      if (response.valid) {
        dispatch(setApiKey(values.apiKey))
      } else {
        setError(response.error || APP_TEXT.HOME.ERROR.INVALID_KEY)
      }
    } catch (err) {
      // Handle network or server errors
      if (err instanceof Error) {
        if (err.message.includes("fetch") || err.message.includes("network")) {
          setError(APP_TEXT.HOME.ERROR.NETWORK_ERROR)
        } else if (err.message.includes("500") || err.message.includes("server")) {
          setError(APP_TEXT.HOME.ERROR.SERVER_ERROR)
        } else {
          setError(APP_TEXT.HOME.ERROR.UNKNOWN_ERROR)
        }
      } else {
        setError(APP_TEXT.HOME.ERROR.UNKNOWN_ERROR)
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Center flex="1" w="100%" px={{ base: 4, md: 0 }}>
      <VStack
        align="start"
        gap={6}
        maxW="md"
        w="full"
        px={{ base: 6, md: 8 }}
        py={{ base: 8, md: 10 }}
        mx={{ base: 0, md: 8 }}
        backdropFilter="blur(5px)"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="rgba(0, 255, 170, 0.3)"
        boxShadow="0 4px 30px rgba(0, 255, 170, 0.1)"
        css={{
          WebkitBackdropFilter: "blur(5px)"
        }}
      >
        <Heading size={{ base: "md", md: "lg" }}>{APP_TEXT.HOME.WELCOME_TITLE}</Heading>
        <Text fontSize={{ base: "sm", md: "md" }}>{APP_TEXT.HOME.WELCOME_MESSAGE}</Text>
        
        {error && (
          <Box
            w="full"
            p={3}
            borderRadius="md"
            bg="red.500/20"
            borderWidth="1px"
            borderColor="red.500"
          >
            <Text color="red.300" fontSize="sm">
              {error}
            </Text>
          </Box>
        )}
        
        <Formik
          initialValues={{ apiKey: "" }}
          validationSchema={apiKeySchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, isValid }) => (
            <Form style={{ width: "100%" }}>
              <VStack gap={4} w="full">
                <FormikField
                  name="apiKey"
                  placeholder={APP_TEXT.HOME.API_KEY_PLACEHOLDER}
                />
                <Button type="submit" disabled={isSubmitting || !isValid} w="full" loading={isSubmitting}>
                  {isSubmitting ? APP_TEXT.HOME.VALIDATING : APP_TEXT.HOME.SUBMIT_BUTTON}
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Center>
  )
}
