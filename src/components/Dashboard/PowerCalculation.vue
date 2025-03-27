<template>
  <div class="card" style="width: 25%">
    <div class="card-header">Power calc</div>
    <div class="card-body">
      <div style="aspect-ratio: 1/1">
        <v-chart :option="chartOption" autoresize />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import VChart from 'vue-echarts'
import { computed, PropType, ref } from 'vue'
import * as echarts from 'echarts/core'
import { LineChart, CustomChart, ScatterChart } from 'echarts/charts'
import {
  GridComponent,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  PolarComponent,
} from 'echarts/components'
import { SVGRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  CustomChart,
  ScatterChart,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  PolarComponent,
  LegendComponent,
  SVGRenderer,
])

interface PowerComponents {
  V: number
  I: number
  cosPhi: number
}

const props = defineProps({
  powerComponents: {
    type: Array as PropType<PowerComponents[]>,
    required: true,
    default: () => [
      { V: 230, I: 10, cosPhi: 0.8 },
      { V: 232, I: 11, cosPhi: 0.6 },
      { V: 235, I: 13, cosPhi: 0.3 },
    ],
  },
  radians: {
    type: Boolean,
    default: false,
  },
})
const origin = [0, 0]

const powers = computed(() => {
  const I_max = Math.max(...props.powerComponents.map(power => power.I))
  const V_max = Math.max(...props.powerComponents.map(power => power.V))
  const powers = props.powerComponents.map(power => {
    const pwr = new Power(power.V, power.I, power.cosPhi)
    pwr.setMax(Math.max(V_max), Math.max(I_max))
    return pwr
  })
  return powers
})

class Power {
  V: number
  I: number
  cosPhi: number
  V_max: number
  I_max: number
  constructor(V: number, I: number, cosPhi: number) {
    this.V = V
    this.I = I
    this.cosPhi = cosPhi
  }

  phi() {
    return Math.acos(this.cosPhi)
  }

  setMax(V_max: number, I_max: number) {
    this.V_max = V_max
    this.I_max = I_max
  }

  VNormalized() {
    return this.V / this.V_max
  }
  INormalized() {
    return this.I / this.I_max
  }
}

const chartOption = ref({
  polar: [
    { id: 'L1', center: ['50%', '50%'] },
    { id: 'L2', center: ['50%', '50%'] },
    { id: 'L3', center: ['50%', '50%'] },
  ],
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'cross',
    },
  },
  angleAxis: [
    {
      type: 'value',
      startAngle: 0,
      max: 360,
      clockwise: false,
      splitLine: {
        show: false,
      },
      polarIndex: 0,
    },
    {
      type: 'value',
      startAngle: 120,
      max: 360,
      clockwise: false,
      show: false,
      splitLine: {
        show: false,
      },
      polarIndex: 1,
    },
    {
      type: 'value',
      startAngle: 240,
      max: 360,
      clockwise: false,
      show: false,
      splitLine: {
        show: false,
      },
      polarIndex: 2,
    },
  ],
  radiusAxis: [
    {
      min: 0,
      max: 1,
      polarIndex: 0,
    },
    {
      min: 0,
      max: 1,
      polarIndex: 1,
    },
    {
      min: 0,
      max: 1,
      polarIndex: 2,
    },
  ],
  series: [
    {
      type: 'line',
      coordinateSystem: 'polar',
      polarIndex: 0,
      symbol: 'arrow',
      symbolSize: 10,
      symbolRotate: -90,
      data: [
        origin, // Start point [radius, angle]
        [powers.value[0].VNormalized(), 0], // End point [radius, angle]
      ],
    },
    {
      type: 'line',
      coordinateSystem: 'polar',
      polarIndex: 1,
      data: [
        origin, // Start point
        [powers.value[1].VNormalized(), 0], // End point
      ],
    },
    {
      type: 'line',
      coordinateSystem: 'polar',
      polarIndex: 2,
      data: [
        origin, // Start point
        [powers.value[2].VNormalized(), 0], // End point
      ],
    },
  ],
})
</script>
