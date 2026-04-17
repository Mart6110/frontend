import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, formatTimestamp, sampleData } from "./BaseChart"
import type { EChartsOption } from "echarts"
import { memo, useCallback } from "react"

interface TemperatureChartProps {
  data: Array<{ timestamp: number; temperature: number }>
  height?: number
  showLegend?: boolean
  title?: string
}

export const TemperatureChart = memo(function TemperatureChart({ data, height = 300, showLegend = true, title = APP_TEXT.DASHBOARD.CHARTS.TEMPERATURE_HISTORY }: TemperatureChartProps) {
  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 500)
    const timestamps = sampledData.map(point => formatTimestamp(point.timestamp))
    
    return createBaseChartConfig({
      legend: legend ? {
        data: [`${APP_TEXT.DASHBOARD.KPI.TEMPERATURE} (${APP_TEXT.DASHBOARD.UNITS.TEMPERATURE})`],
        top: 0,
        textStyle: {
          color: '#888',
        },
      } : undefined,
      xAxis: createXAxis(timestamps),
      yAxis: createYAxis(APP_TEXT.DASHBOARD.UNITS.TEMPERATURE),
      series: [
        {
          name: `${APP_TEXT.DASHBOARD.KPI.TEMPERATURE} (${APP_TEXT.DASHBOARD.UNITS.TEMPERATURE})`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.TEMPERATURE,
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
                { offset: 0, color: `${APP_CONFIG.DASHBOARD.COLORS.TEMPERATURE}40` },
                { offset: 1, color: `${APP_CONFIG.DASHBOARD.COLORS.TEMPERATURE}00` },
              ],
            },
          },
          data: sampledData.map(point => point.temperature),
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
      ],
    })
  }, [])

  return <BaseChart data={data} height={height} showLegend={showLegend} title={title} getOption={getOption} />
})
