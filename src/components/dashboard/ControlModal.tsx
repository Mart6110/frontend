import { useState } from "react"
import { Box, Text, VStack, HStack, Portal } from "@chakra-ui/react"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import * as dashboardService from "@/services/dashboardService"

interface ControlModalProps {
  trigger: React.ReactNode
  isPumpActive: boolean
  heater1Active: boolean
  heater2Active: boolean
  heater3Active: boolean
  onUpdate?: () => Promise<void>
}

export function ControlModal({ 
  trigger, 
  isPumpActive,
  heater1Active,
  heater2Active,
  heater3Active,
  onUpdate 
}: ControlModalProps) {
  const [isTogglingPump, setIsTogglingPump] = useState(false)
  const [isTogglingHeater1, setIsTogglingHeater1] = useState(false)
  const [isTogglingHeater2, setIsTogglingHeater2] = useState(false)
  const [isTogglingHeater3, setIsTogglingHeater3] = useState(false)

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

  const handleToggleHeater1 = async () => {
    setIsTogglingHeater1(true)
    try {
      const action = heater1Active ? 'off' : 'on'
      await dashboardService.controlHeater(action)
      if (onUpdate) await onUpdate()
    } finally {
      setIsTogglingHeater1(false)
    }
  }

  const handleToggleHeater2 = async () => {
    setIsTogglingHeater2(true)
    try {
      const action = heater2Active ? 'off' : 'on'
      await dashboardService.controlHeater(action)
      if (onUpdate) await onUpdate()
    } finally {
      setIsTogglingHeater2(false)
    }
  }

  const handleToggleHeater3 = async () => {
    setIsTogglingHeater3(true)
    try {
      const action = heater3Active ? 'off' : 'on'
      await dashboardService.controlHeater(action)
      if (onUpdate) await onUpdate()
    } finally {
      setIsTogglingHeater3(false)
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
    <HStack justify="space-between" p={4} borderWidth="1px" borderRadius="md" bg={isActive ? `${color}.50` : "transparent"}>
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

              <Box pt={2}>
                <Text fontSize="sm" fontWeight="medium" mb={2} color="gray.300">
                  Varmesystem (3-delt)
                </Text>
                <VStack gap={2}>
                  <ControlRow
                    label="Varmer 1"
                    isActive={heater1Active}
                    onToggle={handleToggleHeater1}
                    isLoading={isTogglingHeater1}
                    color="orange"
                  />
                  <ControlRow
                    label="Varmer 2"
                    isActive={heater2Active}
                    onToggle={handleToggleHeater2}
                    isLoading={isTogglingHeater2}
                    color="orange"
                  />
                  <ControlRow
                    label="Varmer 3"
                    isActive={heater3Active}
                    onToggle={handleToggleHeater3}
                    isLoading={isTogglingHeater3}
                    color="orange"
                  />
                </VStack>
              </Box>
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
