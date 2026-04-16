import { Box, Text } from "@chakra-ui/react"
import ReactECharts from "echarts-for-react"
import { APP_CONFIG, APP_TEXT } from "@/constants/text"

interface EfficiencyChartProps {
  data: Array<{ timestamp: number; energyIn: number; energyOut: number }>
  height?: number
  showLegend?: boolean
}

export function EfficiencyChart({ data, height = 300, showLegend = true }: EfficiencyChartProps) {
  // Calculate efficiency for each data point
  const efficiencyData = data.map(point => {
    const efficiency = point.energyIn > 0 ? (point.energyOut / point.energyIn) * 100 : 0
    return Number(efficiency.toFixed(1))
  })

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
      formatter: (params: any) => {
        const value = params[0].value
        return `${params[0].name}<br/>${params[0].seriesName}: ${value}%`
      },
    },
    legend: showLegend ? {
      data: [`${APP_TEXT.DASHBOARD.KPI.EFFICIENCY} (${APP_TEXT.DASHBOARD.UNITS.EFFICIENCY})`],
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
      name: APP_TEXT.DASHBOARD.UNITS.EFFICIENCY,
      min: 0,
      max: 100,
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
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        {APP_TEXT.DASHBOARD.CHARTS.EFFICIENCY_TREND}
      </Text>
      <ReactECharts option={option} style={{ height: `${height}px` }} />
    </Box>
  )
}
