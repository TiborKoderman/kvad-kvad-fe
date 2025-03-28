<template>
  <div class="card" style="width: 25%">
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
import { computed, ref } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, CustomChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import Vector from '@/utils/vector'

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

const props = defineProps({
  S: {
    type: Number,
    required: false,
    default: 50,
  },
  P: {
    type: Number,
    required: false,
  },
  Q: {
    type: Number,
    required: false,
  },
  cosPhi: {
    type: Number,
    required: false,
    default: 0.9,
  },
})
// The input values can be either (P, Q) or (S, cosPhi), if all values are provided, they will be directly used

const P = computed(() => props.P ?? (props.S ?? 0) * props.cosPhi)
const Q = computed(
  () => props.Q ?? (props.S ?? 0) * Math.sqrt(1 - props.cosPhi ** 2),
)
const S = computed(() => props.S ?? Math.sqrt(P.value ** 2 + Q.value ** 2))
const cosPhi = computed(() => props.cosPhi ?? P.value / S.value)
const sinPhi = computed(() => Math.sqrt(1 - cosPhi.value ** 2))
const angle = computed(() => Math.atan2(Q.value, P.value) * (180 / Math.PI))

const chartOption = computed(() => ({
  grid: {
    left: '10%',
    right: '10%',
    top: '10%',
    bottom: '10%',
  },
  xAxis: {
    type: 'value',
    min: -S.value,
    max: S.value,
    axisLine: { onZero: true },
  },
  yAxis: {
    type: 'value',
    min: -S.value,
    max: S.value,
    axisLine: { onZero: true },
  },
  series: [
    {
      type: 'custom',
      renderItem: function (params, api) {
        const origin = api.coord([0, 0])
        const edge = api.coord([api.value(0), 0]) // For radius calculation
        const radius = Math.abs(edge[0] - origin[0])

        return {
          type: 'circle',
          shape: {
            cx: origin[0],
            cy: origin[1],
            r: radius,
          },
          style: {
            stroke: 'blue',
            fill: null,
            lineWidth: 0.25,
            lineDash: [5, 5],
          },
        }
      },
      data: [S.value],
    },
    {
      type: 'custom',
      renderItem: (params, api) => {
        return vectorRenderer(params, api, S.value.toFixed(2))
      },
      itemStyle: {
        color: 'red',
      },
      data: [[0, 0, P.value, Q.value]],
    },
    {
      type: 'custom',
      renderItem: (params, api) => {
        return vectorRenderer(params, api, `P: ${P.value.toFixed(2)}`)
      },
      itemStyle: {
        color: 'green',
      },
      data: [[0, 0, P.value, 0]],
    },
    {
      type: 'custom',
      renderItem: (params, api) => {
        return vectorRenderer(params, api, `Q: ${Q.value.toFixed(2)}`)
      },
      itemStyle: {
        color: 'blue',
      },
      data: [[0, 0, 0, Q.value]],
    },
    {
      type: 'line',
      data: [
        [P.value, 0],
        [P.value, Q.value],
      ],
      lineStyle: {
        type: 'dashed',
        color: 'gray',
      },
    },
    {
      type: 'line',
      data: [
        [0, Q.value],
        [P.value, Q.value],
      ],
      lineStyle: {
        type: 'dashed',
        color: 'gray',
      },
    },
  ],
}))

function vectorRenderer(params, api, text = null) {
  const origin = api.coord([0, 0])
  const end = api.coord([api.value(2), api.value(3)])

  const textOffset = 0.15 // Offset for the text position
  const textCoord = api.coord([
    api.value(2) + textOffset,
    api.value(3) + textOffset,
  ])

  const color = api.visual('color')

  return {
    type: 'group',
    children: [
      {
        type: 'line',
        shape: {
          x1: origin[0],
          y1: origin[1],
          x2: end[0],
          y2: end[1],
        },
        style: {
          stroke: color,
          lineWidth: 2,
        },
      },
      {
        type: 'text',
        style: {
          text: text, // Display the magnitude
          x: textCoord[0],
          y: textCoord[1],
          fill: color,
          font: '12px sans-serif',
          align: 'center',
          verticalAlign: 'middle',
        },
      },
      {
        type: 'polygon',
        shape: {
          points: (function () {
            const angle = Math.atan2(end[1] - origin[1], end[0] - origin[0])
            const arrowSize = 10
            return [
              [end[0], end[1]],
              [
                end[0] - arrowSize * Math.cos(angle - Math.PI / 6),
                end[1] - arrowSize * Math.sin(angle - Math.PI / 6),
              ],
              [
                end[0] - arrowSize * Math.cos(angle + Math.PI / 6),
                end[1] - arrowSize * Math.sin(angle + Math.PI / 6),
              ],
            ]
          })(),
        },
        style: {
          fill: color,
        },
      },
    ],
  }
}
</script>
