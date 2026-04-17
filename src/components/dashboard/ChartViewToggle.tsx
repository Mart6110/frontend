import { Button, ButtonGroup } from "@chakra-ui/react"
import { LuActivity, LuAlignJustify } from "react-icons/lu"

export type ChartViewMode = 'graph' | 'table'

export interface ChartViewToggleProps {
  value: ChartViewMode
  onChange: (mode: ChartViewMode) => void
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
}

export function ChartViewToggle({ 
  value, 
  onChange, 
  disabled = false,
  size = "sm"
}: ChartViewToggleProps) {
  return (
    <ButtonGroup size={size} attached variant="outline">
      <Button 
        onClick={() => onChange('graph')}
        variant={value === 'graph' ? 'solid' : 'outline'}
        disabled={disabled}
        bg={value === 'graph' ? 'teal.500' : 'transparent'}
        color={value === 'graph' ? 'white' : 'fg'}
        borderColor={value === 'graph' ? 'teal.500' : 'border'}
        _hover={{
          bg: value === 'graph' ? 'teal.600' : 'bg.muted',
        }}
      >
        <LuActivity />
        Graph
      </Button>
      <Button 
        onClick={() => onChange('table')}
        variant={value === 'table' ? 'solid' : 'outline'}
        disabled={disabled}
        bg={value === 'table' ? 'teal.500' : 'transparent'}
        color={value === 'table' ? 'white' : 'fg'}
        borderColor={value === 'table' ? 'teal.500' : 'border'}
        _hover={{
          bg: value === 'table' ? 'teal.600' : 'bg.muted',
        }}
      >
        <LuAlignJustify />
        Table
      </Button>
    </ButtonGroup>
  )
}
