<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Memory</h3>
    </div>
    <div class="card-body">
      <div class="info-container">
        <div class="info-row">
          <div class="fw-bold label">Total memory:</div>
          <div class="value">
            {{ data['MemTotal']?.['value'] }}
            {{ data['MemTotal']?.['unit'] }}
          </div>
        </div>
        <div class="info-row">
          <div class="fw-bold label">Free memory:</div>
          <div class="value">
            {{ data['MemFree']?.['value'] }}
            {{ data['MemFree']?.['unit'] }}
          </div>
        </div>
        <div class="info-row">
          <div class="fw-bold label">Available memory:</div>
          <div class="value">
            {{ data['MemAvailable']?.['value'] }}
            {{ data['MemAvailable']?.['unit'] }}
          </div>
        </div>
        <div class="info-row">
          <div class="fw-bold label">Swap total:</div>
          <div class="value">
            {{ data['SwapTotal']?.['value'] }} {{ data['SwapTotal']?.['unit'] }}
          </div>
        </div>
        <div class="info-row">
          <div class="fw-bold label">Swap free:</div>
          <div class="value">
            {{ data['SwapFree']?.['value'] }} {{ data['SwapFree']?.['unit'] }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/api'

const data = ref([])

onMounted(() => {
  api.get('/SystemInfo/memory').then(res => {
    data.value = res.data
  })
})

onUnmounted(() => {
  // clearInterval(interval)
})
</script>

<style scoped>
.info-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
}

.label {
  font-weight: bold;
  flex: 1;
}

.value {
  flex: 1;
  text-align: right;
}
</style>
