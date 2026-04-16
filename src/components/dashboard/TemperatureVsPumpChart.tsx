import { Box, Text } from "@chakra-ui/react"
import ReactECharts from "echarts-for-react"
import { APP_CONFIG, APP_TEXT } from "@/constants/text"

interface TemperatureVsPumpChartProps {
  temperatureData: Array<{ timestamp: number; temperature: number }>
  pumpData: Array<{ timestamp: number; active: boolean }>
  height?: number
}

export function TemperatureVsPumpChart({ temperatureData, pumpData, height = 300 }: TemperatureVsPumpChartProps) {
  // Merge data by timestamp
  const timestamps = temperatureData.map(point => 
    new Date(point.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
  )
  
  const temperatures = temperatureData.map(point => point.temperature)
  
  const pumpStatus = temperatureData.map(tempPoint => {
    const pumpPoint = pumpData.find(p => p.timestamp === tempPoint.timestamp)
    return pumpPoint?.active ? 1 : 0
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
      axisPointer: {
        type: 'cross',
      },
      formatter: (params: any) => {
        let result = `${params[0].name}<br/>`
        params.forEach((param: any) => {
          if (param.seriesName === 'Pump Status') {
            result += `${param.marker}${param.seriesName}: ${param.value === 1 ? 'ON' : 'OFF'}<br/>`
          } else {
            result += `${param.marker}${param.seriesName}: ${param.value}${APP_TEXT.DASHBOARD.UNITS.TEMPERATURE}<br/>`
          }
        })
        return result
      },
    },
    legend: {
      data: [
        `${APP_TEXT.DASHBOARD.KPI.TEMPERATURE} (${APP_TEXT.DASHBOARD.UNITS.TEMPERATURE})`,
        'Pump Status',
      ],
      textStyle: {
        color: '#888',
      },
    },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: timestamps,
      axisLine: {
        lineStyle: {
          color: '#555',
        },
      },
    },
    yAxis: [
      {
        type: 'value',
        name: APP_TEXT.DASHBOARD.UNITS.TEMPERATURE,
        position: 'left',
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
      {
        type: 'value',
        name: 'Pump',
        position: 'right',
        min: 0,
        max: 1,
        interval: 1,
        nameTextStyle: {
          color: '#888',
        },
        axisLabel: {
          formatter: (value: number) => value === 1 ? 'ON' : 'OFF',
        },
        axisLine: {
          lineStyle: {
            color: '#555',
          },
        },
        splitLine: {
          show: false,
        },
      },
    ],
    series: [
      {
        name: `${APP_TEXT.DASHBOARD.KPI.TEMPERATURE} (${APP_TEXT.DASHBOARD.UNITS.TEMPERATURE})`,
        type: 'line',
        yAxisIndex: 0,
        smooth: true,
        symbol: 'none',
        lineStyle: {
          color: APP_CONFIG.DASHBOARD.COLORS.TEMPERATURE,
          width: 2,
        },
        data: temperatures,
        animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
      },
      {
        name: 'Pump Status',
        type: 'bar',
        yAxisIndex: 1,
        barWidth: '60%',
        itemStyle: {
          color: APP_CONFIG.DASHBOARD.COLORS.PUMP_ACTIVE,
        },
        data: pumpStatus,
        animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
      },
    ],
  }

  return (
    <Box>
      <Text fontSize="lg" fontWeight="semibold" mb={3}>
        {APP_TEXT.DASHBOARD.CHARTS.TEMPERATURE_VS_PUMP}
      </Text>
      <ReactECharts option={option} style={{ height: `${height}px` }} />
    </Box>
  )
}
