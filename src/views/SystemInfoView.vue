<template>
  <div class="d-flex flex-column gap-2 flex-fill">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">CPU</h3>
      </div>
      <div class="card-body d-flex flex-column gap-2 flex-grow-1 w-100">
        <div class="d-flex justify-content-between align-items-center">
          <div class="fw-bold">CPU model:</div>
          <div>{{ data[0]?.['model name'] }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="fw-bold">CPU cores:</div>
          <div>{{ cpuCount }}</div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="fw-bold">CPU frequency:</div>
          <div>{{ data[0]?.['cpu MHz'] }} MHz</div>
        </div>
        <div class="d-flex justify-content-between align-items-center">
          <div class="fw-bold">CPU cache:</div>
          <div>{{ data[0]?.['cache size'] }}</div>
        </div>
        <div class="d-flex flex-column flex-shrink-1 overflow-hidden" style="max-width: 50vw">
          <div class="fw-bold">CPU flags:</div>
          <div class="d-flex flex-wrap overflow-hidden">
            <span
              v-for="(flag, index) in data[0]?.['flags']"
              :key="index"
              class="badge bg-primary me-1 mb-1 text-truncate"
              
            >
              {{ flag }}
            </span>
          </div>
        </div>
      </div>
    </div>
    <MemoryInfo />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'
import MemoryInfo from '@/components/Info/MemoryInfo.vue'
const data = ref([])

onMounted(() => {
  api.get('/SystemInfo/cpu').then(res => {
    data.value = res.data
  })
})

const cpuCount = computed(() => {
  //count the number of cpus
  return data.value.length
})
</script>

<style scoped>
.card-body {
  min-width: 0; /* Prevent overflow issues */
}
</style>
