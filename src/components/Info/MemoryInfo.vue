<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Memory</h3>
    </div>
    <div class="card-body">
      <div class="row">
        <div class="fw-bold col">Total memory:</div>
        <div class="col">
          {{ data['MemTotal']?.['value'] }}
          {{ data['MemTotal']?.['unit'] }}
        </div>
      </div>
      <div class="row">
        <div class="fw-bold col">Free memory:</div>
        <div class="col">
          {{ data['MemFree']?.['value'] }}
          {{ data['MemFree']?.['unit'] }}
        </div>
      </div>
      <div class="row">
        <div class="fw-bold col">Available memory:</div>
        <div class="col">
          {{ data['MemAvailable']?.['value'] }}
          {{ data['MemAvailable']?.['unit'] }}
        </div>
      </div>
      <div class="row">
        <div class="fw-bold col">Swap total:</div>
        <div class="col">
          {{ data['SwapTotal']?.['value'] }} {{ data['SwapTotal']?.['unit'] }}
        </div>
      </div>
      <div class="row">
        <div class="fw-bold col">Swap free:</div>
        <div class="col">{{ data['SwapFree']?.['value'] }} {{ data['SwapFree']?.['unit'] }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import api from '@/api'

const data = ref([])

// const interval = setInterval(() => {
//     api.get('/SystemInfo/memory').then(res => {
//       data.value = res.data
//     })
//   }, 10000)

onMounted(() => {
  api.get('/SystemInfo/memory').then(res => {
    data.value = res.data
  })
})

onUnmounted(() => {
  // clearInterval(interval)
})
</script>

<style scoped></style>
