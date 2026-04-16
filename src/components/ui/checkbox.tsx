import { Checkbox as ChakraCheckbox } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface CheckboxRootProps extends ChakraCheckbox.RootProps {
  colorPalette?: string
}

export const CheckboxRoot = forwardRef<HTMLLabelElement, CheckboxRootProps>(
  function CheckboxRoot({ colorPalette = "teal", ...props }, ref) {
    return <ChakraCheckbox.Root ref={ref} colorPalette={colorPalette} {...props} />
  }
)

export const Checkbox = {
  Root: CheckboxRoot,
  Control: ChakraCheckbox.Control,
  Label: ChakraCheckbox.Label,
  Indicator: ChakraCheckbox.Indicator,
  Group: ChakraCheckbox.Group,
  HiddenInput: ChakraCheckbox.HiddenInput,
}
