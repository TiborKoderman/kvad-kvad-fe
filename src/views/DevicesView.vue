<template>
  <div>
    {{ seq }}
  </div>
  <div class="container h-100 d-flex flex-column">
    <h1 class="mb-4">Your devices</h1>
    <DevicesTable />
  </div>
</template>

<script setup lang="ts">
import DevicesTable from '@/components/Views/DevicesView/DevicesTable.vue'
import { frameJson } from '../FrameProtocol'

import { ws } from '@/ws'
import { ref } from 'vue'

const seq = ref(0)

ws.onTopic('device/state', frame => {
  console.log('Received message on device/state:', frame)
  const data = frameJson(frame)
  console.log('Parsed JSON data:', data)
  // Handle the parsed data as needed
  seq.value = data?.Seq // Example: update a reactive property
})

</script>

<style lang="scss" scoped></style>
