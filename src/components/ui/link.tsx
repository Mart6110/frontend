import { Link as ChakraLink } from "@chakra-ui/react"
import type { LinkProps as ChakraLinkProps } from "@chakra-ui/react"

export type LinkProps = ChakraLinkProps

export function Link({ colorPalette = "teal", ...props }: LinkProps) {
  return <ChakraLink colorPalette={colorPalette} {...props} />
}
