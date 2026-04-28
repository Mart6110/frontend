import { VStack, Text, Spinner, Box } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FormikField } from "@/components/ui/formikField"
import { FormikCheckbox } from "@/components/ui/formikCheckbox"
import { Button } from "@/components/ui/button"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"
import { getSettings, updateSettings, type Settings as SettingsType } from "@/services/api"
import { useState, useEffect } from "react"
import { toaster } from "@/components/ui/toaster"

const settingsSchema = Yup.object().shape({
    max_sand_temp: Yup.number()
        .required(APP_TEXT.VALIDATION.MAX_SAND_TEMP.REQUIRED)
        .min(APP_CONFIG.LIMITS.MAX_SAND_TEMP.MIN, APP_TEXT.VALIDATION.MAX_SAND_TEMP.MIN)
        .max(APP_CONFIG.LIMITS.MAX_SAND_TEMP.MAX, APP_TEXT.VALIDATION.MAX_SAND_TEMP.MAX),
    min_pump_temp: Yup.number()
        .required(APP_TEXT.VALIDATION.MIN_PUMP_TEMP.REQUIRED)
        .min(APP_CONFIG.LIMITS.MIN_PUMP_TEMP.MIN, APP_TEXT.VALIDATION.MIN_PUMP_TEMP.MIN)
        .test('less-than-max', APP_TEXT.VALIDATION.MIN_PUMP_TEMP.LESS_THAN_MAX, function(value) {
            const { max_sand_temp } = this.parent
            return value === undefined || max_sand_temp === undefined || value < max_sand_temp
        }),
    pump_interval_seconds: Yup.number()
        .required(APP_TEXT.VALIDATION.PUMP_INTERVAL.REQUIRED)
        .min(APP_CONFIG.LIMITS.PUMP_INTERVAL_SECONDS.MIN, APP_TEXT.VALIDATION.PUMP_INTERVAL.MIN),
    price_limit_dkk: Yup.number()
        .required(APP_TEXT.VALIDATION.PRICE_LIMIT.REQUIRED)
        .min(APP_CONFIG.LIMITS.PRICE_LIMIT_DKK.MIN, APP_TEXT.VALIDATION.PRICE_LIMIT.MIN),
    auto_heating_enabled: Yup.boolean(),
    auto_pump_enabled: Yup.boolean(),
})

export function Settings() {
    const [initialValues, setInitialValues] = useState<SettingsType | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        async function loadSettings() {
            try {
                setIsLoading(true)
                setError(null)
                const settings = await getSettings()
                setInitialValues(settings)
            } catch (err) {
                console.error('Failed to load settings:', err)
                setError(APP_TEXT.SETTINGS.ERROR)
                // Use default values if API fails
                setInitialValues({
                    max_sand_temp: APP_CONFIG.DEFAULT_VALUES.MAX_SAND_TEMP,
                    min_pump_temp: APP_CONFIG.DEFAULT_VALUES.MIN_PUMP_TEMP,
                    pump_interval_seconds: APP_CONFIG.DEFAULT_VALUES.PUMP_INTERVAL_SECONDS,
                    price_limit_dkk: APP_CONFIG.DEFAULT_VALUES.PRICE_LIMIT_DKK,
                    auto_heating_enabled: APP_CONFIG.DEFAULT_VALUES.AUTO_HEATING_ENABLED,
                    auto_pump_enabled: APP_CONFIG.DEFAULT_VALUES.AUTO_PUMP_ENABLED,
                })
            } finally {
                setIsLoading(false)
            }
        }

        loadSettings()
    }, [])

    if (isLoading || !initialValues) {
        return (
            <VStack align="center" justify="center" minH="200px">
                <Spinner size="lg" color="teal.500" />
                <Text color="gray.500">{APP_TEXT.SETTINGS.LOADING}</Text>
            </VStack>
        )
    }

    return (
        <VStack align="start" gap={6} w="full">
            {error && (
                <Box 
                    w="full" 
                    p={3} 
                    bg="red.500/10" 
                    borderWidth="1px" 
                    borderColor="red.500/30" 
                    borderRadius="md"
                >
                    <Text color="red.400" fontSize="sm">{error}</Text>
                </Box>
            )}
            
            <Formik
                initialValues={initialValues}
                validationSchema={settingsSchema}
                onSubmit={async (values, { setSubmitting }) => {
                    try {
                        await updateSettings(values)
                        toaster.create({
                            title: APP_TEXT.SETTINGS.SUCCESS,
                            type: "success",
                            duration: 3000,
                        })
                        setError(null)
                    } catch (err) {
                        console.error("Failed to save settings:", err)
                        toaster.create({
                            title: APP_TEXT.SETTINGS.ERROR,
                            type: "error",
                            duration: 5000,
                        })
                    } finally {
                        setSubmitting(false)
                    }
                }}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form style={{ width: "100%" }}>
                        <VStack gap={4} w="full">
                            <FormikField
                                name="max_sand_temp"
                                label={APP_TEXT.SETTINGS.MAX_SAND_TEMP.LABEL}
                                type="number"
                                step="0.1"
                                placeholder={APP_TEXT.SETTINGS.MAX_SAND_TEMP.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.MAX_SAND_TEMP.HELPER}
                                required
                            />

                            <FormikField
                                name="min_pump_temp"
                                label={APP_TEXT.SETTINGS.MIN_PUMP_TEMP.LABEL}
                                type="number"
                                step="0.1"
                                placeholder={APP_TEXT.SETTINGS.MIN_PUMP_TEMP.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.MIN_PUMP_TEMP.HELPER}
                                required
                            />

                            <FormikField
                                name="pump_interval_seconds"
                                label={APP_TEXT.SETTINGS.PUMP_INTERVAL.LABEL}
                                type="number"
                                step="1"
                                placeholder={APP_TEXT.SETTINGS.PUMP_INTERVAL.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.PUMP_INTERVAL.HELPER}
                                required
                            />

                            <FormikField
                                name="price_limit_dkk"
                                label={APP_TEXT.SETTINGS.PRICE_LIMIT.LABEL}
                                type="number"
                                step="0.01"
                                placeholder={APP_TEXT.SETTINGS.PRICE_LIMIT.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.PRICE_LIMIT.HELPER}
                                required
                            />

                            <FormikCheckbox
                                name="auto_heating_enabled"
                                label={APP_TEXT.SETTINGS.AUTO_HEATING.LABEL}
                                helperText={APP_TEXT.SETTINGS.AUTO_HEATING.HELPER}
                            />

                            <FormikCheckbox
                                name="auto_pump_enabled"
                                label={APP_TEXT.SETTINGS.AUTO_PUMP.LABEL}
                                helperText={APP_TEXT.SETTINGS.AUTO_PUMP.HELPER}
                            />
                        </VStack>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            w="full"
                            mt={6}
                            loading={isSubmitting}
                            colorPalette="teal"
                        >
                            {APP_TEXT.SETTINGS.SAVE_BUTTON}
                        </Button>
                    </Form>
                )}
            </Formik>
        </VStack>
    )
}
