import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, formatTimestamp, sampleData } from "./BaseChart"
import { ChartWithTableWrapper, type Column } from "./ChartWithTableWrapper"
import { DataTable } from "./DataTable"
import type { EChartsOption } from "echarts"
import { memo, useCallback, useMemo } from "react"

interface EfficiencyChartProps {
  data: Array<{ timestamp: number; energyIn: number; energyOut: number }>
  height?: number
  showLegend?: boolean
  title?: string
  enableTableView?: boolean
}

export const EfficiencyChart = memo(function EfficiencyChart({ 
  data, 
  height = 300, 
  showLegend = true, 
  title = APP_TEXT.DASHBOARD.CHARTS.EFFICIENCY_TREND,
  enableTableView = true 
}: EfficiencyChartProps) {
  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 500)
    const timestamps = sampledData.map(point => formatTimestamp(point.timestamp))
    
    // Calculate efficiency for each data point
    const efficiencyData = sampledData.map(point => {
      const efficiency = point.energyIn > 0 ? (point.energyOut / point.energyIn) * 100 : 0
      return Number(efficiency.toFixed(1))
    })
    
    return createBaseChartConfig({
      tooltip: {
        trigger: 'axis',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderColor: 'rgba(0, 255, 170, 0.3)',
        borderWidth: 1,
        textStyle: {
          color: '#fff',
        },
        formatter: (params: any) => {
          const value = params[0].value
          return `${params[0].name}<br/>${params[0].seriesName}: ${value}%`
        },
      },
      legend: legend ? {
        data: [`${APP_TEXT.DASHBOARD.KPI.EFFICIENCY} (${APP_TEXT.DASHBOARD.UNITS.EFFICIENCY})`],
        top: 0,
        textStyle: {
          color: '#888',
        },
      } : undefined,
      xAxis: createXAxis(timestamps),
      yAxis: {
        ...createYAxis(APP_TEXT.DASHBOARD.UNITS.EFFICIENCY),
        min: 0,
        max: 100,
      },
      series: [
        {
          name: `${APP_TEXT.DASHBOARD.KPI.EFFICIENCY} (${APP_TEXT.DASHBOARD.UNITS.EFFICIENCY})`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.EFFICIENCY,
            width: 2,
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                { offset: 0, color: `${APP_CONFIG.DASHBOARD.COLORS.EFFICIENCY}40` },
                { offset: 1, color: `${APP_CONFIG.DASHBOARD.COLORS.EFFICIENCY}00` },
              ],
            },
          },
          data: efficiencyData,
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
      ],
    })
  }, [])

  // Prepare data with calculated efficiency for table view
  const tableData = useMemo(() => 
    data.map(point => ({
      timestamp: point.timestamp,
      energyIn: point.energyIn,
      energyOut: point.energyOut,
      efficiency: point.energyIn > 0 ? (point.energyOut / point.energyIn) * 100 : 0
    })),
    [data]
  )

  const tableColumns: Column[] = [
    { key: 'timestamp', label: 'Time' },
    { key: 'energyIn', label: APP_TEXT.DASHBOARD.KPI.ENERGY_IN, unit: APP_TEXT.DASHBOARD.UNITS.ENERGY },
    { key: 'energyOut', label: APP_TEXT.DASHBOARD.KPI.ENERGY_OUT, unit: APP_TEXT.DASHBOARD.UNITS.ENERGY },
    { key: 'efficiency', label: APP_TEXT.DASHBOARD.KPI.EFFICIENCY, unit: APP_TEXT.DASHBOARD.UNITS.EFFICIENCY },
  ]

  const chartComponent = <BaseChart data={data} height={height} showLegend={showLegend} getOption={getOption} />
  const tableComponent = <DataTable data={tableData} columns={tableColumns} height={height} />

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
