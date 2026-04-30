import { useState } from "react"
import { Box, Text, VStack, HStack, Portal } from "@chakra-ui/react"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as dashboardService from "@/services/dashboardService"

interface HeaterStatus {
  index: number
  active: boolean
}

interface ControlModalProps {
  trigger: React.ReactNode
  isPumpActive: boolean
  heaters: HeaterStatus[]
  onUpdate?: () => Promise<void>
}

export function ControlModal({ 
  trigger, 
  isPumpActive,
  heaters,
  onUpdate 
}: ControlModalProps) {
  const [isTogglingPump, setIsTogglingPump] = useState(false)
  const [togglingHeaterIndex, setTogglingHeaterIndex] = useState<number | null>(null)

  const handleTogglePump = async () => {
    setIsTogglingPump(true)
    try {
      const action = isPumpActive ? 'stop' : 'start'
      await dashboardService.controlPump(action)
      if (onUpdate) await onUpdate()
    } finally {
      setIsTogglingPump(false)
    }
  }

  const handleToggleHeater = async (heater: HeaterStatus) => {
    setTogglingHeaterIndex(heater.index)
    try {
      const action = heater.active ? 'off' : 'on'
      await dashboardService.controlHeater(heater.index, action)
      if (onUpdate) await onUpdate()
    } finally {
      setTogglingHeaterIndex(null)
    }
  }

  const ControlRow = ({ 
    label, 
    isActive, 
    onToggle, 
    isLoading,
    color = "blue",
    statusText
  }: { 
    label: string
    isActive: boolean
    onToggle: () => void
    isLoading: boolean
    color?: string
    statusText?: string
  }) => (
    <HStack justify="space-between" p={4} borderWidth="1px" borderRadius="md" bg={isActive ? `${color}.50` : "bg"}>
      <VStack align="start" gap={1}>
        <Text fontSize="md" fontWeight="medium">{label}</Text>
        <Text fontSize="sm" color={isActive ? `${color}.600` : "gray.500"}>
          {statusText || (isActive ? "Aktiv" : "Inaktiv")}
        </Text>
      </VStack>
      <Button
        onClick={onToggle}
        loading={isLoading}
        colorPalette={isActive ? "red" : color}
        size="sm"
      >
        {isActive ? "Sluk" : "Tænd"}
      </Button>
    </HStack>
  )

  return (
    <Dialog.Root lazyMount unmountOnExit>
      <Dialog.Trigger asChild>
        {trigger}
      </Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop 
          style={{ 
            position: 'fixed',
            inset: 0,
            zIndex: 9998,
            background: 'rgba(0, 0, 0, 0.6)'
          }} 
        />
        <Dialog.Positioner 
          style={{ 
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
        >
          <Dialog.Content 
            bg="bg" 
            maxW="500px"
            style={{ 
              position: 'relative',
              zIndex: 9999,
              margin: 'auto'
            }}
          >
          <Dialog.Header>
            <Dialog.Title>Systemkontrol</Dialog.Title>
          </Dialog.Header>
          <Dialog.Body>
            <VStack gap={3} align="stretch">
              <Text fontSize="sm" color="gray.500" mb={2}>
                Styr dine sandbatteri systemkomponenter
              </Text>
              
              <ControlRow
                label="Vandpumpe"
                isActive={isPumpActive}
                onToggle={handleTogglePump}
                isLoading={isTogglingPump}
                color="green"
              />

              {heaters.length > 0 && (
                <Box pt={2}>
                  <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                    Varmesystem {heaters.length > 1 ? `(${heaters.length}-delt)` : ''}
                  </Text>
                  <VStack gap={2}>
                    {heaters.map(heater => (
                      <ControlRow
                        key={heater.index}
                        label={`Varmer ${heater.index + 1}`}
                        isActive={heater.active}
                        onToggle={() => handleToggleHeater(heater)}
                        isLoading={togglingHeaterIndex === heater.index}
                        color="green"
                      />
                    ))}
                  </VStack>
                </Box>
              )}
            </VStack>
          </Dialog.Body>
          <Dialog.Footer>
            <Dialog.CloseTrigger asChild>
              <Button variant="outline">Luk</Button>
            </Dialog.CloseTrigger>
          </Dialog.Footer>
          <Dialog.CloseTrigger />
        </Dialog.Content>
      </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  )
}
