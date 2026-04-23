import { Box, Text, VStack, HStack, Spinner } from '@chakra-ui/react'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import {
  useGetLatestDataQuery,
  useGetHistoryDataQuery,
  useGetControlStatusQuery,
  useGetSettingsQuery,
  useGetElectricityPriceQuery,
  useGetEventsQuery,
  useGetAlertsQuery,
  useControlPumpMutation,
  useControlHeaterMutation,
  useUpdateSettingsMutation,
  useAcknowledgeAlertMutation,
} from '@/store/apiSlice'

/**
 * API Tester Component
 * 
 * Tests all API endpoints and logs responses to console
 */
export function ApiTester() {
  // === QUERIES ===
  
  const latestData = useGetLatestDataQuery()
  
  const historyData = useGetHistoryDataQuery({
    from: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    to: new Date().toISOString(),
    interval: '1h',
    limit: 100,
  }, { skip: true }) // Skip by default, trigger manually
  
  const controlStatus = useGetControlStatusQuery(undefined, { skip: true })
  
  const settings = useGetSettingsQuery(undefined, { skip: true })
  
  const electricityPrice = useGetElectricityPriceQuery({
    area: 'DK2',
  }, { skip: true })
  
  const events = useGetEventsQuery({
    limit: 50,
  }, { skip: true })
  
  const alerts = useGetAlertsQuery(undefined, { skip: true })
  
  // === MUTATIONS ===
  
  const [controlPump] = useControlPumpMutation()
  const [controlHeater] = useControlHeaterMutation()
  const [updateSettings] = useUpdateSettingsMutation()
  const [acknowledgeAlert] = useAcknowledgeAlertMutation()
  
  // Log latest data whenever it changes
  useEffect(() => {
    if (latestData.data) {
      console.log('📊 GET /data/latest:', latestData.data)
    }
    if (latestData.error) {
      console.error('❌ GET /data/latest ERROR:', latestData.error)
    }
  }, [latestData.data, latestData.error])
  
  useEffect(() => {
    if (historyData.data) {
      console.log('📈 GET /data/history:', historyData.data)
    }
    if (historyData.error) {
      console.error('❌ GET /data/history ERROR:', historyData.error)
    }
  }, [historyData.data, historyData.error])
  
  useEffect(() => {
    if (controlStatus.data) {
      console.log('🎛️ GET /control/status:', controlStatus.data)
    }
    if (controlStatus.error) {
      console.error('❌ GET /control/status ERROR:', controlStatus.error)
    }
  }, [controlStatus.data, controlStatus.error])
  
  useEffect(() => {
    if (settings.data) {
      console.log('⚙️ GET /settings:', settings.data)
    }
    if (settings.error) {
      console.error('❌ GET /settings ERROR:', settings.error)
    }
  }, [settings.data, settings.error])
  
  useEffect(() => {
    if (electricityPrice.data) {
      console.log('⚡ GET /settings/electricity-price:', electricityPrice.data)
    }
    if (electricityPrice.error) {
      console.error('❌ GET /settings/electricity-price ERROR:', electricityPrice.error)
    }
  }, [electricityPrice.data, electricityPrice.error])
  
  useEffect(() => {
    if (events.data) {
      console.log('📋 GET /events:', events.data)
    }
    if (events.error) {
      console.error('❌ GET /events ERROR:', events.error)
    }
  }, [events.data, events.error])
  
  useEffect(() => {
    if (alerts.data) {
      console.log('🚨 GET /events/alerts:', alerts.data)
    }
    if (alerts.error) {
      console.error('❌ GET /events/alerts ERROR:', alerts.error)
    }
  }, [alerts.data, alerts.error])
  
  // Mutation handlers
  const testControlPump = async (action: 'start' | 'stop') => {
    try {
      const result = await controlPump({ action, source: 'manual' }).unwrap()
      console.log(`🚰 POST /control/pump (${action}):`, result)
    } catch (error) {
      console.error(`❌ POST /control/pump (${action}) ERROR:`, error)
    }
  }
  
  const testControlHeater = async (action: 'on' | 'off') => {
    try {
      const result = await controlHeater({ action, source: 'manual' }).unwrap()
      console.log(`🔥 POST /control/heater (${action}):`, result)
    } catch (error) {
      console.error(`❌ POST /control/heater (${action}) ERROR:`, error)
    }
  }
  
  const testUpdateSettings = async () => {
    try {
      const result = await updateSettings({
        auto_heating_enabled: true,
        auto_pump_enabled: true,
      }).unwrap()
      console.log('⚙️ PUT /settings:', result)
    } catch (error) {
      console.error('❌ PUT /settings ERROR:', error)
    }
  }
  
  const testAcknowledgeAlert = async (alertId: number) => {
    try {
      const result = await acknowledgeAlert(alertId).unwrap()
      console.log(`✅ POST /events/alerts/${alertId}/acknowledge:`, result)
    } catch (error) {
      console.error(`❌ POST /events/alerts/${alertId}/acknowledge ERROR:`, error)
    }
  }

  return (
    <Box w="full" p={4} borderRadius="md" bg="purple.500/10" borderWidth="1px" borderColor="purple.500">
      <Text fontSize="sm" fontWeight="bold" color="purple.500" mb={3}>
        🧪 API Endpoint Tester
      </Text>
      
      <VStack align="start" gap={2}>
        {/* Queries */}
        <Text fontSize="xs" fontWeight="bold">QUERIES (Check Console)</Text>
        
        <HStack gap={2} flexWrap="wrap">
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => latestData.refetch()}
            loading={latestData.isLoading}
          >
            GET /data/latest
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => historyData.refetch()}
            loading={historyData.isLoading}
          >
            GET /data/history
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => controlStatus.refetch()}
            loading={controlStatus.isLoading}
          >
            GET /control/status
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => settings.refetch()}
            loading={settings.isLoading}
          >
            GET /settings
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => electricityPrice.refetch()}
            loading={electricityPrice.isLoading}
          >
            GET /electricity-price
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => events.refetch()}
            loading={events.isLoading}
          >
            GET /events
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="blue"
            onClick={() => alerts.refetch()}
            loading={alerts.isLoading}
          >
            GET /alerts
          </Button>
        </HStack>
        
        {/* Mutations */}
        <Text fontSize="xs" fontWeight="bold" mt={2}>MUTATIONS (Check Console)</Text>
        
        <HStack gap={2} flexWrap="wrap">
          <Button 
            size="xs" 
            colorPalette="green"
            onClick={() => testControlPump('start')}
          >
            Pump START
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="red"
            onClick={() => testControlPump('stop')}
          >
            Pump STOP
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="orange"
            onClick={() => testControlHeater('on')}
          >
            Heater ON
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="gray"
            onClick={() => testControlHeater('off')}
          >
            Heater OFF
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="purple"
            onClick={testUpdateSettings}
          >
            Update Settings
          </Button>
          
          <Button 
            size="xs" 
            colorPalette="cyan"
            onClick={() => testAcknowledgeAlert(1)}
          >
            Ack Alert #1
          </Button>
        </HStack>
        
        {/* Latest data display */}
        {latestData.isLoading && (
          <HStack gap={2}>
            <Spinner size="xs" />
            <Text fontSize="xs">Loading latest data...</Text>
          </HStack>
        )}
        
        {latestData.data && (
          <Box fontSize="xs" color="green.500">
            ✅ Latest: {latestData.data.sand_temp}°C | {latestData.data.status}
          </Box>
        )}
        
        {latestData.error && (
          <Box fontSize="xs" color="red.500">
            ❌ Error loading data
          </Box>
        )}
      </VStack>
    </Box>
  )
}
