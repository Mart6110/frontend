import { VStack } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FormikField } from "@/components/ui/formikField"
import { FormikSelect } from "@/components/ui/formikSelect"
import { FormikSlider } from "@/components/ui/formikSlider"
import { Button } from "@/components/ui/button"
import { APP_TEXT, APP_CONFIG } from "@/constants/text"

const settingsSchema = Yup.object().shape({
    capacity: Yup.number()
        .required(APP_TEXT.VALIDATION.CAPACITY.REQUIRED)
        .min(APP_CONFIG.LIMITS.CAPACITY.MIN, APP_TEXT.VALIDATION.CAPACITY.MIN)
        .max(APP_CONFIG.LIMITS.CAPACITY.MAX, APP_TEXT.VALIDATION.CAPACITY.MAX),
    maxChargeRate: Yup.number()
        .required(APP_TEXT.VALIDATION.MAX_CHARGE_RATE.REQUIRED)
        .min(APP_CONFIG.LIMITS.CHARGE_RATE.MIN, APP_TEXT.VALIDATION.MAX_CHARGE_RATE.MIN)
        .max(APP_CONFIG.LIMITS.CHARGE_RATE.MAX, APP_TEXT.VALIDATION.MAX_CHARGE_RATE.MAX),
    maxDischargeRate: Yup.number()
        .required(APP_TEXT.VALIDATION.MAX_DISCHARGE_RATE.REQUIRED)
        .min(APP_CONFIG.LIMITS.DISCHARGE_RATE.MIN, APP_TEXT.VALIDATION.MAX_DISCHARGE_RATE.MIN)
        .max(APP_CONFIG.LIMITS.DISCHARGE_RATE.MAX, APP_TEXT.VALIDATION.MAX_DISCHARGE_RATE.MAX),
    operatingMode: Yup.string().required(APP_TEXT.VALIDATION.OPERATING_MODE.REQUIRED),
    targetTemperature: Yup.number()
        .required(APP_TEXT.VALIDATION.TARGET_TEMPERATURE.REQUIRED)
        .min(APP_CONFIG.LIMITS.TEMPERATURE.MIN, APP_TEXT.VALIDATION.TARGET_TEMPERATURE.MIN)
        .max(APP_CONFIG.LIMITS.TEMPERATURE.MAX, APP_TEXT.VALIDATION.TARGET_TEMPERATURE.MAX),
    efficiency: Yup.number()
        .required(APP_TEXT.VALIDATION.EFFICIENCY.REQUIRED)
        .min(APP_CONFIG.LIMITS.EFFICIENCY.MIN)
        .max(APP_CONFIG.LIMITS.EFFICIENCY.MAX),
    minStateOfCharge: Yup.number()
        .required(APP_TEXT.VALIDATION.MIN_STATE_OF_CHARGE.REQUIRED)
        .min(APP_CONFIG.LIMITS.STATE_OF_CHARGE.MIN)
        .max(APP_CONFIG.LIMITS.STATE_OF_CHARGE.MAX),
    maxStateOfCharge: Yup.number()
        .required(APP_TEXT.VALIDATION.MAX_STATE_OF_CHARGE.REQUIRED)
        .min(APP_CONFIG.LIMITS.STATE_OF_CHARGE.MIN)
        .max(APP_CONFIG.LIMITS.STATE_OF_CHARGE.MAX),
})

