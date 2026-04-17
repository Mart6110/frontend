import { Box, Text } from "@chakra-ui/react"
import ReactECharts from "echarts-for-react"
import { useMemo, memo } from "react"
import type { EChartsOption } from "echarts"

interface BaseChartProps {
  data: any[]
  height?: number
  showLegend?: boolean
  title?: string
  isLoading?: boolean
  getOption: (data: any[], showLegend: boolean) => EChartsOption
}

export const BaseChart = memo(function BaseChart({ data, height = 300, showLegend = true, title, isLoading = false, getOption }: BaseChartProps) {
  const option = useMemo(() => getOption(data, showLegend), [data, showLegend, getOption])

  return (
    <Box>
      {title && (
        <Text fontSize="lg" fontWeight="semibold" mb={3} color="fg">
          {title}
        </Text>
      )}
      <Box position="relative">
        <ReactECharts 
          option={option} 
          style={{ height: `${height}px` }} 
          lazyUpdate={true}
          showLoading={isLoading}
          loadingOption={{
            text: '',
            color: '#14b8a6',
            maskColor: 'rgba(0, 0, 0, 0.4)',
          }}
        />
      </Box>
    </Box>
  )
})

// Utility function to format timestamps for x-axis
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString('en-US', { 
    month: 'short', 
    day: 'numeric', 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
}

// Sample data to reduce number of points for better performance
export function sampleData<T>(data: T[], maxPoints: number = 1000): T[] {
  if (data.length <= maxPoints) return data
  
  const step = Math.ceil(data.length / maxPoints)
  const sampled: T[] = []
  
  for (let i = 0; i < data.length; i += step) {
    sampled.push(data[i])
  }
  
  // Always include the last point
  if (sampled[sampled.length - 1] !== data[data.length - 1]) {
    sampled.push(data[data.length - 1])
  }
  
  return sampled
}

// Common chart configuration builder
export function createBaseChartConfig(overrides: Partial<EChartsOption> = {}): EChartsOption {
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
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    ...overrides,
  }
}

// Common x-axis configuration
export function createXAxis(timestamps: string[]): any {
  return {
    type: 'category',
    boundaryGap: false,
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
  }
}

// Common y-axis configuration
export function createYAxis(name: string, color: string = '#888'): any {
  return {
    type: 'value',
    name,
    nameTextStyle: {
      color: '#aaa',
    },
    axisLine: {
      lineStyle: {
        color,
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
  }
}
