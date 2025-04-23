<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">Devices</h3>
    </div>
    <div class="card-body">
      <DevicesTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/Views/DevicesView/DevicesTable.vue'
</script>

<style lang="scss" scoped></style>
