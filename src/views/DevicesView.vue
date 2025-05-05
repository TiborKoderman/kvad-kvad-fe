<template>
  <div class="container h-100 d-flex flex-column">
    <h1 class="mb-4">Devices</h1>
    <DevicesTable />
  </div>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/Views/DevicesView/DevicesTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>

<style lang="scss" scoped></style>