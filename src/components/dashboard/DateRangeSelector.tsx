import { Button, DatePicker, Flex, Portal, VStack, Input, Text, IconButton } from "@chakra-ui/react"
import { LuCalendar } from "react-icons/lu"
import { useState, memo, useMemo, useEffect } from "react"
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

  // Initialize local value from props
  const initialValue = useMemo(() => {
    const newValue: CalendarDateTime[] = []
    const startDateTime = dateToCalendarDateTime(startDate)
    const endDateTime = dateToCalendarDateTime(endDate)
    
    if (startDateTime) newValue.push(startDateTime)
    if (endDateTime) newValue.push(endDateTime)
    
    return newValue
  }, [startDate, endDate])

  // Local state for date picker UI (before applying)
  const [value, setValue] = useState<CalendarDateTime[]>(initialValue)

  // Sync local state when picker opens (reset to prop values)
  useEffect(() => {
    if (open) {
      // When opening, reset to current prop values
      // We don't track initialValue changes to avoid interfering with user edits
      const newValue: CalendarDateTime[] = []
      const startDateTime = dateToCalendarDateTime(startDate)
      const endDateTime = dateToCalendarDateTime(endDate)
      
      if (startDateTime) newValue.push(startDateTime)
      if (endDateTime) newValue.push(endDateTime)
      
      setValue(newValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

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

  const handlePreset = (days: number, type: 'last' | 'thisMonth' | 'lastMonth') => {
    const now = new Date()
    let start: CalendarDateTime
    let end: CalendarDateTime
    
    if (type === 'last') {
      // Last N days
      const startDate = new Date(now)
      startDate.setDate(startDate.getDate() - days)
      startDate.setHours(0, 0, 0, 0)
      
      start = new CalendarDateTime(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        startDate.getDate(),
        0, 0, 0
      )
      end = new CalendarDateTime(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        23, 59, 59
      )
    } else if (type === 'thisMonth') {
      // This month
      const startDate = new Date(now.getFullYear(), now.getMonth(), 1)
      start = new CalendarDateTime(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        1,
        0, 0, 0
      )
      end = new CalendarDateTime(
        now.getFullYear(),
        now.getMonth() + 1,
        now.getDate(),
        23, 59, 59
      )
    } else {
      // Last month
      const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
      const lastDayOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0)
      
      start = new CalendarDateTime(
        lastMonth.getFullYear(),
        lastMonth.getMonth() + 1,
        1,
        0, 0, 0
      )
      end = new CalendarDateTime(
        lastDayOfLastMonth.getFullYear(),
        lastDayOfLastMonth.getMonth() + 1,
        lastDayOfLastMonth.getDate(),
        23, 59, 59
      )
    }
    
    setValue([start, end])
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
        <DatePicker.Trigger asChild unstyled>
          <IconButton variant="outline" size={'sm'}>
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
              px={{ base: "2", sm: "3" }}
              py={{ base: "2", sm: "3" }}
              gap={{ base: "2", sm: "3" }}
              flexDirection={{ base: "column", sm: "row" }}
            >
              <VStack
                align="stretch"
                gap={{ base: "1", sm: "1.5" }}
                minW={{ base: "full", sm: "110px" }}
                height="100%"
              >
                <Button 
                  variant="outline" 
                  size="xs" 
                  width="100%"
                  onClick={() => handlePreset(7, 'last')}
                >
                  Last 7 days
                </Button>
                <Button 
                  variant="outline" 
                  size="xs" 
                  width="100%"
                  onClick={() => handlePreset(30, 'last')}
                >
                  Last 30 days
                </Button>
                <Button 
                  variant="outline" 
                  size="xs" 
                  width="100%"
                  onClick={() => handlePreset(0, 'thisMonth')}
                >
                  This month
                </Button>
                <Button 
                  variant="outline" 
                  size="xs" 
                  width="100%"
                  onClick={() => handlePreset(0, 'lastMonth')}
                >
                  Last month
                </Button>
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
                gap={2}
                minW="100px"
                borderLeftWidth="1px"
                borderColor="rgba(0, 255, 170, 0.3)"
                pl={3}
              >
                <VStack align="stretch" gap={0.5}>
                  <Text fontSize="2xs" fontWeight="medium" color="gray.400">
                    Start Time
                  </Text>
                  <Input
                    type="time"
                    value={startTimeValue}
                    onChange={onStartTimeChange}
                    size="xs"
                    disabled={!value[0]}
                  />
                </VStack>
                
                <VStack align="stretch" gap={0.5}>
                  <Text fontSize="2xs" fontWeight="medium" color="gray.400">
                    End Time
                  </Text>
                  <Input
                    type="time"
                    value={endTimeValue}
                    onChange={onEndTimeChange}
                    size="xs"
                    disabled={!value[1]}
                  />
                </VStack>
              </VStack>
            </Flex>
            
            {/* Apply Button */}
            <Flex 
              px={{ base: "2", sm: "3" }} 
              pb={{ base: "2", sm: "3" }}
              pt={2}
              borderTopWidth="1px"
              borderColor="rgba(0, 255, 170, 0.3)"
            >
              <Button 
                onClick={handleApply}
                colorPalette="teal"
                width="100%"
                size="xs"
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
