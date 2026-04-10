import { Field, FieldErrorText } from "./field"
import { Slider } from "./slider"
import { HStack } from "@chakra-ui/react"
import { useField } from "formik"

interface FormikSliderProps {
  name: string
  label?: string
  min?: number
  max?: number
  step?: number
  helperText?: string
  required?: boolean
  colorPalette?: string
  showValue?: boolean
}

export function FormikSlider({
  name,
  label,
  min = 0,
  max = 100,
  step = 1,
  helperText,
  required = false,
  colorPalette = "teal",
  showValue = true,
}: FormikSliderProps) {
  const [field, meta, helpers] = useField(name)
  const isInvalid = meta.touched && !!meta.error
  
  const currentValue = typeof field.value === 'number' ? field.value : min

  return (
    <Field.Root invalid={isInvalid}>
      {label && (
        <Field.Label>
          {label}
          {required && <Field.RequiredIndicator />}
        </Field.Label>
      )}
      <Slider.Root
        value={[currentValue]}
        onValueChange={(details) => {
          helpers.setValue(details.value[0])
        }}
        onValueChangeEnd={() => {
          helpers.setTouched(true)
        }}
        min={min}
        max={max}
        step={step}
        colorPalette={colorPalette}
        width="full"
      >
        <HStack gap={4} w="full" align="center">
          <Slider.Control flex="1" w="full">
            <Slider.Track w="full">
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0}>
              <Slider.HiddenInput />
            </Slider.Thumb>
          </Slider.Control>
          {showValue && <Slider.ValueText minW="50px" textAlign="right" />}
        </HStack>
      </Slider.Root>
      {helperText && !isInvalid && <Field.HelperText>{helperText}</Field.HelperText>}
      {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
    </Field.Root>
  )
}
