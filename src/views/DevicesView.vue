<template>
  <div>
    <h3 class="card-title mb-0">Devices</h3>
    <DevicesTable />
  </div>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/Views/DevicesView/DevicesTable.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped></style>
