import { Popover as ChakraPopover, Portal } from "@chakra-ui/react"
import * as React from "react"

export interface PopoverProps extends Omit<ChakraPopover.RootProps, 'children'> {
  portalled?: boolean
  portalRef?: React.RefObject<HTMLElement | null>
  trigger?: React.ReactNode
  content?: React.ReactNode
  contentProps?: ChakraPopover.ContentProps
  children?: React.ReactNode
}

export const Popover = React.forwardRef<HTMLDivElement, PopoverProps>(
  function Popover(props, ref) {
    const {
      trigger,
      content,
      children,
      portalled = true,
      portalRef,
      contentProps,
      ...rest
    } = props

    return (
      <ChakraPopover.Root {...rest}>
        {trigger && (
          <ChakraPopover.Trigger asChild>{trigger}</ChakraPopover.Trigger>
        )}
        {children}
        <Portal disabled={!portalled} container={portalRef}>
          <ChakraPopover.Positioner>
            <ChakraPopover.Content bg={'bg'} ref={ref} {...contentProps}>
              <ChakraPopover.Arrow>
                <ChakraPopover.ArrowTip />
              </ChakraPopover.Arrow>
              {content}
            </ChakraPopover.Content>
          </ChakraPopover.Positioner>
        </Portal>
      </ChakraPopover.Root>
    )
  },
)

export const PopoverTitle = ChakraPopover.Title
export const PopoverDescription = ChakraPopover.Description
export const PopoverCloseTrigger = ChakraPopover.CloseTrigger
export const PopoverBody = ChakraPopover.Body
export const PopoverFooter = ChakraPopover.Footer
export const PopoverHeader = ChakraPopover.Header
