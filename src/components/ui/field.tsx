import { Field as ChakraField } from "@chakra-ui/react"
import { forwardRef } from "react"

export const Field = {
  Root: ChakraField.Root,
  Label: ChakraField.Label,
  HelperText: ChakraField.HelperText,
  ErrorText: ChakraField.ErrorText,
  RequiredIndicator: ChakraField.RequiredIndicator,
}

export interface FieldErrorTextProps extends ChakraField.ErrorTextProps {
  colorPalette?: string
}

export const FieldErrorText = forwardRef<HTMLDivElement, FieldErrorTextProps>(
  function FieldErrorText({ colorPalette = "red", ...props }, ref) {
    return <ChakraField.ErrorText ref={ref} colorPalette={colorPalette} {...props} />
  }
)
