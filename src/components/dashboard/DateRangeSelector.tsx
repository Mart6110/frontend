import { Button, DatePicker, Flex, Portal, VStack, Input, Text, IconButton } from "@chakra-ui/react"
import { LuCalendar } from "react-icons/lu"
import { useEffect, useState, memo } from "react"
import { CalendarDateTime, type DateValue } from "@internationalized/date"

export interface DateRangeSelectorProps {
  startDate: Date | null
  endDate: Date | null
  onStartDateChange: (date: Date | null) => void
  onEndDateChange: (date: Date | null) => void
  disabled?: boolean
  showTime?: boolean
}

export const DateRangeSelector = memo(function DateRangeSelector({ 
  startDate, 
  endDate, 
  onStartDateChange, 
  onEndDateChange,
  disabled = false,
}: DateRangeSelectorProps) {
  const [value, setValue] = useState<CalendarDateTime[]>([])
  const [open, setOpen] = useState(false)

  // Convert Date to CalendarDateTime
  const dateToCalendarDateTime = (date: Date | null): CalendarDateTime | null => {
    if (!date) return null
    return new CalendarDateTime(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    )
  }

  // Convert CalendarDateTime to Date
  const calendarDateTimeToDate = (dateTime: CalendarDateTime | null): Date | null => {
    if (!dateTime) return null
    return new Date(
      dateTime.year,
      dateTime.month - 1,
      dateTime.day,
      dateTime.hour,
      dateTime.minute,
      dateTime.second
    )
  }

  // Sync internal value with external props
  useEffect(() => {
    const newValue: CalendarDateTime[] = []
    const startDateTime = dateToCalendarDateTime(startDate)
    const endDateTime = dateToCalendarDateTime(endDate)
    
    if (startDateTime) newValue.push(startDateTime)
    if (endDateTime) newValue.push(endDateTime)
    
    setValue(newValue)
  }, [startDate, endDate])

  const handleValueChange = (details: { value: DateValue[] }) => {
    const newValue: CalendarDateTime[] = []
    
    // Handle start date
    if (details.value[0]) {
      const prevStartTime = value[0] ?? { hour: 0, minute: 0, second: 0 }
      newValue.push(
        new CalendarDateTime(
          details.value[0].year,
          details.value[0].month,
          details.value[0].day,
          prevStartTime.hour,
          prevStartTime.minute,
          prevStartTime.second
        )
      )
    }
    
    // Handle end date
    if (details.value[1]) {
      const prevEndTime = value[1] ?? { hour: 23, minute: 59, second: 59 }
      newValue.push(
        new CalendarDateTime(
          details.value[1].year,
          details.value[1].month,
          details.value[1].day,
          prevEndTime.hour,
          prevEndTime.minute,
          prevEndTime.second
        )
      )
    }
    
    setValue(newValue)
  }

  const startTimeValue = value[0]
    ? `${String(value[0].hour).padStart(2, "0")}:${String(value[0].minute).padStart(2, "0")}`
    : "00:00"

  const endTimeValue = value[1]
    ? `${String(value[1].hour).padStart(2, "0")}:${String(value[1].minute).padStart(2, "0")}`
    : "23:59"

  const onStartTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.currentTarget.value.split(":").map(Number)
    setValue((prev) => {
      const newValue = [...prev]
      if (newValue[0]) {
        newValue[0] = newValue[0].set({ hour: hours || 0, minute: minutes || 0 })
      }
      return newValue
    })
  }

  const onEndTimeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const [hours, minutes] = e.currentTarget.value.split(":").map(Number)
    setValue((prev) => {
      const newValue = [...prev]
      if (newValue[1]) {
        newValue[1] = newValue[1].set({ hour: hours || 0, minute: minutes || 0 })
      }
      return newValue
    })
  }

  const handleApply = () => {
    // Update parent with current selection
    if (value[0]) {
      onStartDateChange(calendarDateTimeToDate(value[0]))
    } else {
      onStartDateChange(null)
    }
    
    if (value[1]) {
      onEndDateChange(calendarDateTimeToDate(value[1]))
    } else {
      onEndDateChange(null)
    }
    
    setOpen(false)
  }

  const formatDate = (date: DateValue) => {
    if ('hour' in date && 'minute' in date) {
      // CalendarDateTime with time
      const month = String(date.month).padStart(2, '0')
      const day = String(date.day).padStart(2, '0')
      const hours = String(date.hour).padStart(2, '0')
      const minutes = String(date.minute).padStart(2, '0')
      return `${month}/${day}/${date.year} ${hours}:${minutes}`
    }
    // Fallback for date only
    const month = String(date.month).padStart(2, '0')
    const day = String(date.day).padStart(2, '0')
    return `${month}/${day}/${date.year}`
  }

  return (
    <DatePicker.Root 
      selectionMode="range" 
      value={value}
      onValueChange={handleValueChange}
      disabled={disabled}
      maxWidth="32rem"
      closeOnSelect={false}
      open={open}
      onOpenChange={(e) => setOpen(e.open)}
      format={formatDate}
    >
      <DatePicker.Control>
        <DatePicker.Input index={0} />
        <DatePicker.Input index={1} />
        <DatePicker.Trigger asChild>
          <IconButton variant="outline" aria-label="Open calendar">
            <LuCalendar />
          </IconButton>
        </DatePicker.Trigger>
      </DatePicker.Control>
      <Portal>
        <DatePicker.Positioner>
          <DatePicker.Content 
            maxW="100dvw" 
            w="fit-content" 
            overflow="auto"
            bg="bg"
            borderColor="rgba(0, 255, 170, 0.3)"
            borderWidth="1px"
            borderRadius="12px"
            boxShadow="0 4px 20px rgba(0, 255, 170, 0.2)"
          >
            <Flex
              px={{ base: "3", sm: "4" }}
              py={{ base: "3", sm: "4" }}
              gap={{ base: "3", sm: "6" }}
              flexDirection={{ base: "column", sm: "row" }}
            >
              <VStack
                align="stretch"
                gap={{ base: "1.5", sm: "2" }}
                minW={{ base: "full", sm: "140px" }}
                height="100%"
              >
                <DatePicker.PresetTrigger value="last7Days" asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    width="100%"
                    _selected={{
                      bg: "rgba(0, 255, 170, 0.2)",
                      borderColor: "rgba(0, 255, 170, 0.6)",
                      color: "teal.400"
                    }}
                  >
                    Last 7 days
                  </Button>
                </DatePicker.PresetTrigger>
                <DatePicker.PresetTrigger value="last30Days" asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    width="100%"
                    _selected={{
                      bg: "rgba(0, 255, 170, 0.2)",
                      borderColor: "rgba(0, 255, 170, 0.6)",
                      color: "teal.400"
                    }}
                  >
                    Last 30 days
                  </Button>
                </DatePicker.PresetTrigger>
                <DatePicker.PresetTrigger value="thisMonth" asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    width="100%"
                    _selected={{
                      bg: "rgba(0, 255, 170, 0.2)",
                      borderColor: "rgba(0, 255, 170, 0.6)",
                      color: "teal.400"
                    }}
                  >
                    This month
                  </Button>
                </DatePicker.PresetTrigger>
                <DatePicker.PresetTrigger value="lastMonth" asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    width="100%"
                    _selected={{
                      bg: "rgba(0, 255, 170, 0.2)",
                      borderColor: "rgba(0, 255, 170, 0.6)",
                      color: "teal.400"
                    }}
                  >
                    Last month
                  </Button>
                </DatePicker.PresetTrigger>
                <DatePicker.PresetTrigger value="thisYear" asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    width="100%"
                    _selected={{
                      bg: "rgba(0, 255, 170, 0.2)",
                      borderColor: "rgba(0, 255, 170, 0.6)",
                      color: "teal.400"
                    }}
                  >
                    This year
                  </Button>
                </DatePicker.PresetTrigger>
                <DatePicker.PresetTrigger value="lastYear" asChild>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    width="100%"
                    _selected={{
                      bg: "rgba(0, 255, 170, 0.2)",
                      borderColor: "rgba(0, 255, 170, 0.6)",
                      color: "teal.400"
                    }}
                  >
                    Last year
                  </Button>
                </DatePicker.PresetTrigger>
              </VStack>
              
              <Flex direction="column" flex="1" minW={0}>
                <DatePicker.View view="day">
                  <DatePicker.Header />
                  <DatePicker.DayTable />
                </DatePicker.View>
                <DatePicker.View view="month">
                  <DatePicker.Header />
                  <DatePicker.MonthTable />
                </DatePicker.View>
                <DatePicker.View view="year">
                  <DatePicker.Header />
                  <DatePicker.YearTable />
                </DatePicker.View>
              </Flex>
              
              {/* Time Selection on the Right */}
              <VStack
                align="stretch"
                gap={3}
                minW="120px"
                borderLeftWidth="1px"
                borderColor="rgba(0, 255, 170, 0.3)"
                pl={4}
              >
                <VStack align="stretch" gap={1}>
                  <Text fontSize="xs" fontWeight="medium" color="gray.400">
                    Start Time
                  </Text>
                  <Input
                    type="time"
                    value={startTimeValue}
                    onChange={onStartTimeChange}
                    size="sm"
                    disabled={!value[0]}
                  />
                </VStack>
                
                <VStack align="stretch" gap={1}>
                  <Text fontSize="xs" fontWeight="medium" color="gray.400">
                    End Time
                  </Text>
                  <Input
                    type="time"
                    value={endTimeValue}
                    onChange={onEndTimeChange}
                    size="sm"
                    disabled={!value[1]}
                  />
                </VStack>
              </VStack>
            </Flex>
            
            {/* Apply Button */}
            <Flex 
              px={{ base: "3", sm: "4" }} 
              pb={{ base: "3", sm: "4" }}
              pt={0}
              borderTopWidth="1px"
              borderColor="rgba(0, 255, 170, 0.3)"
            >
              <Button 
                onClick={handleApply}
                colorPalette="teal"
                width="100%"
                size="sm"
              >
                Apply
              </Button>
            </Flex>
          </DatePicker.Content>
        </DatePicker.Positioner>
      </Portal>
    </DatePicker.Root>
  )
})
