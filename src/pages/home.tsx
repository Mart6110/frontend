import { Heading, Text, VStack, Center } from "@chakra-ui/react"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "@tanstack/react-router"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { setApiKey } from "@/store/apiKeySlice"
import { Button } from "@/components/ui/button"
import { FormikField } from "@/components/ui/formikField"
import type { AppDispatch, RootState } from "@/store"

const apiKeySchema = Yup.object().shape({
  apiKey: Yup.string()
    .required("API key is required")
    .min(10, "API key must be at least 10 characters"),
})

export function HomePage() {
  const dispatch = useDispatch<AppDispatch>()
  const apiKey = useSelector((state: RootState) => state.apiKey.apiKey)
  const navigate = useNavigate()

  useEffect(() => {
    if (apiKey) {
      navigate({ to: "/simpleView" })
    }
  }, [apiKey, navigate])

  return (
    <Center flex="1" w="100%">
      <VStack
        align="start"
        gap={6}
        maxW="md"
        w="full"
        px={8}
        py={10}
        mx={8}
        backdropFilter="blur(5px)"
        borderRadius="16px"
        borderWidth="1px"
        borderColor="rgba(0, 255, 170, 0.3)"
        boxShadow="0 4px 30px rgba(0, 255, 170, 0.1)"
        css={{
          WebkitBackdropFilter: "blur(5px)"
        }}
      >
        <Heading size="lg">Welcome</Heading>
        <Text>Enter your API key to access the dashboard.</Text>
        <Formik
          initialValues={{ apiKey: "" }}
          validationSchema={apiKeySchema}
          onSubmit={(values, { resetForm }) => {
            dispatch(setApiKey(values.apiKey))
            resetForm()
          }}
        >
          {({ isSubmitting, isValid }) => (
            <Form style={{ width: "100%" }}>
              <VStack gap={4} w="full">
                <FormikField
                  name="apiKey"
                  placeholder="API key"
                  type="password"
                />
                <Button type="submit" disabled={isSubmitting || !isValid} w="full">
                  Apply
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Center>
  )
}
