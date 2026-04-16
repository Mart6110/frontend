import { Field, FieldErrorText } from "./field"
import { Textarea } from "./textarea"
import { useField } from "formik"

interface FormikTextareaProps {
  name: string
  label?: string
  placeholder?: string
  helperText?: string
  required?: boolean
  colorPalette?: string
  rows?: number
}

export function FormikTextarea({
  name,
  label,
  placeholder,
  helperText,
  required = false,
  colorPalette = "teal",
  rows = 3,
}: FormikTextareaProps) {
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
      <Textarea
        {...field}
        placeholder={placeholder}
        colorPalette={colorPalette}
        rows={rows}
      />
      {helperText && !isInvalid && <Field.HelperText>{helperText}</Field.HelperText>}
      {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
    </Field.Root>
  )
}
