import { Field, FieldErrorText } from "./field"
import { Select } from "./select"
import { useField } from "formik"
import { createListCollection } from "@chakra-ui/react"

interface SelectOption {
  label: string
  value: string
}

interface FormikSelectProps {
  name: string
  label?: string
  placeholder?: string
  options: SelectOption[]
  helperText?: string
  required?: boolean
  colorPalette?: string
}

export function FormikSelect({
  name,
  label,
  placeholder = "Select option",
  options,
  helperText,
  required = false,
  colorPalette = "teal",
}: FormikSelectProps) {
  const [field, meta, helpers] = useField(name)
  const isInvalid = meta.touched && !!meta.error

  const collection = createListCollection({
    items: options,
  })

  return (
    <Field.Root invalid={isInvalid}>
      {label && (
        <Field.Label>
          {label}
          {required && <Field.RequiredIndicator />}
        </Field.Label>
      )}
      <Select.Root
        collection={collection}
        value={field.value ? [field.value] : []}
        onValueChange={(e) => helpers.setValue(e.value[0])}
        colorPalette={colorPalette}
      >
        <Select.Trigger>
          <Select.ValueText placeholder={placeholder} />
        </Select.Trigger>
        <Select.Content>
          {options.map((option) => (
            <Select.Item key={option.value} item={option}>
              <Select.ItemText>{option.label}</Select.ItemText>
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      {helperText && !isInvalid && <Field.HelperText>{helperText}</Field.HelperText>}
      {isInvalid && <FieldErrorText>{meta.error}</FieldErrorText>}
    </Field.Root>
  )
}
