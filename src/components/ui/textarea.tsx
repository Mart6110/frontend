import { Textarea as ChakraTextarea } from "@chakra-ui/react"
import type { TextareaProps as ChakraTextareaProps } from "@chakra-ui/react"

export type TextareaProps = ChakraTextareaProps

export function Textarea({ colorPalette = "teal", ...props }: TextareaProps) {
  return <ChakraTextarea colorPalette={colorPalette} {...props} />
}
