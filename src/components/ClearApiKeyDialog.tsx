import { Text } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { useNavigate } from "@tanstack/react-router"
import { clearApiKey } from "@/store/apiKeySlice"
import { Button } from "@/components/ui/button"
import { Dialog, DialogActionTrigger } from "@/components/ui/dialog"
import type { AppDispatch } from "@/store"
import { APP_TEXT } from "@/constants/text"

interface ClearApiKeyDialogProps {
  trigger: React.ReactNode
}

export function ClearApiKeyDialog({ trigger }: ClearApiKeyDialogProps) {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  function handleClear() {
    dispatch(clearApiKey())
    navigate({ to: "/" })
  }

  return (
    <Dialog.Root role="alertdialog">
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content bg="bg">
          <Dialog.Header>
            <Dialog.Title>{APP_TEXT.DIALOGS.CLEAR_API_KEY.TITLE}</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>{APP_TEXT.DIALOGS.CLEAR_API_KEY.MESSAGE}</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <DialogActionTrigger asChild>
              <Button variant="outline">{APP_TEXT.DIALOGS.CLEAR_API_KEY.CANCEL}</Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
              <Button onClick={handleClear}>
                {APP_TEXT.DIALOGS.CLEAR_API_KEY.CONFIRM}
              </Button>
            </DialogActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
