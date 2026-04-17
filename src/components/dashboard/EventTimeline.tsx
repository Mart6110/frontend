import { Box, Text, Timeline, Badge, Flex, Stack, Separator, Button, IconButton } from "@chakra-ui/react"
import { Checkbox } from "@/components/ui/checkbox"
import { Popover, PopoverBody, PopoverCloseTrigger, PopoverHeader, PopoverTitle } from "@/components/ui/popover"
import { useState } from "react"
import { LuFilter, LuX } from "react-icons/lu"
import type { SystemEvent } from "@/services/mockData"
import { APP_TEXT } from "@/constants/text"

interface EventTimelineProps {
  events: SystemEvent[]
  maxEvents?: number
}

export function EventTimeline({ events, maxEvents = 100 }: EventTimelineProps) {
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['pump', 'temperature', 'energy', 'error', 'warning'])
  const [selectedSeverities, setSelectedSeverities] = useState<string[]>(['info', 'warning', 'error'])

  // Filter events based on selections
  const filteredEvents = events.filter(event => 
    selectedTypes.includes(event.type) && selectedSeverities.includes(event.severity)
  )
  
  const displayEvents = filteredEvents.slice(0, maxEvents)

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleSeverityToggle = (severity: string) => {
    setSelectedSeverities(prev => 
      prev.includes(severity) 
        ? prev.filter(s => s !== severity)
        : [...prev, severity]
    )
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
    <Box>
      {/* Filter Button and Stats */}
      <Flex justify="space-between" align="center" mb={4}>
        <Popover
          trigger={
            <Button variant="outline" size="sm" colorPalette="teal">
              <LuFilter />
              Filter Events
              {(selectedTypes.length < 5 || selectedSeverities.length < 3) && (
                <Badge ml={2} colorScheme="teal" fontSize="2xs">
                  {5 - selectedTypes.length + (3 - selectedSeverities.length)} hidden
                </Badge>
              )}
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
                      <Checkbox.Root
                        checked={selectedTypes.includes('pump')}
                        onCheckedChange={() => handleTypeToggle('pump')}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Flex align="center" gap={1}>
                            <Text fontSize="sm">⚙️ Pump</Text>
                          </Flex>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        checked={selectedTypes.includes('temperature')}
                        onCheckedChange={() => handleTypeToggle('temperature')}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Flex align="center" gap={1}>
                            <Text fontSize="sm">🌡️ Temperature</Text>
                          </Flex>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        checked={selectedTypes.includes('energy')}
                        onCheckedChange={() => handleTypeToggle('energy')}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Flex align="center" gap={1}>
                            <Text fontSize="sm">⚡ Energy</Text>
                          </Flex>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        checked={selectedTypes.includes('error')}
                        onCheckedChange={() => handleTypeToggle('error')}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Flex align="center" gap={1}>
                            <Text fontSize="sm">❌ Error</Text>
                          </Flex>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        checked={selectedTypes.includes('warning')}
                        onCheckedChange={() => handleTypeToggle('warning')}
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Flex align="center" gap={1}>
                            <Text fontSize="sm">⚠️ Warning</Text>
                          </Flex>
                        </Checkbox.Label>
                      </Checkbox.Root>
                    </Stack>
                  </Box>

                  <Separator />

                  <Box>
                    <Text fontSize="sm" fontWeight="semibold" mb={2} color="fg">Filter by Severity</Text>
                    <Stack gap={2}>
                      <Checkbox.Root
                        checked={selectedSeverities.includes('info')}
                        onCheckedChange={() => handleSeverityToggle('info')}
                        colorPalette="teal"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Badge colorScheme="teal" fontSize="xs">Info</Badge>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        checked={selectedSeverities.includes('warning')}
                        onCheckedChange={() => handleSeverityToggle('warning')}
                        colorPalette="orange"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Badge colorScheme="orange" fontSize="xs">Warning</Badge>
                        </Checkbox.Label>
                      </Checkbox.Root>
                      <Checkbox.Root
                        checked={selectedSeverities.includes('error')}
                        onCheckedChange={() => handleSeverityToggle('error')}
                        colorPalette="red"
                      >
                        <Checkbox.HiddenInput />
                        <Checkbox.Control>
                          <Checkbox.Indicator />
                        </Checkbox.Control>
                        <Checkbox.Label>
                          <Badge colorScheme="red" fontSize="xs">Error</Badge>
                        </Checkbox.Label>
                      </Checkbox.Root>
                    </Stack>
                  </Box>
                </Stack>
              </PopoverBody>
            </Box>
          }
        />
        <Text fontSize="xs" color="gray.400">
          Showing {displayEvents.length} of {filteredEvents.length} events
        </Text>
      </Flex>

      {/* Timeline */}
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
  )
}
