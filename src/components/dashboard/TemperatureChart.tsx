import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, formatTimestamp, sampleData } from "./BaseChart"
import { ChartWithTableWrapper, type Column } from "./ChartWithTableWrapper"
import { DataTable } from "./DataTable"
import type { EChartsOption } from "echarts"
import { memo, useCallback, useMemo } from "react"

interface TemperatureReading {
  label: string
  value: number
}

interface TemperatureChartProps {
  data: Array<{ timestamp: number; temperatures: TemperatureReading[] }>
  height?: number
  showLegend?: boolean
  title?: string
  enableTableView?: boolean
}

// Color palette for different temperature sensors
const TEMP_COLORS: Record<string, string> = {
  sand_side: '#FF6B6B',
  sand_core: '#FFA500',
  water_in: '#4ECDC4',
  water_out: '#45B7D1',
  sand: '#FF6B6B', // fallback for generic sand reading
}

export const TemperatureChart = memo(function TemperatureChart({ 
  data, 
  height = 300, 
  showLegend = true, 
  title = APP_TEXT.DASHBOARD.CHARTS.TEMPERATURE_HISTORY,
  enableTableView = true 
}: TemperatureChartProps) {
  // Extract unique temperature sensor labels
  const sensorLabels = useMemo(() => {
    const labels = new Set<string>()
    data.forEach(point => {
      point.temperatures.forEach(temp => labels.add(temp.label))
    })
    return Array.from(labels).sort()
  }, [data])

  // Format label for display
  const formatLabel = (label: string): string => {
    return label.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ')
  }

  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 500)
    const timestamps = sampledData.map(point => formatTimestamp(point.timestamp))
    
    // Create a series for each temperature sensor
    const series = sensorLabels.map(label => {
      const formattedLabel = formatLabel(label)
      const color = TEMP_COLORS[label] || APP_CONFIG.DASHBOARD.COLORS.TEMPERATURE
      
      return {
        name: `${formattedLabel} (${APP_TEXT.DASHBOARD.UNITS.TEMPERATURE})`,
        type: 'line' as const,
        smooth: true,
        symbol: 'none',
        itemStyle: {
          color,
        },
        lineStyle: {
          color,
          width: 2,
        },
        data: sampledData.map(point => {
          const temp = point.temperatures.find(t => t.label === label)
          return temp?.value ?? null
        }),
        animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
      }
    })
    
    return createBaseChartConfig({
      legend: legend ? {
        data: series.map(s => s.name),
        top: 0,
        textStyle: {
          color: '#aaa',
        },
      } : undefined,
      xAxis: createXAxis(timestamps),
      yAxis: createYAxis(APP_TEXT.DASHBOARD.UNITS.TEMPERATURE),
      series,
    })
  }, [sensorLabels])

  // Flatten data for table view
  const flattenedData = useMemo(() => {
    return data.flatMap(point => 
      point.temperatures.map(temp => ({
        timestamp: point.timestamp,
        sensor: formatLabel(temp.label),
        value: temp.value,
      }))
    )
  }, [data])

  const tableColumns: Column[] = [
    { key: 'timestamp', label: 'Time' },
    { key: 'sensor', label: 'Sensor' },
    { key: 'value', label: 'Temperature', unit: APP_TEXT.DASHBOARD.UNITS.TEMPERATURE },
  ]

  const chartComponent = <BaseChart data={data} height={height} showLegend={showLegend} getOption={getOption} />
  const tableComponent = <DataTable data={flattenedData} columns={tableColumns} height={height} />

  if (!enableTableView) {
    return (
      <BaseChart data={data} height={height} showLegend={showLegend} title={title} getOption={getOption} />
    )
  }

  return (
    <ChartWithTableWrapper
      title={title}
      chartComponent={chartComponent}
      tableComponent={tableComponent}
    />
  )
})
