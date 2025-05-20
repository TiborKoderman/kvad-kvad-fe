<template>
  <div class="body d-flex gap-2">
    <div class="flex-shrink-1 d-flex align-center justify-center">
      <IconConfigurator v-model="svg" />
    </div>
    <div class="flex-grow-1 d-flex flex-column w-100">
      <h1>Layers</h1>

      <div>
        <HierarchyTree
          :nodes="svg.getHierarchy()" 
        />
      </div>
    </div>
    <div class="flex-grow-1 d-flex flex-column w-100 p-2 m-2">
      <label for="deviceName">Device name</label>
      <input
        type="text"
        class="form-control"
        id="deviceName"
        v-model="template.name"
        required
        autocomplete="off"
      />
      <div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, watch } from 'vue'
import IconConfigurator from '@/components/scada/Vue/IconConfigurator.vue'
import HierarchyTree from '../scada/Vue/HierarchyTree.vue'
import { ScadaObjectTemplate } from '../scada/ScadaTypes'
import Svg from '@/components/scada/Svg'
import type { HieNode } from '@/components/scada/Svg'

const svg = ref<Svg>(new Svg())

const props = defineProps({
  deviceTemplate: {
    type: Object as PropType<ScadaObjectTemplate>,
    default: () => ({
      id: '',
      name: '',
      data: {
        metadata: {},
        svg: '',
      },
    }),
  },
})

const template = ref<ScadaObjectTemplate>({
  id: null,
  name: '',
  data: {
    metadata: {
      states: [],
      textFields: [],
    },
    svg: '',
  },
})

//submit, define expose and export default baseProps are required for the modal system to work
async function submit() {
  return
}

defineOptions({
  name: 'ScadaObjectSelector',
  baseProps: () => ({
    title: 'Configure SCADA object template',
  }),
})

defineExpose({ submit })
</script>
<style scoped>
.body {
  width: 99vw;
  height: 80vh;
  overflow: auto;
}
</style>
