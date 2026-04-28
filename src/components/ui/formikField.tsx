import { Field, FieldErrorText } from "./field"
import { Input } from "./input"
import { useField } from "formik"

interface FormikFieldProps {
  name: string
  label?: string
  placeholder?: string
  type?: string
  helperText?: string
  required?: boolean
  colorPalette?: string
  step?: string | number
}

export function FormikField({
  name,
  label,
  placeholder,
  type = "text",
  helperText,
  required = false,
  colorPalette = "teal",
  step,
}: FormikFieldProps) {
  const [field, meta] = useField(name)
  const isInvalid = meta.touched && !!meta.error

  return (
    <Field.Root invalid={isInvalid}>
      {label && (
        <Field.Label>
          {label}
          {required && <Field.RequiredIndicator />}
        </Field.Label>
      )}
      <Input
        {...field}
        type={type}
        placeholder={placeholder}
        colorPalette={colorPalette}
        step={step}
      />
      {helperText && !isInvalid && <Field.HelperText>{helperText}</Field.HelperText>}
      {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
    </Field.Root>
  )
}
