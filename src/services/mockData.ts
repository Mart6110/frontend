// Mock Data Service for Dashboard Visualizations
// This simulates real-time data from a sand battery system

export interface DataPoint {
  timestamp: number
  value: number
}

export interface TemperatureData {
  timestamp: number
  temperature: number
}

export interface EnergyData {
  timestamp: number
  energyIn: number
  energyOut: number
}

export interface FlowData {
  timestamp: number
  flow: number
}

export interface PumpStatus {
  timestamp: number
  active: boolean
}

export interface SystemEvent {
  id: string
  timestamp: number
  type: 'pump' | 'temperature' | 'energy' | 'error' | 'warning'
  message: string
  severity: 'info' | 'warning' | 'error'
}

export interface DashboardData {
  currentTemperature: number
  currentEnergyIn: number
  currentEnergyOut: number
  currentEfficiency: number
  currentFlow: number
  isPumpActive: boolean
  stateOfCharge: number
  currentPower: number
  temperatureHistory: TemperatureData[]
  energyHistory: EnergyData[]
  flowHistory: FlowData[]
  pumpHistory: PumpStatus[]
  events: SystemEvent[]
}

class MockDataService {
  private baseTemperature = 600
  private baseFlow = 50
  private baseEnergy = 100
  private eventIdCounter = 0

  // Generate historical data for initial load
  generateHistoricalData(hours: number): DashboardData {
    const now = Date.now()
    const interval = 60000 // 1 minute intervals
    const points = Math.min((hours * 60), 500) // Max 500 points
    
    const temperatureHistory: TemperatureData[] = []
    const energyHistory: EnergyData[] = []
    const flowHistory: FlowData[] = []
    const pumpHistory: PumpStatus[] = []
    const events: SystemEvent[] = []

    for (let i = points; i >= 0; i--) {
      const timestamp = now - (i * interval)
      
      // Simulate temperature variations (550-650°C range)
      const tempVariation = Math.sin(i / 10) * 25 + Math.random() * 10
      const temperature = this.baseTemperature + tempVariation
      
      temperatureHistory.push({ timestamp, temperature: Number(temperature.toFixed(1)) })
      
      // Simulate energy transfer with some correlation to temperature
      const energyIn = this.baseEnergy + Math.random() * 30 - 10
      const energyOut = energyIn * (0.8 + Math.random() * 0.15) // 80-95% efficiency
      energyHistory.push({ 
        timestamp, 
        energyIn: Number(energyIn.toFixed(2)), 
        energyOut: Number(energyOut.toFixed(2)) 
      })
      
      // Simulate flow rate
      const flow = this.baseFlow + Math.random() * 20 - 10
      flowHistory.push({ timestamp, flow: Number(flow.toFixed(1)) })
      
      // Simulate pump on/off cycles
      const pumpActive = Math.sin(i / 20) > -0.5
      pumpHistory.push({ timestamp, active: pumpActive })
      
      // Generate some events
      if (i % 30 === 0) {
        events.push(this.generateEvent(timestamp, pumpActive))
      }
    }

    const latestTemp = temperatureHistory[temperatureHistory.length - 1].temperature
    const latestEnergy = energyHistory[energyHistory.length - 1]
    const latestFlow = flowHistory[flowHistory.length - 1].flow
    const latestPump = pumpHistory[pumpHistory.length - 1].active

    return {
      currentTemperature: latestTemp,
      currentEnergyIn: latestEnergy.energyIn,
      currentEnergyOut: latestEnergy.energyOut,
      currentEfficiency: Number(((latestEnergy.energyOut / latestEnergy.energyIn) * 100).toFixed(1)),
      currentFlow: latestFlow,
      isPumpActive: latestPump,
      stateOfCharge: 75 + Math.random() * 20,
      currentPower: latestEnergy.energyIn * (latestPump ? 1 : 0),
      temperatureHistory,
      energyHistory,
      flowHistory,
      pumpHistory,
      events: events.reverse(), // Most recent first
    }
  }

