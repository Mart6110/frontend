import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, formatTimestamp, sampleData } from "./BaseChart"
import { ChartWithTableWrapper, type Column } from "./ChartWithTableWrapper"
import { DataTable } from "./DataTable"
import type { EChartsOption } from "echarts"
import { memo, useCallback } from "react"

interface FlowChartProps {
  data: Array<{ timestamp: number; flow: number }>
  height?: number
  showLegend?: boolean
  title?: string
  enableTableView?: boolean
}

export const FlowChart = memo(function FlowChart({ 
  data, 
  height = 300, 
  showLegend = true, 
  title = APP_TEXT.DASHBOARD.CHARTS.FLOW_RATE,
  enableTableView = true 
}: FlowChartProps) {
  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 5000)
    const timestamps = sampledData.map(point => formatTimestamp(point.timestamp))
    
    return createBaseChartConfig({
      legend: legend ? {
        data: [`${APP_TEXT.DASHBOARD.KPI.FLOW_RATE} (${APP_TEXT.DASHBOARD.UNITS.FLOW})`],
        top: 0,
        textStyle: {
          color: '#aaa',
        },
      } : undefined,
      xAxis: createXAxis(timestamps),
      yAxis: createYAxis(APP_TEXT.DASHBOARD.UNITS.FLOW),
      series: [
        {
          name: `${APP_TEXT.DASHBOARD.KPI.FLOW_RATE} (${APP_TEXT.DASHBOARD.UNITS.FLOW})`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          itemStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.FLOW,
          },
          lineStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.FLOW,
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
                { offset: 0, color: `${APP_CONFIG.DASHBOARD.COLORS.FLOW}40` },
                { offset: 1, color: `${APP_CONFIG.DASHBOARD.COLORS.FLOW}00` },
              ],
            },
          },
          data: sampledData.map(point => point.flow),
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
      ],
    })
  }, [])

  const tableColumns: Column[] = [
    { key: 'timestamp', label: 'Time' },
    { key: 'flow', label: APP_TEXT.DASHBOARD.KPI.FLOW_RATE, unit: APP_TEXT.DASHBOARD.UNITS.FLOW },
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
