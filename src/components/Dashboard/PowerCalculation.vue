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
import { computed, PropType, shallowRef } from 'vue'
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
      { V: 230, I: 5, cosPhi: 0.6 },
      { V: 235, I: 13, cosPhi: 0.99 },
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

  phiDegrees() {
    return (this.phi() * 180) / Math.PI
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

const chartOption = shallowRef({
  polar: [
    { id: 'L1', center: ['50%', '50%'] },
    { id: 'L2', center: ['50%', '50%'] },
    { id: 'L3', center: ['50%', '50%'] },
  ],
  grid: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
    containLabel: true,
  },
  tooltip: {
    trigger: 'item',
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
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 0,
      color: 'blue',
      renderItem: (params, api) =>
        vectorRenderer(params, api, `${powers.value[0].V.toFixed(1)} V`),
      data: [[0, 0, powers.value[0].VNormalized(), 0]],
      tooltip: {
        show: true,
        formatter: `L1: ${powers.value[0].V.toFixed(1)} V`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 0,
      color: 'blue',
      renderItem: (params, api) =>
        vectorRenderer(params, api, `${powers.value[0].I.toFixed(1)} A`),
      data: [
        [0, 0, powers.value[0].INormalized(), powers.value[0].phiDegrees()],
      ],
      tooltip: {
        show: true,
        formatter: `L1: ${powers.value[0].I.toFixed(1)} A`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 0,
      color: 'rgba(0, 0, 255, 0.2)', // Semi-transparent blue for the sector
      renderItem: sectorRenderer,
      data: [
      [0, 0, powers.value[0].INormalized(), powers.value[0].phiDegrees()],
      ],
      tooltip: {
      show: true,
      formatter: `Angle: ${powers.value[0].phiDegrees().toFixed(1)}°`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 1,
      color: 'green',
      renderItem: (params, api) =>
        vectorRenderer(params, api, `${powers.value[1].V.toFixed(1)} V`),
      data: [[0, 0, powers.value[1].VNormalized(), 0]],
      tooltip: {
        show: true,
        formatter: `L2: ${powers.value[0].V.toFixed(1)} V`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 1,
      color: 'green',
      renderItem: (params, api) =>
        vectorRenderer(params, api, `${powers.value[1].I.toFixed(1)} A`),
      data: [
        [0, 0, powers.value[1].INormalized(), powers.value[1].phiDegrees()],
      ],
      tooltip: {
        show: true,
        formatter: `L1: ${powers.value[0].I.toFixed(1)} A`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 1,
      color: 'green', // Semi-transparent blue for the sector
      renderItem: sectorRenderer,
      data: [
      [0, 0, powers.value[1].INormalized(), powers.value[1].phiDegrees()],
      ],
      tooltip: {
      show: true,
      formatter: `Angle: ${powers.value[1].phiDegrees().toFixed(1)}°`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 2,
      color: 'red',
      renderItem: (params, api) =>
        vectorRenderer(params, api, `${powers.value[2].V.toFixed(1)} V`),
      data: [[0, 0, powers.value[2].VNormalized(), 0]],
      tooltip: {
        show: true,
        formatter: `L3: ${powers.value[1].V.toFixed(1)} V`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 2,
      color: 'red',
      renderItem: (params, api) =>
        vectorRenderer(params, api, `${powers.value[2].I.toFixed(1)} A`),
      data: [
        [0, 0, powers.value[2].INormalized(), powers.value[2].phiDegrees()],
      ],
      tooltip: {
        show: true,
        formatter: `L1: ${powers.value[2].I.toFixed(1)} A`,
      },
    },
    {
      type: 'custom',
      coordinateSystem: 'polar',
      polarIndex: 2,
      color: 'rgba(255,0, 0,1)', // Semi-transparent blue for the sector
      renderItem: sectorRenderer,
      data: [
      [0, 0, powers.value[2].INormalized(), powers.value[2].phiDegrees()],
      ],
      tooltip: {
      show: true,
      formatter: `Angle: ${powers.value[2].phiDegrees().toFixed(1)}°`,
      },
    },
  ],
})

function vectorRenderer(params, api, text) {
  const origin = api.coord([api.value(0), api.value(1)])
  const radius = api.value(2)
  const angle = api.value(3)

  const end = api.coord([radius, angle])

  // console.log('origin', origin)
  // console.log('end', end)

  const textOffset = 0.15 // Offset for the text position

  const textCoord = api.coord([radius + textOffset, angle])

  const color = api.visual('color')

  return {
    type: 'group',
    origin: [origin[0], origin[1]], // Set the origin for rotation
    children: [
      {
        type: 'path',
        shape: {
          pathData: `M ${origin[0]} ${origin[1]} L ${end[0]} ${end[1]}`,
        },
        style: {
          stroke: color,
          lineWidth: 1,
          fill: 'none',
        },
      },

      {
        type: 'rect',
        shape: {
          x: textCoord[0] - 25, // Move text slightly outward along the vector
          y: textCoord[1] - 10, // Move text slightly outward along the vector
          width: 50, // Width of the textbox
          height: 20, // Height of the textbox
        },
        style: {
          fill: 'rgba(255, 255, 255, 0.8)', // Background color with transparency
          stroke: color, // Border color
          lineWidth: 1, // Border width
        },
      },
      {
        type: 'text',
        style: {
          text: text, // Display the radius value
          x: textCoord[0], // Move text slightly outward along the vector
          y: textCoord[1], // Move text slightly outward along the vector
          fill: color,
          font: '12px sans-serif',
          align: 'center',
          verticalAlign: 'middle',
        },
      },
      {
        type: 'polygon',
        shape: {
          points: [
            api.coord([radius, angle]), // Tip of the triangle
            api.coord([radius - 0.1, angle - 2.5 / radius]), // Bottom left of the triangle
            api.coord([radius - 0.1, angle + 2.5 / radius]), // Bottom right of the triangle
          ],
        },
        style: {
          fill: color,
        },
      },
    ],
  }
}

function sectorRenderer(params,api: any, text: string | undefined) {
  const origin = api.coord([api.value(0), api.value(1)])
  const radius = api.value(2)
  const angle = api.value(3) // Make the angle negative for counterclockwise
  const startAngle = api.value(1)

  const end = api.coord([api.value(2), angle])

  if (!text) {
    text = `${api.value(3).toFixed(1)}°`
  }

  const textPosition = api.coord([api.value(0) + 0.35, angle / 2])

  return {
    type: 'group',
    children: [
      {
        type: 'sector',
        shape: {
          cx: origin[0],
          cy: origin[1],
          r: radius,
          r0: 0,
          startAngle: (startAngle * Math.PI) / 180,
          endAngle: (angle * Math.PI) / 180,
          clockwise: true,
        },
        style: {
          fill: api.visual('color'),
          opacity: 0.3,
        },
      },
      {
        type: 'rect',
        shape: {
          x: textPosition[0] - 25, // Adjust position for the textbox
          y: textPosition[1] - 10,
          width: 50,
          height: 20,
        },
        style: {
          fill: 'rgba(255, 255, 255, 0.8)', // Background color with transparency
            stroke: `rgba(${echarts.color.parse(api.visual('color')).slice(0, 3).join(',')}, 1)`, // Border color
          lineWidth: 1,
        },
      },
      {
        type: 'text',
        style: {
          text: text,
          x: textPosition[0],
          y: textPosition[1],
          fill: `rgba(${echarts.color.parse(api.visual('color')).slice(0, 3).join(',')}, 1)`,
          font: '12px sans-serif',
          fontWeight: 'bold',
          align: 'center',
          verticalAlign: 'middle',
        },
      },
    ],
  }
}
</script>