<template>
  <div>{{ time }}</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { WebSocketClient } from '@/ws'

const time = ref()

const ws = new WebSocketClient('time')
ws.connect()

ws.onopen = () => console.log('WebSocket Connected')
ws.onmessage = event => {
  time.value = event.data
  console.log('Received:', event.data)
}
ws.onclose = () => console.log('WebSocket Closed')
</script>

<style scoped></style>
