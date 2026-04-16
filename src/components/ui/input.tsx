import { Input as ChakraInput } from "@chakra-ui/react"
import type { InputProps as ChakraInputProps } from "@chakra-ui/react"

export interface InputProps extends ChakraInputProps {}

export function Input({ colorPalette = "teal", ...props }: InputProps) {
  return <ChakraInput colorPalette={colorPalette} {...props} />
}
