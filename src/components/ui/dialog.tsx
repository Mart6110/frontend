import { Dialog as ChakraDialog } from "@chakra-ui/react"
import { forwardRef } from "react"

export const Dialog = {
  Root: ChakraDialog.Root,
  Trigger: ChakraDialog.Trigger,
  Content: ChakraDialog.Content,
  Header: ChakraDialog.Header,
  Title: ChakraDialog.Title,
  Description: ChakraDialog.Description,
  Body: ChakraDialog.Body,
  Footer: ChakraDialog.Footer,
  CloseTrigger: ChakraDialog.CloseTrigger,
  Backdrop: ChakraDialog.Backdrop,
  Positioner: ChakraDialog.Positioner,
}

export interface ButtonProps extends ChakraDialog.ActionTriggerProps {
  colorPalette?: string
}

export const DialogActionTrigger = forwardRef<HTMLButtonElement, ButtonProps>(
  function DialogActionTrigger({ colorPalette = "teal", ...props }, ref) {
    return <ChakraDialog.ActionTrigger ref={ref} colorPalette={colorPalette} {...props} />
  }
)
