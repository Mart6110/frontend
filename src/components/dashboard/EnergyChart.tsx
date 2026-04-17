import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, formatTimestamp, sampleData } from "./BaseChart"
import type { EChartsOption } from "echarts"
import { memo, useCallback } from "react"

interface EnergyChartProps {
  data: Array<{ timestamp: number; energyIn: number; energyOut: number }>
  height?: number
  showLegend?: boolean
  title?: string
}

export const EnergyChart = memo(function EnergyChart({ data, height = 300, showLegend = true, title = APP_TEXT.DASHBOARD.CHARTS.ENERGY_TRANSFER }: EnergyChartProps) {
  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 500)
    const timestamps = sampledData.map(point => formatTimestamp(point.timestamp))
    
    return createBaseChartConfig({
      legend: legend ? {
        data: [
          `${APP_TEXT.DASHBOARD.KPI.ENERGY_IN} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
          `${APP_TEXT.DASHBOARD.KPI.ENERGY_OUT} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
        ],
        top: 0,
        textStyle: {
          color: '#888',
        },
      } : undefined,
      xAxis: createXAxis(timestamps),
      yAxis: createYAxis(APP_TEXT.DASHBOARD.UNITS.ENERGY),
      series: [
        {
          name: `${APP_TEXT.DASHBOARD.KPI.ENERGY_IN} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.ENERGY_IN,
            width: 2,
          },
          data: sampledData.map(point => point.energyIn),
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
        {
          name: `${APP_TEXT.DASHBOARD.KPI.ENERGY_OUT} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
          type: 'line',
          smooth: true,
          symbol: 'none',
          lineStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.ENERGY_OUT,
            width: 2,
          },
          data: sampledData.map(point => point.energyOut),
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
      ],
    })
  }, [])

  return <BaseChart data={data} height={height} showLegend={showLegend} title={title} getOption={getOption} />
})
