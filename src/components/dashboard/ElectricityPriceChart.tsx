import { APP_CONFIG } from "@/constants/text"
import { BaseChart, createBaseChartConfig, createXAxis, createYAxis, sampleData } from "./BaseChart"
import { ChartWithTableWrapper, type Column } from "./ChartWithTableWrapper"
import { DataTable } from "./DataTable"
import type { EChartsOption } from "echarts"
import { memo, useCallback, useMemo } from "react"

interface ElectricityPriceChartProps {
  data: Array<{ hour: string; price_dkk_kwh: number }>
  height?: number
  showLegend?: boolean
  title?: string
  enableTableView?: boolean
  area?: string
  date?: string
}

export const ElectricityPriceChart = memo(function ElectricityPriceChart({ 
  data, 
  height = 300, 
  showLegend = true, 
  title = "Elpriser",
  enableTableView = true,
  area = "DK2",
  date
}: ElectricityPriceChartProps) {
  const getOption = useCallback((chartData: typeof data, legend: boolean): EChartsOption => {
    const sampledData = sampleData(chartData, 5000)
    
    // Format hours for display (extract hour from ISO string)
    const hours = sampledData.map(point => {
      const hourDate = new Date(point.hour)
      return hourDate.toLocaleTimeString('da-DK', { hour: '2-digit', minute: '2-digit' })
    })
    
    // Extract prices
    const prices = sampledData.map(point => Number(point.price_dkk_kwh.toFixed(3)))
    
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
          return `${params[0].name}<br/>${params[0].seriesName}: ${value} DKK/kWh`
        },
      },
      legend: legend ? {
        data: [`Elpris (DKK/kWh)`],
        top: 0,
        textStyle: {
          color: '#aaa',
        },
      } : undefined,
      xAxis: createXAxis(hours),
      yAxis: {
        ...createYAxis('DKK/kWh'),
        min: 0,
      },
      series: [
        {
          name: 'Elpris (DKK/kWh)',
          type: 'line',
          smooth: false,
          symbol: 'circle',
          symbolSize: 4,
          itemStyle: {
            color: '#f59e0b',
          },
          lineStyle: {
            color: '#f59e0b',
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
                { offset: 0, color: '#f59e0b40' },
                { offset: 1, color: '#f59e0b00' },
              ],
            },
          },
          data: prices,
          animationDuration: APP_CONFIG.DASHBOARD.CHART.ANIMATION_DURATION,
        },
      ],
    })
  }, [])

  // Prepare data for table view with formatted timestamps
  const tableData = useMemo(() => 
    data.map(point => {
      const hourDate = new Date(point.hour)
      return {
        timestamp: hourDate.getTime(),
        hour: point.hour,
        price: point.price_dkk_kwh
      }
    }),
    [data]
  )

  const tableColumns: Column[] = [
    { key: 'timestamp', label: 'Time' },
    { key: 'price', label: 'Elpris', unit: 'DKK/kWh' },
  ]

  const chartTitle = `${title}${date ? ` - ${date}` : ''} (${area})`
  const chartComponent = <BaseChart data={data} height={height} showLegend={showLegend} getOption={getOption} />
  const tableComponent = <DataTable data={tableData} columns={tableColumns} height={height} />

  if (!enableTableView) {
    return (
      <BaseChart data={data} height={height} showLegend={showLegend} title={chartTitle} getOption={getOption} />
    )
  }

  return (
    <ChartWithTableWrapper
      title={chartTitle}
      chartComponent={chartComponent}
      tableComponent={tableComponent}
    />
  )
})