export function Settings() {
    return (
        <VStack align="start" gap={6} w="full">
            <Formik
                initialValues={{
                    capacity: APP_CONFIG.DEFAULT_VALUES.CAPACITY,
                    maxChargeRate: APP_CONFIG.DEFAULT_VALUES.MAX_CHARGE_RATE,
                    maxDischargeRate: APP_CONFIG.DEFAULT_VALUES.MAX_DISCHARGE_RATE,
                    operatingMode: APP_CONFIG.DEFAULT_VALUES.OPERATING_MODE,
                    targetTemperature: APP_CONFIG.DEFAULT_VALUES.TARGET_TEMPERATURE,
                    efficiency: APP_CONFIG.DEFAULT_VALUES.EFFICIENCY,
                    minStateOfCharge: APP_CONFIG.DEFAULT_VALUES.MIN_STATE_OF_CHARGE,
                    maxStateOfCharge: APP_CONFIG.DEFAULT_VALUES.MAX_STATE_OF_CHARGE,
                }}
                validationSchema={settingsSchema}
                onSubmit={(values) => {
                    console.log("Settings saved:", values)
                    // TODO: Save settings to backend/state
                }}
            >
                {({ isSubmitting, isValid, dirty }) => (
                    <Form style={{ width: "100%" }}>
                        <VStack gap={4} w="full">
                            <FormikField
                                name="capacity"
                                label={APP_TEXT.SETTINGS.CAPACITY.LABEL}
                                type="number"
                                placeholder={APP_TEXT.SETTINGS.CAPACITY.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.CAPACITY.HELPER}
                                required
                            />

                            <FormikField
                                name="maxChargeRate"
                                label={APP_TEXT.SETTINGS.MAX_CHARGE_RATE.LABEL}
                                type="number"
                                placeholder={APP_TEXT.SETTINGS.MAX_CHARGE_RATE.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.MAX_CHARGE_RATE.HELPER}
                                required
                            />

                            <FormikField
                                name="maxDischargeRate"
                                label={APP_TEXT.SETTINGS.MAX_DISCHARGE_RATE.LABEL}
                                type="number"
                                placeholder={APP_TEXT.SETTINGS.MAX_DISCHARGE_RATE.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.MAX_DISCHARGE_RATE.HELPER}
                                required
                            />

                            <FormikSelect
                                name="operatingMode"
                                label={APP_TEXT.SETTINGS.OPERATING_MODE.LABEL}
                                options={[
                                    { label: APP_TEXT.SETTINGS.OPERATING_MODE.OPTIONS.AUTO, value: "auto" },
                                    { label: APP_TEXT.SETTINGS.OPERATING_MODE.OPTIONS.CHARGE, value: "charge" },
                                    { label: APP_TEXT.SETTINGS.OPERATING_MODE.OPTIONS.DISCHARGE, value: "discharge" },
                                    { label: APP_TEXT.SETTINGS.OPERATING_MODE.OPTIONS.STANDBY, value: "standby" },
                                ]}
                                helperText={APP_TEXT.SETTINGS.OPERATING_MODE.HELPER}
                                required
                            />

                            <FormikField
                                name="targetTemperature"
                                label={APP_TEXT.SETTINGS.TARGET_TEMPERATURE.LABEL}
                                type="number"
                                placeholder={APP_TEXT.SETTINGS.TARGET_TEMPERATURE.PLACEHOLDER}
                                helperText={APP_TEXT.SETTINGS.TARGET_TEMPERATURE.HELPER}
                                required
                            />

                            <FormikSlider
                                name="efficiency"
                                label={APP_TEXT.SETTINGS.EFFICIENCY.LABEL}
                                min={APP_CONFIG.LIMITS.EFFICIENCY.MIN}
                                max={APP_CONFIG.LIMITS.EFFICIENCY.MAX}
                                step={APP_CONFIG.SLIDER_STEPS.EFFICIENCY}
                                helperText={APP_TEXT.SETTINGS.EFFICIENCY.HELPER}
                                required
                            />

                            <FormikSlider
                                name="minStateOfCharge"
                                label={APP_TEXT.SETTINGS.MIN_STATE_OF_CHARGE.LABEL}
                                min={APP_CONFIG.LIMITS.STATE_OF_CHARGE.MIN}
                                max={APP_CONFIG.LIMITS.STATE_OF_CHARGE.MAX}
                                step={APP_CONFIG.SLIDER_STEPS.STATE_OF_CHARGE}
                                helperText={APP_TEXT.SETTINGS.MIN_STATE_OF_CHARGE.HELPER}
                                required
                            />

                            <FormikSlider
                                name="maxStateOfCharge"
                                label={APP_TEXT.SETTINGS.MAX_STATE_OF_CHARGE.LABEL}
                                min={APP_CONFIG.LIMITS.STATE_OF_CHARGE.MIN}
                                max={APP_CONFIG.LIMITS.STATE_OF_CHARGE.MAX}
                                step={APP_CONFIG.SLIDER_STEPS.STATE_OF_CHARGE}
                                helperText={APP_TEXT.SETTINGS.MAX_STATE_OF_CHARGE.HELPER}
                                required
                            />
                        </VStack>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            w="full"
                            mt={2}
                        >
                            {APP_TEXT.SETTINGS.SAVE_BUTTON}
                        </Button>
                    </Form>
                )}
            </Formik>
        </VStack>
    )
}
