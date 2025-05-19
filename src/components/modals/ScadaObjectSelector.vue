<template>
  <div class="d-flex flex-column w">
    <div class="d-flex flex-row w-100">
        <input
          type="text"
          class="form-control"
          placeholder="Search..."
          v-model="search"
        />
    </div>
    <div
      class="d-flex flex-wrap w-100"
      style="width: 8.5em; height: 17em; overflow-y: auto;"
    >
      <div
        v-for="n in 32"
        :key="n"
        style="width: 2em; height: 2em; margin: 0.1em; background: #e0e0e0; border: 1px solid #ccc; display: flex; align-items: center; justify-content: center; box-sizing: border-box;"
      >
        {{ n }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import api from '@/api'

const selectedObject = ref(null)

interface ScadaObjectTemplate {
  id: string
  name: string
  description: string
}

//submit, define expose and export default baseProps are required for the modal system to work
async function submit() {
  return
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
.text-danger {
  font-size: 0.875em;
}
</style>
