import { Box, Text, Timeline, Badge } from "@chakra-ui/react"
import type { SystemEvent } from "@/services/mockData"
import { APP_TEXT } from "@/constants/text"

interface EventTimelineProps {
  events: SystemEvent[]
  maxEvents?: number
}

export function EventTimeline({ events, maxEvents = 100 }: EventTimelineProps) {
  const displayEvents = events.slice(0, maxEvents)

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

  if (displayEvents.length === 0) {
    return (
      <Box py={8} textAlign="center">
        <Text color="gray.500">{APP_TEXT.DASHBOARD.NO_DATA}</Text>
      </Box>
    )
  }

  return (
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
            <Timeline.Description fontSize="xs" color="gray.500">
              {formatTimestamp(event.timestamp)}
            </Timeline.Description>
          </Timeline.Content>
        </Timeline.Item>
      ))}
    </Timeline.Root>
  )
}
