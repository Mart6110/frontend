import {
    DrawerBackdrop,
    DrawerBody,
    DrawerCloseTrigger,
    DrawerContent,
    DrawerHeader,
    DrawerRoot,
    DrawerTitle,
    DrawerTrigger,
    DrawerPositioner,
    DrawerFooter,
    CloseButton,
} from "@chakra-ui/react"
import type { DrawerRootProps } from "@chakra-ui/react"

export interface DrawerProps extends DrawerRootProps {
    trigger: React.ReactNode
    title: string
    children: React.ReactNode
    footer?: React.ReactNode
}

export function Drawer({ trigger, title, children, footer, ...props }: DrawerProps) {
    return (
        <DrawerRoot {...props}>
            <DrawerTrigger asChild>{trigger}</DrawerTrigger>
            <DrawerBackdrop />
            <DrawerPositioner>
                <DrawerContent bg="bg">
                    <DrawerHeader>
                        <DrawerTitle>{title}</DrawerTitle>
                        <DrawerCloseTrigger asChild>
                            <CloseButton size="sm" />
                        </DrawerCloseTrigger>
                    </DrawerHeader>
                    <DrawerBody>{children}</DrawerBody>
                    {footer && <DrawerFooter>{footer}</DrawerFooter>}
                    <DrawerCloseTrigger />
                </DrawerContent>
            </DrawerPositioner>
        </DrawerRoot>
    )
}
