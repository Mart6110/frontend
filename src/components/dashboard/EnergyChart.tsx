import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, formatTimestamp, sampleData } from "./BaseChart"
import { ChartWithTableWrapper, type Column } from "./ChartWithTableWrapper"
import { DataTable } from "./DataTable"
import type { EChartsOption } from "echarts"
import { memo, useCallback } from "react"

interface EnergyChartProps {
  data: Array<{ timestamp: number; energyIn: number; energyOut: number }>
  height?: number
  showLegend?: boolean
  title?: string
  enableTableView?: boolean
}

export const EnergyChart = memo(function EnergyChart({ 
  data, 
  height = 300, 
  showLegend = true, 
  title = APP_TEXT.DASHBOARD.CHARTS.ENERGY_TRANSFER,
  enableTableView = true 
}: EnergyChartProps) {
  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 5000)
    const timestamps = sampledData.map(point => formatTimestamp(point.timestamp))
    
    return createBaseChartConfig({
      legend: legend ? {
        data: [
          `${APP_TEXT.DASHBOARD.KPI.ENERGY} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
        ],
        top: 0,
        textStyle: {
          color: '#aaa',
        },
      } : undefined,
      xAxis: createXAxis(timestamps),
      yAxis: createYAxis(APP_TEXT.DASHBOARD.UNITS.ENERGY),
      series: [
        {
          name: `${APP_TEXT.DASHBOARD.KPI.ENERGY} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.ENERGY_IN,
          },
          lineStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.ENERGY_IN,
            width: 2,
          },
          data: sampledData.map(point => point.energyOut),
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
      ],
    })
  }, [])

  const tableColumns: Column[] = [
    { key: 'timestamp', label: 'Time' },
    { key: 'energyOut', label: APP_TEXT.DASHBOARD.KPI.ENERGY, unit: APP_TEXT.DASHBOARD.UNITS.ENERGY },
  ]

  const chartComponent = <BaseChart data={data} height={height} showLegend={showLegend} getOption={getOption} />
  const tableComponent = <DataTable data={data} columns={tableColumns} height={height} />

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
