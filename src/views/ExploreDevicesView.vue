<template>
  <div class="explore-devices container py-3">
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h1>Discovered devices</h1>
      <div>
        <button class="btn btn-sm btn-outline-primary me-2" @click="fetchDevices" :disabled="loading">
          Refresh
        </button>
      </div>
    </div>

    <div v-if="loading" class="text-muted">Loading devices…</div>
    <div v-else-if="error" class="alert alert-danger">Error: {{ error }}</div>

    <table v-else class="table table-striped table-sm">
      <thead>
        <tr>
          <th>Name</th>
          <th>Host</th>
          <th>Address</th>
          <th>Port</th>
          <th>Info</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(d, i) in devices" :key="i">
          <td>{{ pick(d, ['name','instanceName','fn','serviceName','hostname']) }}</td>
          <td>{{ pick(d, ['host','hostname','service']) }}</td>
          <td>{{ pick(d, ['address','ip','addr']) }}</td>
          <td>{{ d.port ?? '-' }}</td>
          <td><pre class="mb-0 small">{{ pretty(d) }}</pre></td>
        </tr>
        <tr v-if="devices.length === 0">
          <td colspan="5" class="text-muted">No devices discovered</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api from '@/api'

type Device = Record<string, unknown>

const devices = ref<Device[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

function pretty(obj: unknown) {
  try {
    return JSON.stringify(obj, null, 2)
  } catch {
    return String(obj)
  }
}

function pick(obj: Record<string, unknown> | undefined, keys: string[]) {
  if (!obj) return '-'
  for (const k of keys) {
    if (k in obj) {
      const v = (obj as Record<string, unknown>)[k]
      if (v != null && String(v) !== '') return String(v)
    }
  }
  return '-'
}

async function fetchDevices() {
  loading.value = true
  error.value = null
  try {
    const resp = await api.get('/mdns/devices')
    // Expecting an array of device objects. Normalize gracefully.
    devices.value = Array.isArray(resp.data) ? resp.data : (resp.data?.devices ?? [])
  } catch (err: unknown) {
    // try to get a message from known error shapes
    if (err && typeof err === 'object' && 'message' in err) {
      const maybe = (err as { message?: unknown }).message
      error.value = typeof maybe === 'string' ? maybe : String(err)
    } else {
      error.value = String(err)
    }
    devices.value = []
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchDevices()
})
</script>

<style scoped>
.explore-devices pre { white-space: pre-wrap; word-break: break-word; }
</style>
