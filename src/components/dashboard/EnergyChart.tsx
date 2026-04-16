import { Box, Text } from "@chakra-ui/react"
import ReactECharts from "echarts-for-react"
import { APP_CONFIG, APP_TEXT } from "@/constants/text"

interface EnergyChartProps {
  data: Array<{ timestamp: number; energyIn: number; energyOut: number }>
  height?: number
  showLegend?: boolean
}

export function EnergyChart({ data, height = 300, showLegend = true }: EnergyChartProps) {
  const option = {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: 'rgba(0, 255, 170, 0.3)',
      borderWidth: 1,
      textStyle: {
        color: '#fff',
      },
    },
    legend: showLegend ? {
      data: [
        `${APP_TEXT.DASHBOARD.KPI.ENERGY_IN} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
        `${APP_TEXT.DASHBOARD.KPI.ENERGY_OUT} (${APP_TEXT.DASHBOARD.UNITS.ENERGY})`,
      ],
      textStyle: {
        color: '#888',
      },
    } : undefined,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: data.map(point => 
        new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
      ),
      axisLine: {
        lineStyle: {
          color: '#555',
        },
      },
    },
    yAxis: {
      type: 'value',
      name: APP_TEXT.DASHBOARD.UNITS.ENERGY,
      nameTextStyle: {
        color: '#888',
      },
      axisLine: {
        lineStyle: {
          color: '#555',
        },
      },
      splitLine: {
        lineStyle: {
          color: '#333',
          opacity: 0.3,
        },
      },
    },
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
        data: data.map(point => point.energyIn),
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
        data: data.map(point => point.energyOut),
        animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
      },
    ],
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        {APP_TEXT.DASHBOARD.CHARTS.ENERGY_TRANSFER}
      </Text>
      <ReactECharts option={option} style={{ height: `${height}px` }} />
    </Box>
  )
}
