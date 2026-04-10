import { Field, FieldErrorText } from "./field"
import { Checkbox } from "./checkbox"
import { useField } from "formik"

interface FormikCheckboxProps {
  name: string
  label: string
  helperText?: string
  colorPalette?: string
}

export function FormikCheckbox({
  name,
  label,
  helperText,
  colorPalette = "teal",
}: FormikCheckboxProps) {
  const [field, meta] = useField({ name, type: "checkbox" })
  const isInvalid = meta.touched && !!meta.error

  return (
    <Field.Root invalid={isInvalid}>
      <Checkbox.Root
        {...field}
        checked={field.value}
        colorPalette={colorPalette}
      >
        <Checkbox.HiddenInput />
        <Checkbox.Control>
          <Checkbox.Indicator />
        </Checkbox.Control>
        <Checkbox.Label>{label}</Checkbox.Label>
      </Checkbox.Root>
      {helperText && !isInvalid && <Field.HelperText>{helperText}</Field.HelperText>}
      {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
    </Field.Root>
  )
}
