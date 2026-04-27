import { Box, Text, Timeline, Badge, Flex, Stack, Separator, Button, IconButton } from "@chakra-ui/react"
import { Popover, PopoverBody, PopoverCloseTrigger, PopoverHeader, PopoverTitle } from "@/components/ui/popover"
import { FilterCheckbox } from "@/components/ui/filterCheckbox"
import { useState } from "react"
import { LuFilter, LuX } from "react-icons/lu"
import type { DashboardEvent } from "@/services/dataTransform"
import { APP_TEXT } from "@/constants/text"

const EVENT_TYPE_OPTIONS = [
  { value: 'pump', label: 'Pump' },
  { value: 'temperature', label: 'Temperature' },
  { value: 'energy', label: 'Energy' },
  { value: 'error', label: 'Error' },
  { value: 'warning', label: 'Warning' },
] as const

const EVENT_SEVERITY_OPTIONS = [
  { value: 'info', label: 'Info' },
  { value: 'warning', label: 'Warning' },
  { value: 'error', label: 'Error' },
] as const

interface EventTimelineProps {
  events: DashboardEvent[]
  maxEvents?: number
}

export function EventTimeline({ events, maxEvents = 100 }: EventTimelineProps) {
  // Applied filters (used for actual filtering)
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>([])
  
  // Temporary selections in the popover (before Apply is clicked)
  const [tempTypes, setTempTypes] = useState<string[]>([])
  const [tempSeverities, setTempSeverities] = useState<string[]>([])

  // Filter events based on selections (empty array = show all)
  const filteredEvents = events.filter(event => {
    const typeMatch = selectedTypes.length === 0 || selectedTypes.includes(event.type)
    const severityMatch = selectedSeverities.length === 0 || selectedSeverities.includes(event.severity)
    return typeMatch && severityMatch
  })
  
  const displayEvents = filteredEvents.slice(0, maxEvents)

  const handleTypeToggle = (type: string) => {
    setTempTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleSeverityToggle = (severity: string) => {
    setTempSeverities(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    )
  }

  const handleApply = () => {
    setSelectedTypes(tempTypes)
    setSelectedSeverities(tempSeverities)
  }

  const handleClear = () => {
    setTempTypes([])
    setTempSeverities([])
  }

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Reset temp selections to current applied filters when opening
      setTempTypes(selectedTypes)
      setTempSeverities(selectedSeverities)
    }
  }

  const getSeverityColor = (severity: 'info' | 'warning' | 'error') => {
    switch (severity) {
      case 'error':
        return 'red'
      case 'warning':
        return 'orange'
      default:
        return 'teal'
    }
  }

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      pump: '⚙️',
      temperature: '🌡️',
      energy: '⚡',
      error: '❌',
      warning: '⚠️',
    }
    return icons[type] || '📝'
  }

  const formatTimestamp = (timestamp: number) => {
    const date = new Date(timestamp)
    const today = new Date()
    const isToday = date.toDateString() === today.toDateString()
    
    if (isToday) {
      return date.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    }
    
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Box display="flex" flexDirection="column" h="full">
      {/* Filter Button and Stats - Fixed at top */}
      <Flex 
        justify="space-between" 
        align="center" 
        pb={4}
        borderBottomWidth="1px"
        borderColor="border"
        mb={4}
      >
        <Box position="relative">
          <Popover
            onOpenChange={(e) => handleOpenChange(e.open)}
            trigger={
              <Button variant="outline" size="sm" colorPalette="teal">
                <LuFilter />
                Filter Events
              </Button>
            }
          content={
            <Box minW="300px">
              <PopoverHeader>
                <Flex justify="space-between" align="center">
                  <PopoverTitle>Filter Events</PopoverTitle>
                  <PopoverCloseTrigger asChild>
                    <IconButton variant="ghost" size="sm" aria-label="Close">
                      <LuX />
                    </IconButton>
                  </PopoverCloseTrigger>
                </Flex>
              </PopoverHeader>
              <PopoverBody>
                <Stack gap={4}>
                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="fg">Filter by Type</Text>
                    <Stack gap={2}>
                      {EVENT_TYPE_OPTIONS.map((option) => (
                        <FilterCheckbox
                          key={option.value}
                          checked={tempTypes.includes(option.value)}
                          onCheckedChange={() => handleTypeToggle(option.value)}
                          label={option.label}
                          icon={getTypeIcon(option.value)}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Separator />

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="fg">Filter by Severity</Text>
                    <Stack gap={2}>
                      {EVENT_SEVERITY_OPTIONS.map((option) => (
                        <FilterCheckbox
                          key={option.value}
                          checked={tempSeverities.includes(option.value)}
                          onCheckedChange={() => handleSeverityToggle(option.value)}
                          label={option.label}
                          badge={{ text: option.label, colorScheme: getSeverityColor(option.value as 'info' | 'warning' | 'error') }}
                          colorPalette={getSeverityColor(option.value as 'info' | 'warning' | 'error')}
                        />
                      ))}
                    </Stack>
                  </Box>

                  <Separator />

                  <Flex gap={2}>
                    <Button variant="outline" colorPalette="gray" flex={1} onClick={handleClear}>
                      Clear
                    </Button>
                    <PopoverCloseTrigger asChild>
                      <Button colorPalette="teal" flex={1} onClick={handleApply}>
                        Apply
                      </Button>
                    </PopoverCloseTrigger>
                  </Flex>
                </Stack>
              </PopoverBody>
            </Box>
          }
          />
          {(selectedTypes.length > 0 || selectedSeverities.length > 0) && (
            <Badge
              position="absolute"
              top="-1"
              right="-1"
              colorScheme="teal"
              fontSize="2xs"
              borderRadius="full"
              px={1.5}
              minW="20px"
              textAlign="center"
            >
              {selectedTypes.length + selectedSeverities.length}
            </Badge>
          )}
        </Box>
        <Text fontSize="xs" color="gray.400">
          Showing {displayEvents.length} of {filteredEvents.length} events
        </Text>
      </Flex>

      {/* Timeline - Scrollable */}
      <Box flex="1" overflowY="auto">
        {displayEvents.length === 0 ? (
        <Box py={8} textAlign="center">
          <Text color="gray.400">
            {events.length === 0 ? APP_TEXT.DASHBOARD.NO_DATA : 'No events match the selected filters'}
          </Text>
        </Box>
      ) : (
        <Timeline.Root variant="subtle" size="sm">
          {displayEvents.map((event) => (
            <Timeline.Item key={event.id}>
              <Timeline.Connector>
                <Timeline.Indicator colorPalette={getSeverityColor(event.severity)}>
                  <Text fontSize="lg">{getTypeIcon(event.type)}</Text>
                </Timeline.Indicator>
                <Timeline.Separator />
              </Timeline.Connector>
              <Timeline.Content>
                <Timeline.Title fontSize="sm" fontWeight="medium">
                  {event.message}
                  <Badge
                    ml={2}
                    colorScheme={getSeverityColor(event.severity)}
                    fontSize="2xs"
                    px={2}
                    py={0.5}
                    borderRadius="full"
                  >
                    {event.severity}
                  </Badge>
                </Timeline.Title>
                <Timeline.Description fontSize="xs" color="gray.400">
                  {formatTimestamp(event.timestamp)}
                </Timeline.Description>
              </Timeline.Content>
            </Timeline.Item>
          ))}
        </Timeline.Root>
      )}
      </Box>
    </Box>
  )
}
