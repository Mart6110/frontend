import { Select as ChakraSelect } from "@chakra-ui/react"
import { forwardRef } from "react"

export interface SelectRootProps extends ChakraSelect.RootProps {
  colorPalette?: string
}

export const SelectRoot = forwardRef<HTMLDivElement, SelectRootProps>(
  function SelectRoot({ colorPalette = "teal", ...props }, ref) {
    return <ChakraSelect.Root ref={ref} colorPalette={colorPalette} {...props} />
  }
)

export const Select = {
  Root: SelectRoot,
  Trigger: ChakraSelect.Trigger,
  Content: ChakraSelect.Content,
  Item: ChakraSelect.Item,
  ItemGroup: ChakraSelect.ItemGroup,
  ItemGroupLabel: ChakraSelect.ItemGroupLabel,
  Label: ChakraSelect.Label,
  ValueText: ChakraSelect.ValueText,
  ClearTrigger: ChakraSelect.ClearTrigger,
  Indicator: ChakraSelect.Indicator,
  Positioner: ChakraSelect.Positioner,
  ItemText: ChakraSelect.ItemText,
}
