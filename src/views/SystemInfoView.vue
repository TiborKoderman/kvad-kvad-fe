<template>
  <main>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">CPU</h3>
      </div>
      <div class="card-body">
        <div class="row">
          <div class="col">CPU count:</div>
          <div class="col">{{ data.length }}</div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import api from '@/api'
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
