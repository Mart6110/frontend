import { HStack, Text } from "@chakra-ui/react"
import { SelectRoot, Select } from "@/components/ui/select"
import { createListCollection } from "@chakra-ui/react"

export type DataInterval = '1m' | '5m' | '15m' | '30m' | '1h' | '6h' | '1d' | 'auto'

interface IntervalSelectorProps {
  value: DataInterval
  onChange: (interval: DataInterval) => void
  disabled?: boolean
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const intervals = createListCollection({
  items: [
    { label: "Auto", value: "auto" },
    { label: "1 minute", value: "1m" },
    { label: "5 minutes", value: "5m" },
    { label: "15 minutes", value: "15m" },
    { label: "30 minutes", value: "30m" },
    { label: "1 hour", value: "1h" },
    { label: "6 hours", value: "6h" },
    { label: "1 day", value: "1d" },
  ],
})

export function IntervalSelector({ value, onChange, disabled = false, size = "md" }: IntervalSelectorProps) {
  const handleChange = (details: { value: string[] }) => {
    if (details.value.length > 0) {
      onChange(details.value[0] as DataInterval)
    }
  }

  return (
    <HStack gap={2} align="center">
      <Text fontSize={size} fontWeight="medium" color="fg.muted" whiteSpace="nowrap">
        Interval:
      </Text>
      <SelectRoot
        collection={intervals}
        value={[value]}
        onValueChange={handleChange}
        disabled={disabled}
        size={size}
        width="140px"
      >
        <Select.Trigger>
          <Select.ValueText placeholder="Select interval" />
        </Select.Trigger>
        <Select.Content>
          {intervals.items.map((interval) => (
            <Select.Item key={interval.value} item={interval}>
              {interval.label}
            </Select.Item>
          ))}
        </Select.Content>
      </SelectRoot>
    </HStack>
  )
}
