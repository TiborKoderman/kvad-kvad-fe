<template>
  <div class="container">
    <h1 class="card-title mb-4">Devices</h1>
    <DevicesTable />
  </div>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/Views/DevicesView/DevicesTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped></style>