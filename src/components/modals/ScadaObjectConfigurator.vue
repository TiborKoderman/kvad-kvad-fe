<template>
  <div class="body d-flex gap-2">
    <div class="flex-shrink-1 d-flex align-center justify-center">
      <IconConfigurator :svg="svg" />
    </div>
    <div class="flex-grow-1 d-flex flex-column w-100">
      <h1>Layers</h1>

      <div class="flex-grow-1 d-flex flex-column w-100 overflow-auto">
        <HierarchyTree :svg="svg" />
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
      <div></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, reactive, ref } from 'vue'
import IconConfigurator from '@/components/scada/Vue/IconConfigurator.vue'
import HierarchyTree from '../scada/Vue/HierarchyTree.vue'
import { ScadaObjectTemplate } from '../scada/ScadaTypes'
import Svg from '@/components/scada/Svg'
import api from '@/api'

const svg = reactive<Svg>(new Svg())

const props = defineProps({
  deviceTemplate: {
    type: Object as PropType<ScadaObjectTemplate>,
    default: () => ({
      id: '',
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

const template = ref<ScadaObjectTemplate>(JSON.parse(JSON.stringify(props.deviceTemplate)))
if (template.value.data.svg) {
  svg.Load(template.value.data.svg)
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
