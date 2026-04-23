import { Flex, Text, Badge } from "@chakra-ui/react"
import { Checkbox } from "@/components/ui/checkbox"

interface FilterCheckboxProps {
  checked: boolean
  onCheckedChange: () => void
  label: string
  icon?: string
  badge?: {
    text: string
    colorScheme: string
  }
  colorPalette?: string
}

export function FilterCheckbox({
  checked,
  onCheckedChange,
  label,
  icon,
  badge,
  colorPalette,
}: FilterCheckboxProps) {
  return (
    <Checkbox.Root
      checked={checked}
      onCheckedChange={onCheckedChange}
      colorPalette={colorPalette}
    >
      <Checkbox.HiddenInput />
      <Checkbox.Control>
        <Checkbox.Indicator />
      </Checkbox.Control>
      <Checkbox.Label>
        {badge ? (
          <Badge colorScheme={badge.colorScheme} fontSize="xs">
            {badge.text}
          </Badge>
        ) : (
          <Flex align="center" gap={1}>
            <Text fontSize="sm">
              {icon && `${icon} `}{label}
            </Text>
          </Flex>
        )}
      </Checkbox.Label>
    </Checkbox.Root>
  )
}
