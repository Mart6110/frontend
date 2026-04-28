import { createListCollection, Portal, Flex, Text } from "@chakra-ui/react"
import { Select } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"
import { TIME_RANGES, type TimeUnit, type RealtimeTimeConfig } from "@/constants/timeRanges"
import { useMemo, useState, useEffect } from "react"

export interface RealtimeTimeSelectorProps {
  value: RealtimeTimeConfig
  onChange: (config: RealtimeTimeConfig) => void
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
}

export function RealtimeTimeSelector({ 
  value, 
  onChange, 
  disabled = false,
  size = "sm"
}: RealtimeTimeSelectorProps) {
  // Track pending changes internally
  const [pendingConfig, setPendingConfig] = useState(value)

  // Sync with prop changes
  useEffect(() => {
    setPendingConfig(value)
  }, [value])

  const units = createListCollection({
    items: [
      { label: 'Minutter', value: 'minutes' },
      { label: 'Timer', value: 'hours' },
      { label: 'Dage', value: 'days' }
    ]
  })

  const currentRange = TIME_RANGES[pendingConfig.unit]

  // Ensure value is within range when unit changes
  const clampedValue = useMemo(() => {
    const range = TIME_RANGES[pendingConfig.unit]
    return Math.max(range.min, Math.min(range.max, pendingConfig.value))
  }, [pendingConfig.unit, pendingConfig.value])

  // Check if there are unsaved changes
  const hasChanges = useMemo(() => {
    return pendingConfig.unit !== value.unit || pendingConfig.value !== value.value
  }, [pendingConfig, value])

  const handleUnitChange = (newUnit: TimeUnit) => {
    const newRange = TIME_RANGES[newUnit]
    // Set to a reasonable default when changing units
    let newValue: number = newRange.min
    if (newUnit === 'hours') newValue = 6
    else if (newUnit === 'days') newValue = 1
    else if (newUnit === 'minutes') newValue = 30

    setPendingConfig({ value: newValue, unit: newUnit })
  }

  const handleValueChange = (details: { value: number[] }) => {
    setPendingConfig({ value: details.value[0], unit: pendingConfig.unit })
  }

  const handleApply = () => {
    onChange(pendingConfig)
  }

  const getDisplayText = () => {
    const val = clampedValue
    const unitText = pendingConfig.unit === 'minutes' ? 'min' : 
                     pendingConfig.unit === 'hours' ? 'time' : 'dag'
    const plural = val > 1 && pendingConfig.unit === 'hours' ? 'r' : 
                   val > 1 && pendingConfig.unit === 'days' ? 'e' : ''
    return `Sidste ${val} ${unitText}${plural}`
  }

  return (
    <Flex gap={3} align="center" flexWrap="wrap">
      {/* Unit Selector */}
      <Select.Root
        collection={units}
        size={size}
        value={[pendingConfig.unit]}
        onValueChange={(e) => handleUnitChange(e.value[0] as TimeUnit)}
        disabled={disabled}
        width="120px"
      >
        <Select.HiddenSelect />
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>
          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content bg={'bg'}>
              {units.items.map((item) => (
                <Select.Item item={item} key={item.value}>
                  {item.label}
                  <Select.ItemIndicator />
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      {/* Value Slider */}
      <Flex align="center" gap={2} minW="200px">
        <Slider.Root
          value={[clampedValue]}
          onValueChange={handleValueChange}
          min={currentRange.min}
          max={currentRange.max}
          step={currentRange.step}
          disabled={disabled}
          width="140px"
        >
          <Slider.Control>
            <Slider.Track>
              <Slider.Range />
            </Slider.Track>
            <Slider.Thumb index={0} />
          </Slider.Control>
        </Slider.Root>
        <Text fontSize="sm" fontWeight="medium" minW="80px" color="fg">
          {getDisplayText()}
        </Text>
      </Flex>

      {/* Apply Button */}
      <Button
        size={size}
        onClick={handleApply}
        disabled={disabled || !hasChanges}
        colorPalette={hasChanges ? "teal" : "gray"}
        variant={hasChanges ? "solid" : "outline"}
      >
        Anvend
      </Button>
    </Flex>
  )
}

// Legacy export for backward compatibility
export { RealtimeTimeSelector as RealtimeHoursSelector }
