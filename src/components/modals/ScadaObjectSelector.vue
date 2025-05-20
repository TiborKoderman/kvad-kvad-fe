<template>
  <div
    class="body d-flex flex-column justify-content-center align-content-center"
  >
    <div class="d-flex align-content-start flex-wrap flex-fill">
      <SObjectNewTile class="m-2" />
      <SObjectTile
        v-for="object in objects"
        :key="object.id"
        :object="object"
        class="m-2"
        :selected="selectedObject?.id === object.id"
        @click="selectedObject = object"
        @dblclick="submit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SObjectTile from '../scada/Vue/SObjectTile.vue'
import SObjectNewTile from '../scada/Vue/SObjectNewTile.vue'

const selectedObject = ref(null)

const objects = [
    
]

//submit, define expose and export default baseProps are required for the modal system to work
async function submit() {
  console.log('submit', selectedObject.value)
  return selectedObject.value
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
