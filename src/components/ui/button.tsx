import { Button as ChakraButton } from "@chakra-ui/react"
import type { ButtonProps as ChakraButtonProps } from "@chakra-ui/react"

export type ButtonProps = ChakraButtonProps

export function Button({ colorPalette = "teal", ...props }: ButtonProps) {
  return <ChakraButton colorPalette={colorPalette} {...props} />
}
