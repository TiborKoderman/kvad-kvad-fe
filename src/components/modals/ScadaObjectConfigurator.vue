<template>
  <div class="body d-flex gap-2">
    <div class="flex-shrink-1 d-flex align-center justify-center">
      <IconConfigurator :svg="svg" />
    </div>
    <HierarchyTree :svg="svg" />
    <div class="flex-grow-1 d-flex flex-column w-100">
      <div class="device-name-container border p-3 mb-3">
        <h5 class="mb-2 border-bottom">Device name</h5>
        <input
          type="text"
          class="form-control"
          id="deviceName"
          v-model="template.name"
          required
          autocomplete="off"
        />
      </div>
      <StateSelector
        class="mt-2"
        :states="template.data.metadata.states"
        @update:states="states => (template.data.metadata.states = states)"
      />
      <StateCustomizer
        class="mt-2"
        :states="template.data.metadata.states"
        @update:states="states => (template.data.metadata.states = states)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue'
import IconConfigurator from '@/components/scada/Vue/IconConfigurator.vue'
import StateSelector from '../scada/Vue/StateSelector.vue'
import StateCustomizer from '../scada/Vue/StateCustomizer.vue'
import HierarchyTree from '../scada/Vue/HierarchyTree.vue'
import { ScadaObjectTemplate } from '../scada/ScadaTypes'
import Svg from '@/components/scada/Svg'
import api from '@/api'

const svg = reactive<Svg>(new Svg())

const props = defineProps({
  deviceTemplate: {
    type: Object as PropType<ScadaObjectTemplate>,
    default: () => ({
      id: null,
      name: '',
      data: {
        metadata: {
          states: [],
        },
        svg: '',
      },
    }),
  },
})

const template = ref<ScadaObjectTemplate>(
  JSON.parse(JSON.stringify(props.deviceTemplate)),
)
if (template.value.data.svg) {
  svg.Load(template.value.data.svg)
  svg.setClickToSelect(true)
}
//submit, define expose and export default baseProps are required for the modal system to work
async function submit() {
  return api.post('/scada/template', {
    ...template.value,
    data: {
      ...template.value.data,
      svg: svg.svg.outerHTML,
    },
  })
}

defineOptions({
  name: 'ScadaObjectConfigurator',
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
