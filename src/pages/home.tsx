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
import { APP_TEXT } from "@/constants/text"

const apiKeySchema = Yup.object().shape({
  apiKey: Yup.string()
    .required(APP_TEXT.VALIDATION.API_KEY.REQUIRED)
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
                  placeholder={APP_TEXT.HOME.API_KEY_PLACEHOLDER}
                />
                <Button type="submit" disabled={isSubmitting || !isValid} w="full">
                  {APP_TEXT.HOME.SUBMIT_BUTTON}
                </Button>
              </VStack>
            </Form>
          )}
        </Formik>
      </VStack>
    </Center>
  )
}
