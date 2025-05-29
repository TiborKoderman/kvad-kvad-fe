<template>
  <div
    class="body d-flex flex-column justify-content-center align-content-center"
    @dragover.prevent="dragging = true"
    @dragleave.prevent="dragging = false"
    @drop.prevent="handleDrop"
    :class="{ dragging }"
  >
    <div class="d-flex align-content-start flex-wrap flex-fill">
      <SObjectNewTile class="m-2" @click="modals.open('ScadaObjectConfigurator', {}).then(() => fetchTemplates())" />
      <SObjectTile
        v-for="object in objects"
        :key="object.id"
        :object="object"
        class="m-2"
        :selected="selectedObject?.id === object.id"
        @click="selectedObject = object"
        @dblclick="submit"
        @reload="fetchTemplates"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SObjectTile from '../scada/Vue/SObjectTile.vue'
import SObjectNewTile from '../scada/Vue/SObjectNewTile.vue'
import api from '@/api'
import { useModalStore } from '@/stores/modals'
import { ScadaObjectTemplate } from '../scada/ScadaTypes'
const modals = useModalStore()

const selectedObject = ref(null)

const objects = ref<ScadaObjectTemplate[]>([])

//submit, define expose and export default baseProps are required for the modal system to work
async function submit() {
  if (!selectedObject.value) {
    throw new Error('No object selected')
  }
  return Promise.resolve(selectedObject.value)
}

async function fetchTemplates() {
  api.get('/scada/templates').then((response) => {
    objects.value = response.data
  })
}
fetchTemplates()

const dragging = ref(false)

function handleDrop(event: DragEvent) {
  dragging.value = false
  if (!event.dataTransfer?.files.length) return

  const file = event.dataTransfer.files[0]
  if (file.type === 'application/json' || file.name.endsWith('.json')) {
    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        // Optionally validate json structure here
        // Add to objects list or handle as needed
        objects.value.push(json)
      } catch (err) {
        // Optionally show error
        console.error('Invalid JSON:', err)
      }
    }
    reader.readAsText(file)
  }
}

defineOptions({
  name: 'ScadaObjectSelector',
  baseProps: () => ({
    title: 'Select SCADA Object',
  }),
})

defineExpose({ submit })
</script>
<style scoped>
.body {
  width: 80vw;
  height: 80vh;
  overflow: auto;
}
</style>
