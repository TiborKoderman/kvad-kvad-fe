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
import { computed,ref } from 'vue'
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
  },
  P: {
    type: Number,
    required: false,
  },
  Q: {
    type: Number,
    required: false,
  },
  pf:{
    type: Number,
    required: false,
  },
    harmonicDistortion: {
    type: Number,
    required: false,
  },
  cosPhi: {
    type: Number,
    required: false,
    default: 0.9,
  },
}
)

//The input values can be either (P, Q) or (S, cosPhi), if all values are provided, they will be directly used

const P = computed(() => props.P ?? (props.S ?? 0) * props.cosPhi)
const Q = computed(() => props.Q ?? (props.S ?? 0) * Math.sqrt(1 - props.cosPhi ** 2))
const S = computed(() => props.S ?? Math.sqrt(P.value ** 2 + Q.value ** 2))
// const pf = computed(() => P.value / S.value)
const cosPhi = computed(() => props.cosPhi ?? P.value / S.value)
const sinPhi = computed(() => Math.sqrt(1 - cosPhi.value ** 2))

const P_normalized = computed(() => P.value / S.value)
const Q_normalized = computed(() => Q.value / S.value)
const S_normalized = computed(() => 1) // Since S is the reference, its normalized value is always 1

const vector_S = ref(Vector.fromAngle(0.9))

const chartOption = computed(() => ({
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
      type: 'custom',
      renderItem: function (params, api) {
        const center = api.coord([0, 0]);
        const edge = api.coord([1, 0]); // For radius calculation
        const radius = edge[0] - center[0];

        return {
          type: 'circle',
          shape: {
            cx: center[0],
            cy: center[1],
            r: radius
          },
            style: {
            stroke: 'blue',
            fill: null,
            lineWidth: 0.25,
            lineDash: [5, 5]
            }
        };
      },
      data: [0]
    },
    {
      name: 'Apparent Power (S)',
      type: 'custom',
      tooltip: {
        show: true,
        formatter: 'Apparent Power (S): {c}',
      },
      renderItem: (params, api) => {
        const start = api.coord([0, 0])
        const end = api.coord([cosPhi, sinPhi])
        return chartArrow(start, end, 'blue')
      },
      data: [[cosPhi, sinPhi]],
    },
    {
      name: 'Active Power (P)',
      type: 'custom',
      tooltip: {
        show: true,
        formatter: 'Active Power (P): {c}',
      },
      renderItem: (params, api) => {
        const start = api.coord([0, 0])
        const end = api.coord([cosPhi, 0])
        return chartArrow(start, end, 'red')
      },
      data: [[cosPhi, 0]],
    },
    {
      name: 'Reactive Power (Q)',
      type: 'custom',
      tooltip: {
        show: true,
        formatter: 'Reactive Power (Q): {c}',
      },
      renderItem: (params, api) => {
        const start = api.coord([cosPhi, 0])
        const end = api.coord([cosPhi, sinPhi])
        return chartArrow(start, end, 'green')
      },
      data: [[cosPhi, sinPhi]],
    },

  ],
}))

function chartArrow(
  start: [number, number],
  end: [number, number],
  color: string,
) {
  const arrowSize = 0.05 // Size of the arrowhead
  const angle = Math.atan2(end[1] - start[1], end[0] - start[0]) // Angle of the line

  // Calculate the points for the arrowhead
  const arrowPoint1 = [
    end[0] - arrowSize * Math.cos(angle - Math.PI / 6),
    end[1] - arrowSize * Math.sin(angle - Math.PI / 6),
  ]
  const arrowPoint2 = [
    end[0] - arrowSize * Math.cos(angle + Math.PI / 6),
    end[1] - arrowSize * Math.sin(angle + Math.PI / 6),
  ]

  return {
    type: 'group',
    children: [
      {
        type: 'line',
        shape: {
          x1: start[0],
          y1: start[1],
          x2: end[0],
          y2: end[1],
        },
        style: {
          stroke: color,
          lineWidth: 2,
        },
      },
      {
        type: 'polygon',
        shape: {
          points: [end, arrowPoint1, arrowPoint2],
        },
        style: {
          fill: color,
        },
      }

    ],
  }
}
</script>
