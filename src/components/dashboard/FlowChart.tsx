import { Box, Text } from "@chakra-ui/react"
import ReactECharts from "echarts-for-react"
import { APP_CONFIG, APP_TEXT } from "@/constants/text"

interface FlowChartProps {
  data: Array<{ timestamp: number; flow: number }>
  height?: number
  showLegend?: boolean
}

export function FlowChart({ data, height = 300, showLegend = true }: FlowChartProps) {
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
      data: [`${APP_TEXT.DASHBOARD.KPI.FLOW_RATE} (${APP_TEXT.DASHBOARD.UNITS.FLOW})`],
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
      name: APP_TEXT.DASHBOARD.UNITS.FLOW,
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
        name: `${APP_TEXT.DASHBOARD.KPI.FLOW_RATE} (${APP_TEXT.DASHBOARD.UNITS.FLOW})`,
        type: 'line',
        smooth: true,
        symbol: 'none',
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
        data: data.map(point => point.flow),
        animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
      },
    ],
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        {APP_TEXT.DASHBOARD.CHARTS.FLOW_RATE}
      </Text>
      <ReactECharts option={option} style={{ height: `${height}px` }} />
    </Box>
  )
}
