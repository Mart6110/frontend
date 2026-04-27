import * as XLSX from 'xlsx'
import type { DashboardData } from '@/services/dataTransform'

// Format timestamp to readable date string
function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
}

export function exportDashboardToExcel(data: DashboardData, filename: string = 'dashboard-export') {
  // Create a new workbook
  const workbook = XLSX.utils.book_new()

  // Sheet 1: Current Status Summary
  const summaryData = [
    ['Sand Battery Dashboard Export'],
    ['Export Date', new Date().toLocaleString()],
    [],
    ['Current Metrics'],
    ['Sand Temperature (°C)', data.currentTemperature.toFixed(1)],
    ['Water Temp In (°C)', data.currentWaterTempIn.toFixed(1)],
    ['Water Temp Out (°C)', data.currentWaterTempOut.toFixed(1)],
    ['Flow (L/min)', data.currentFlow.toFixed(1)],
    ['Power (W)', data.currentPower.toFixed(0)],
    ['Energy (kWh)', data.currentEnergy.toFixed(2)],
    ['Pump Status', data.isPumpActive ? 'Active' : 'Inactive'],
  ]
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')

  // Sheet 2: Temperature History
  const temperatureData = [
    ['Timestamp', 'Temperature (°C)'],
    ...data.temperatureHistory.map(item => [
      formatTimestamp(item.timestamp),
      item.temperature,
    ]),
  ]
  const temperatureSheet = XLSX.utils.aoa_to_sheet(temperatureData)
  XLSX.utils.book_append_sheet(workbook, temperatureSheet, 'Temperature')

  // Sheet 3: Energy History
  const energyData = [
    ['Timestamp', 'Power (kW)', 'Energy (kWh)'],
    ...data.energyHistory.map(item => [
      formatTimestamp(item.timestamp),
      item.energyIn.toFixed(3),
      item.energyOut.toFixed(2),
    ]),
  ]
  const energySheet = XLSX.utils.aoa_to_sheet(energyData)
  XLSX.utils.book_append_sheet(workbook, energySheet, 'Energy')

  // Sheet 4: Flow History
  const flowData = [
    ['Timestamp', 'Flow (L/min)'],
    ...data.flowHistory.map(item => [
      formatTimestamp(item.timestamp),
      item.flow,
    ]),
  ]
  const flowSheet = XLSX.utils.aoa_to_sheet(flowData)
  XLSX.utils.book_append_sheet(workbook, flowSheet, 'Flow')

  // Sheet 5: Pump Status History
  const pumpData = [
    ['Timestamp', 'Status'],
    ...data.pumpHistory.map(item => [
      formatTimestamp(item.timestamp),
      item.active ? 'Active' : 'Inactive',
    ]),
  ]
  const pumpSheet = XLSX.utils.aoa_to_sheet(pumpData)
  XLSX.utils.book_append_sheet(workbook, pumpSheet, 'Pump Status')

  // Sheet 6: System Events
  const eventsData = [
    ['Timestamp', 'Type', 'Severity', 'Message'],
    ...data.events.map(event => [
      formatTimestamp(event.timestamp),
      event.type,
      event.severity,
      event.message,
    ]),
  ]
  const eventsSheet = XLSX.utils.aoa_to_sheet(eventsData)
  XLSX.utils.book_append_sheet(workbook, eventsSheet, 'Events')

  // Generate Excel file
  XLSX.writeFile(workbook, `${filename}.xlsx`)
}

export function exportDashboardToCSV(data: DashboardData, filename: string = 'dashboard-export') {
  // Combine all data into a single comprehensive CSV
  const headers = [
    'Timestamp',
    'Temperature (°C)',
    'Energy In (kWh)',
    'Energy Out (kWh)',
    'Flow (L/min)',
    'Pump Active',
  ]

  // Create a comprehensive data map
  const dataMap = new Map<number, any>()

  // Add temperature data
  data.temperatureHistory.forEach(item => {
    if (!dataMap.has(item.timestamp)) {
      dataMap.set(item.timestamp, { timestamp: item.timestamp })
    }
    dataMap.get(item.timestamp)!.temperature = item.temperature
  })

  // Add energy data
  data.energyHistory.forEach(item => {
    if (!dataMap.has(item.timestamp)) {
      dataMap.set(item.timestamp, { timestamp: item.timestamp })
    }
    const entry = dataMap.get(item.timestamp)!
    entry.energyIn = item.energyIn
    entry.energyOut = item.energyOut
  })

  // Add flow data
  data.flowHistory.forEach(item => {
    if (!dataMap.has(item.timestamp)) {
      dataMap.set(item.timestamp, { timestamp: item.timestamp })
    }
    dataMap.get(item.timestamp)!.flow = item.flow
  })

  // Add pump status
  data.pumpHistory.forEach(item => {
    if (!dataMap.has(item.timestamp)) {
      dataMap.set(item.timestamp, { timestamp: item.timestamp })
    }
    dataMap.get(item.timestamp)!.pumpActive = item.active
  })

  // Sort by timestamp and convert to CSV
  const sortedData = Array.from(dataMap.values()).sort((a, b) => a.timestamp - b.timestamp)

  const csvRows = [
    headers.join(','),
    ...sortedData.map(row => [
      formatTimestamp(row.timestamp),
      row.temperature ?? '',
      row.energyIn ?? '',
      row.energyOut ?? '',
      row.flow ?? '',
      row.pumpActive !== undefined ? (row.pumpActive ? 'Yes' : 'No') : '',
    ].join(',')),
  ]

  // Create and download CSV
  const csvContent = csvRows.join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}
