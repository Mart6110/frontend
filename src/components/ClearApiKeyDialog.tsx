import { Text } from "@chakra-ui/react"
import { useDispatch } from "react-redux"
import { useNavigate } from "@tanstack/react-router"
import { clearApiKey } from "@/store/apiKeySlice"
import { Button } from "@/components/ui/button"
import { Dialog, DialogActionTrigger } from "@/components/ui/dialog"
import type { AppDispatch } from "@/store"

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
            <Dialog.Title>Clear API Key</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <Text>Are you sure you want to clear your API key? You will be logged out.</Text>
          </Dialog.Body>
          <Dialog.Footer>
            <DialogActionTrigger asChild>
              <Button variant="outline">Cancel</Button>
            </DialogActionTrigger>
            <DialogActionTrigger asChild>
              <Button onClick={handleClear}>
                Clear
              </Button>
            </DialogActionTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  )
}
