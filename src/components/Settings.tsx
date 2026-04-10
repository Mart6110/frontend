import { VStack, Heading } from "@chakra-ui/react"
import { Formik, Form } from "formik"
import * as Yup from "yup"
import { FormikField } from "@/components/ui/formikField"
import { FormikSelect } from "@/components/ui/formikSelect"
import { FormikSlider } from "@/components/ui/formikSlider"
import { Button } from "@/components/ui/button"

const settingsSchema = Yup.object().shape({
    capacity: Yup.number()
        .required("Capacity is required")
        .min(1, "Capacity must be at least 1 kWh")
        .max(10000, "Capacity cannot exceed 10000 kWh"),
    maxChargeRate: Yup.number()
        .required("Max charge rate is required")
        .min(1, "Must be at least 1 kW")
        .max(1000, "Cannot exceed 1000 kW"),
    maxDischargeRate: Yup.number()
        .required("Max discharge rate is required")
        .min(1, "Must be at least 1 kW")
        .max(1000, "Cannot exceed 1000 kW"),
    operatingMode: Yup.string().required("Operating mode is required"),
    targetTemperature: Yup.number()
        .required("Target temperature is required")
        .min(200, "Must be at least 200°C")
        .max(800, "Cannot exceed 800°C"),
    efficiency: Yup.number()
        .required("Efficiency is required")
        .min(0)
        .max(100),
    minStateOfCharge: Yup.number()
        .required("Min state of charge is required")
        .min(0)
        .max(100),
    maxStateOfCharge: Yup.number()
        .required("Max state of charge is required")
        .min(0)
        .max(100),
})

export function Settings() {
    return (
        <VStack align="start" gap={6} w="full">
            <Formik
                initialValues={{
                    capacity: 100,
                    maxChargeRate: 50,
                    maxDischargeRate: 50,
                    operatingMode: "auto",
                    targetTemperature: 600,
                    efficiency: 85,
                    minStateOfCharge: 10,
                    maxStateOfCharge: 95,
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
                                label="Battery Capacity"
                                type="number"
                                placeholder="100"
                                helperText="Total energy storage capacity in kWh"
                                required
                            />

                            <FormikField
                                name="maxChargeRate"
                                label="Max Charge Rate"
                                type="number"
                                placeholder="50"
                                helperText="Maximum charging power in kW"
                                required
                            />

                            <FormikField
                                name="maxDischargeRate"
                                label="Max Discharge Rate"
                                type="number"
                                placeholder="50"
                                helperText="Maximum discharging power in kW"
                                required
                            />

                            <FormikSelect
                                name="operatingMode"
                                label="Operating Mode"
                                options={[
                                    { label: "Automatic", value: "auto" },
                                    { label: "Charge Only", value: "charge" },
                                    { label: "Discharge Only", value: "discharge" },
                                    { label: "Standby", value: "standby" },
                                ]}
                                helperText="Battery operation mode"
                                required
                            />

                            <FormikField
                                name="targetTemperature"
                                label="Target Temperature"
                                type="number"
                                placeholder="600"
                                helperText="Target operating temperature in °C (200-800)"
                                required
                            />

                            <FormikSlider
                                name="efficiency"
                                label="System Efficiency"
                                min={0}
                                max={100}
                                step={1}
                                helperText="Round-trip energy efficiency (%)"
                                required
                            />

                            <FormikSlider
                                name="minStateOfCharge"
                                label="Minimum State of Charge"
                                min={0}
                                max={100}
                                step={5}
                                helperText="Minimum allowed battery charge level (%)"
                                required
                            />

                            <FormikSlider
                                name="maxStateOfCharge"
                                label="Maximum State of Charge"
                                min={0}
                                max={100}
                                step={5}
                                helperText="Maximum allowed battery charge level (%)"
                                required
                            />
                        </VStack>
                        <Button
                            type="submit"
                            disabled={isSubmitting || !isValid || !dirty}
                            w="full"
                            mt={2}
                        >
                            Save Settings
                        </Button>
                    </Form>
                )}
            </Formik>
        </VStack>
    )
}