  // Generate a single real-time update
  generateRealtimeUpdate(previousData: DashboardData): DashboardData {
    const now = Date.now()
    
    // Add small variations to current values
    const temperatureChange = (Math.random() - 0.5) * 2
    const currentTemperature = Number((previousData.currentTemperature + temperatureChange).toFixed(1))
    
    const energyInChange = (Math.random() - 0.5) * 5
    const currentEnergyIn = Number((previousData.currentEnergyIn + energyInChange).toFixed(2))
    const currentEnergyOut = Number((currentEnergyIn * (0.85 + Math.random() * 0.1)).toFixed(2))
    
    const flowChange = (Math.random() - 0.5) * 3
    const currentFlow = Number(Math.max(0, previousData.currentFlow + flowChange).toFixed(1))
    
    // Randomly toggle pump (10% chance)
    const isPumpActive = Math.random() > 0.1 ? previousData.isPumpActive : !previousData.isPumpActive
    
    // Update histories (keep last 500 points)
    const temperatureHistory = [
      ...previousData.temperatureHistory.slice(-499),
      { timestamp: now, temperature: currentTemperature }
    ]
    
    const energyHistory = [
      ...previousData.energyHistory.slice(-499),
      { timestamp: now, energyIn: currentEnergyIn, energyOut: currentEnergyOut }
    ]
    
    const flowHistory = [
      ...previousData.flowHistory.slice(-499),
      { timestamp: now, flow: currentFlow }
    ]
    
    const pumpHistory = [
      ...previousData.pumpHistory.slice(-499),
      { timestamp: now, active: isPumpActive }
    ]
    
    // Generate event if pump status changed
    let events = [...previousData.events]
    if (isPumpActive !== previousData.isPumpActive) {
      const newEvent = this.generateEvent(now, isPumpActive)
      events = [newEvent, ...events.slice(0, 999)] // Keep last 1000 events
    }
    
    // Random events (5% chance)
    if (Math.random() < 0.05) {
      events = [this.generateRandomEvent(now, currentTemperature), ...events.slice(0, 999)]
    }

    return {
      currentTemperature,
      currentEnergyIn,
      currentEnergyOut,
      currentEfficiency: Number(((currentEnergyOut / currentEnergyIn) * 100).toFixed(1)),
      currentFlow,
      isPumpActive,
      stateOfCharge: Math.max(10, Math.min(95, previousData.stateOfCharge + (Math.random() - 0.5) * 2)),
      currentPower: isPumpActive ? currentEnergyIn : 0,
      temperatureHistory,
      energyHistory,
      flowHistory,
      pumpHistory,
      events,
    }
  }

  private generateEvent(timestamp: number, pumpActive: boolean): SystemEvent {
    const id = `event-${this.eventIdCounter++}-${timestamp}`
    
    if (pumpActive) {
      return {
        id,
        timestamp,
        type: 'pump',
        message: 'Pump Started',
        severity: 'info',
      }
    } else {
      return {
        id,
        timestamp,
        type: 'pump',
        message: 'Pump Stopped',
        severity: 'info',
      }
    }
  }

  private generateRandomEvent(timestamp: number, temperature: number): SystemEvent {
    const id = `event-${this.eventIdCounter++}-${timestamp}`
    const eventTypes = [
      { type: 'energy' as const, message: 'Charging Started', severity: 'info' as const },
      { type: 'energy' as const, message: 'Discharging Started', severity: 'info' as const },
      { type: 'temperature' as const, message: `Temperature: ${temperature.toFixed(1)}°C`, severity: 'info' as const },
      { type: 'warning' as const, message: 'High Temperature Warning', severity: 'warning' as const },
    ]
    
    const selectedEvent = eventTypes[Math.floor(Math.random() * eventTypes.length)]
    
    return {
      id,
      timestamp,
      ...selectedEvent,
    }
  }

  // Filter events by type
  filterEvents(events: SystemEvent[], types?: string[]): SystemEvent[] {
    if (!types || types.length === 0) return events
    return events.filter(event => types.includes(event.type))
  }

  // Get data for specific time range
  getDataForTimeRange(allData: DashboardData, rangeMs: number): DashboardData {
    const cutoffTime = Date.now() - rangeMs
    
    return {
      ...allData,
      temperatureHistory: allData.temperatureHistory.filter(d => d.timestamp >= cutoffTime),
      energyHistory: allData.energyHistory.filter(d => d.timestamp >= cutoffTime),
      flowHistory: allData.flowHistory.filter(d => d.timestamp >= cutoffTime),
      pumpHistory: allData.pumpHistory.filter(d => d.timestamp >= cutoffTime),
      events: allData.events.filter(e => e.timestamp >= cutoffTime),
    }
  }
}

export const mockDataService = new MockDataService()
