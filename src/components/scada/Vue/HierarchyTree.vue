<template>
  <div class="flex-grow-1 d-flex flex-column w-100 border p-3 bg-white">
    <h5 class="mb-3 pb-2 border-bottom">Elements</h5>
    <div class="flex-grow-1 d-flex flex-column w-100 overflow-auto">
      <SvgNode v-for="node in svg.filteredNodes" :key="node.id" :node="node" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { provide, Reactive } from 'vue'
import Svg from '@/components/scada/Svg'
import SvgNode from './SvgNode.vue'

const props = defineProps<{
  svg: Reactive<Svg>
}>()
provide('svg', props.svg)
</script>
<style scoped></style>
