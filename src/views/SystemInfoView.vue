<template>
  <div class="d-flex flex-column gap-2">
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">CPU</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="fw-bold col">CPU model:</div>
          <div class="col">{{ data[0]?.['model name'] }}</div>
        </div>
        <div class="row">
          <div class="fw-bold col">CPU cores:</div>
          <div class="col">{{ cpuCount }}</div>
        </div>
        <div class="row">
          <div class="fw-bold col">CPU frequency:</div>
          <div class="col">{{ data[0]?.['cpu MHz'] }} MHz</div>
        </div>
        <div class="row">
          <div class="fw-bold col">CPU cache:</div>
          <div class="col">{{ data[0]?.['cache size'] }}</div>
        </div>
        <div class="row">
          <div class="fw-bold col">CPU flags:</div>
          <div class="col">
            <span
              v-for="(flag, index) in data[0]?.['flags']"
              :key="index"
              class="badge bg-primary me-1"
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
import MemoryInfo from '@/components/Info/MemoryInfo.vue';
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

<style scoped></style>
