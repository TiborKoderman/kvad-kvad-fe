<template>
  <div class="card"  style="width: 25%">
    <div class="card-header">Vector Diagram</div>
    <div class="card-body">
      <div style="aspect-ratio: 1/1">
        <v-chart :option="chartOption" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, CustomChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  CustomChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  CanvasRenderer,
])

const phi = Math.PI / 4 // 45 degrees
const cosPhi = Math.cos(phi)
const sinPhi = Math.sin(phi)
const phiDeg = (phi * 180) / Math.PI

const unitCircle = Array.from({ length: 361 }, (_, i) => {
  const rad = (i * Math.PI) / 180
  return [Math.cos(rad), Math.sin(rad)]
})

const chartOption = computed(() => ({
  title: {
    text: 'Power Triangle on Unit Circle',
  },
  grid: {
    left: '10%',
    right: '10%',
    top: '10%',
    bottom: '10%',
  },
  xAxis: {
    min: -1.2,
    max: 1.2,
    type: 'value',
    axisLine: { onZero: true },
  },
  yAxis: {
    min: -1.2,
    max: 1.2,
    type: 'value',
    axisLine: { onZero: true },
  },
  series: [
    {
      name: 'Unit Circle',
      type: 'line',
      data: unitCircle,
      showSymbol: false,
      lineStyle: { type: 'dashed' },
    },
    {
      name: 'Apparent Power (S)',
      type: 'custom',
      renderItem(params, api) {
        const start = api.coord([0, 0])
        const end = api.coord([cosPhi, sinPhi])
        return {
          type: 'line',
          shape: {
            x1: start[0],
            y1: start[1],
            x2: end[0],
            y2: end[1],
          },
          style: {
            stroke: 'blue',
            lineWidth: 3,
          },
        }
      },
      data: [[cosPhi, sinPhi]],
    },
    {
      name: 'Active Power (P)',
      type: 'custom',
      renderItem(params, api) {
        const start = api.coord([0, 0])
        const end = api.coord([cosPhi, 0])
        return {
          type: 'line',
          shape: {
            x1: start[0],
            y1: start[1],
            x2: end[0],
            y2: end[1],
          },
          style: {
            stroke: 'green',
            lineWidth: 2,
          },
        }
      },
      data: [[cosPhi, 0]],
    },
    {
      name: 'Reactive Power (Q)',
      type: 'custom',
      renderItem(params, api) {
        const start = api.coord([cosPhi, 0])
        const end = api.coord([cosPhi, sinPhi])
        return {
          type: 'line',
          shape: {
            x1: start[0],
            y1: start[1],
            x2: end[0],
            y2: end[1],
          },
          style: {
            stroke: 'red',
            lineWidth: 2,
          },
        }
      },
      data: [[cosPhi, sinPhi]],
    },
    // Labels on lines using invisible scatter points
    {
      type: 'custom',
      renderItem(params, api) {
        const center = api.coord([0, 0])
        const radius = (0.2 * Math.min(api.getWidth(), api.getHeight())) / 2

        const startAngle = 0
        const endAngle = phi

        return {
          type: 'arc',
          shape: {
            cx: center[0],
            cy: center[1],
            r: radius,
            startAngle,
            endAngle,
            clockwise: true,
          },
          style: {
            stroke: '#333',
            fill: 'none',
            lineWidth: 1.5,
          },
        }
      },
      data: [[0, 0]],
    },
    {
      type: 'scatter',
      data: [[0.15 * cosPhi, 0.15 * sinPhi]],
      symbolSize: 0.1,
      label: {
        show: true,
        formatter: `φ = ${phiDeg.toFixed(1)}°`,
        position: 'top',
        color: '#000',
      },
      itemStyle: {
        opacity: 0,
      },
    },
    {
      type: 'scatter',
      data: [
        // Apparent Power (S) label: 2/3 along the vector
        {
          value: [(cosPhi * 2) / 3, (sinPhi * 2) / 3],
          label: {
            show: true,
            formatter: 'Apparent Power (S)',
            position: 'right',
            color: 'blue',
            fontWeight: 'bold',
          },
        },
        // Active Power (P) label: middle of horizontal line
        {
          value: [cosPhi / 2, 0],
          label: {
            show: true,
            formatter: 'Active Power (P)',
            position: 'top',
            color: 'green',
            fontWeight: 'bold',
          },
        },
        // Reactive Power (Q) label: middle of vertical line
        {
          value: [cosPhi, sinPhi / 2],
          label: {
            show: true,
            formatter: 'Reactive Power (Q)',
            position: 'right',
            color: 'red',
            fontWeight: 'bold',
          },
        },
      ],
      symbolSize: 0.1,
      itemStyle: { opacity: 0 },
    },
  ],
}))
</script>
