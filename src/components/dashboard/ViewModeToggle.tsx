import { Button, ButtonGroup } from "@chakra-ui/react"
import { LuClock, LuCalendar } from "react-icons/lu"
import type { ViewMode } from "@/constants/timeRanges"

export interface ViewModeToggleProps {
  value: ViewMode
  onChange: (mode: ViewMode) => void
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
}

export function ViewModeToggle({ 
  value, 
  onChange, 
  disabled = false,
  size = "md"
}: ViewModeToggleProps) {
  return (
    <ButtonGroup size={size} attached variant="outline">
      <Button 
        onClick={() => onChange('realtime')}
        variant={value === 'realtime' ? 'solid' : 'outline'}
        disabled={disabled}
        bg={value === 'realtime' ? 'teal.500' : 'transparent'}
        color={value === 'realtime' ? 'white' : 'fg'}
        borderColor={value === 'realtime' ? 'teal.500' : 'border'}
        _hover={{
          bg: value === 'realtime' ? 'teal.600' : 'bg.muted',
        }}
      >
        <LuClock />
        Realtime
      </Button>
      <Button 
        onClick={() => onChange('dateRange')}
        variant={value === 'dateRange' ? 'solid' : 'outline'}
        disabled={disabled}
        bg={value === 'dateRange' ? 'teal.500' : 'transparent'}
        color={value === 'dateRange' ? 'white' : 'fg'}
        borderColor={value === 'dateRange' ? 'teal.500' : 'border'}
        _hover={{
          bg: value === 'dateRange' ? 'teal.600' : 'bg.muted',
        }}
      >
        <LuCalendar />
        Date Range
      </Button>
    </ButtonGroup>
  )
}
