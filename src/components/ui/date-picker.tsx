import { Input, Box } from "@chakra-ui/react"
import { Field } from "@/components/ui/field"
import { useState, useEffect } from "react"
import { format, parseISO, isValid } from "date-fns"

export interface DatePickerProps {
  label?: string
  value?: Date | null
  onChange?: (date: Date | null) => void
  minDate?: Date
  maxDate?: Date
  placeholder?: string
  error?: string
  required?: boolean
  disabled?: boolean
  showTime?: boolean
}

export function DatePicker({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  placeholder = "Select date",
  error,
  required = false,
  disabled = false,
  showTime = false
}: DatePickerProps) {
  const [internalValue, setInternalValue] = useState<string>(() => {
    if (!value) return ""
    try {
      if (showTime) {
        return format(value, "yyyy-MM-dd'T'HH:mm")
      }
      return format(value, "yyyy-MM-dd")
    } catch {
      return ""
    }
  })

  // Sync internal value when external value changes
  useEffect(() => {
    if (!value) {
      setInternalValue("")
      return
    }
    try {
      if (showTime) {
        setInternalValue(format(value, "yyyy-MM-dd'T'HH:mm"))
      } else {
        setInternalValue(format(value, "yyyy-MM-dd"))
      }
    } catch {
      setInternalValue("")
    }
  }, [value, showTime])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setInternalValue(newValue)
    
    if (onChange) {
      if (newValue === "") {
        onChange(null)
      } else {
        try {
          const parsedDate = parseISO(newValue)
          if (isValid(parsedDate)) {
            onChange(parsedDate)
          } else {
            onChange(null)
          }
        } catch {
          onChange(null)
        }
      }
    }
  }

  const formatDateForInput = (date: Date): string => {
    try {
      if (showTime) {
        return format(date, "yyyy-MM-dd'T'HH:mm")
      }
      return format(date, "yyyy-MM-dd")
    } catch {
      return ""
    }
  }

  const inputType = showTime ? "datetime-local" : "date"
  const min = minDate ? formatDateForInput(minDate) : undefined
  const max = maxDate ? formatDateForInput(maxDate) : undefined

  const inputElement = (
    <Input
      type={inputType}
      value={internalValue}
      onChange={handleChange}
      min={min}
      max={max}
      placeholder={placeholder}
      disabled={disabled}
      required={required}
      colorPalette="teal"
      css={{
        colorScheme: "dark",
        "&::-webkit-calendar-picker-indicator": {
          filter: "invert(1)",
          cursor: "pointer"
        }
      }}
    />
  )

  if (label) {
    return (
      <Field.Root invalid={!!error} required={required}>
        <Field.Label>{label}</Field.Label>
        {inputElement}
        {error && <Field.ErrorText>{error}</Field.ErrorText>}
      </Field.Root>
    )
  }

  return (
    <Box>
      {inputElement}
      {error && (
        <Field.ErrorText mt={1}>
          {error}
        </Field.ErrorText>
      )}
    </Box>
  )
}

// Controlled component variant
export interface ControlledDatePickerProps extends Omit<DatePickerProps, "value" | "onChange"> {
  value: Date | null
  onChange: (date: Date | null) => void
}

export function ControlledDatePicker(props: ControlledDatePickerProps) {
  return <DatePicker {...props} />
}
