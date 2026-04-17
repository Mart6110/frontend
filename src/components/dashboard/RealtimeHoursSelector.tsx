import { createListCollection, Portal } from "@chakra-ui/react"
import { Select } from "@/components/ui/select"
import { REALTIME_HOURS, type RealtimeHours } from "@/constants/timeRanges"

export interface RealtimeHoursSelectorProps {
  value: RealtimeHours
  onChange: (hours: RealtimeHours) => void
  disabled?: boolean
  size?: "xs" | "sm" | "md" | "lg"
}

export function RealtimeHoursSelector({ 
  value, 
  onChange, 
  disabled = false,
  size = "sm"
}: RealtimeHoursSelectorProps) {
  const hours = createListCollection({
    items: REALTIME_HOURS.map(h => ({
      label: `Last ${h} hour${h > 1 ? 's' : ''}`,
      value: h.toString()
    }))
  })

  return (
    <Select.Root
      collection={hours}
      size={size}
      value={[value.toString()]}
      onValueChange={(e) => onChange(Number(e.value[0]) as RealtimeHours)}
      disabled={disabled}
      maxW="180px"
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder="Select hours" />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content bg={'bg'}>
            {hours.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                {item.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  )
}
