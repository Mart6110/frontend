import { APP_CONFIG, APP_TEXT } from "@/constants/text"
import { Box, Text } from "@chakra-ui/react"
import { useMemo, memo } from "react"
import ReactECharts from "echarts-for-react"
import { formatTimestamp, sampleData } from "./BaseChart"
import { ChartWithTableWrapper, type Column } from "./ChartWithTableWrapper"
import { DataTable, formatBoolean } from "./DataTable"
import type { EChartsOption } from "echarts"

interface TemperatureVsPumpChartProps {
  temperatureData: Array<{ timestamp: number; temperature: number }>
  pumpData: Array<{ timestamp: number; active: boolean }>
  height?: number
  title?: string
  enableTableView?: boolean
}

export const TemperatureVsPumpChart = memo(function TemperatureVsPumpChart({ 
  temperatureData, 
  pumpData, 
  height = 300, 
  title = APP_TEXT.DASHBOARD.CHARTS.TEMPERATURE_VS_PUMP,
  enableTableView = true 
}: TemperatureVsPumpChartProps) {
  const option = useMemo((): EChartsOption => {
    // Sample data for better performance
    const sampledTempData = sampleData(temperatureData, 500)
    const timestamps = sampledTempData.map(point => formatTimestamp(point.timestamp))
    const temperatures = sampledTempData.map(point => point.temperature)
    const pumpStatus = sampledTempData.map(tempPoint => {
      const pumpPoint = pumpData.find(p => p.timestamp === tempPoint.timestamp)
      return pumpPoint?.active ? 1 : 0
    })

    return {
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
        top: 0,
        textStyle: {
          color: '#aaa',
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
            color: '#888',
          },
        },
        axisLabel: {
          rotate: 45,
          fontSize: 10,
          color: '#aaa',
        },
      },
      yAxis: [
        {
          type: 'value',
          name: APP_TEXT.DASHBOARD.UNITS.TEMPERATURE,
          position: 'left',
          nameTextStyle: {
            color: '#aaa',
          },
          axisLine: {
            lineStyle: {
              color: '#888',
            },
          },
          axisLabel: {
            color: '#aaa',
          },
          splitLine: {
            lineStyle: {
              color: '#444',
              opacity: 0.5,
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
            color: '#aaa',
          },
          axisLabel: {
            formatter: (value: number) => value === 1 ? 'ON' : 'OFF',
            color: '#aaa',
          },
          axisLine: {
            lineStyle: {
              color: '#888',
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
          itemStyle: {
            color: APP_CONFIG.DASHBOARD.COLORS.TEMPERATURE,
          },
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
  }, [temperatureData, pumpData])

  // Prepare combined data for table view
  const tableData = useMemo(() => 
    temperatureData.map(tempPoint => {
      const pumpPoint = pumpData.find(p => p.timestamp === tempPoint.timestamp)
      return {
        timestamp: tempPoint.timestamp,
        temperature: tempPoint.temperature,
        pumpActive: pumpPoint?.active ?? false
      }
    }),
    [temperatureData, pumpData]
  )

  const tableColumns: Column[] = [
    { key: 'timestamp', label: 'Time' },
    { key: 'temperature', label: APP_TEXT.DASHBOARD.KPI.TEMPERATURE, unit: APP_TEXT.DASHBOARD.UNITS.TEMPERATURE },
    { key: 'pumpActive', label: 'Pump Status', format: formatBoolean },
  ]

  const chartComponent = (
    <Box>
      <ReactECharts 
        option={option} 
        style={{ height: `${height}px` }} 
        lazyUpdate={true}
      />
    </Box>
  )

  const tableComponent = <DataTable data={tableData} columns={tableColumns} height={height} />

  if (!enableTableView) {
    return (
      <Box>
        {title && (
          <Text fontSize="lg" fontWeight="semibold" mb={3}>
            {title}
          </Text>
        )}
        <ReactECharts 
          option={option} 
          style={{ height: `${height}px` }} 
          lazyUpdate={true}
        />
      </Box>
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
