<template>
    <div class="card flex-grow-1">
      <div class="card-header">
        <h4 class="card-title">MQTT Connections</h4>
      </div>
      <div class="card-body">
        <DataTable
          :columns="columns"
          :data="data"
          :options="options"
          class="table table-bordered table-hover"
        >
        </DataTable>
      </div>
    </div>
</template>

<script setup lang="ts">
import api from '@/api'
import { onMounted, onUnmounted, ref } from 'vue'

import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
DataTable.use(DataTablesCore)

const interval = ref(null)

const columns = ref([
  { title: 'Client ID', data: 'id' },
  { title: 'Connected', data: 'connectedTimestamp' },
  { title: 'Last Will', data: 'last_will' },
])

const data = ref([])
const options = ref({
  paging: true,
  searching: true,
  lengthChange: false,
  info: false,
  order: [[0, 'asc']],
})

onMounted(() => {
  fetchData()

  interval.value = setInterval(() => {
    fetchData()
  }, 5000)
})

onUnmounted(() => {
  clearInterval(interval.value)
})

async function fetchData() {
  const response = await api.get('/Mqtt/clients')
  data.value = response.data.map(client => ({
    id: client.id,
    connectedTimestamp: new Date(client.connectedTimestamp).toLocaleString(),
    last_will: client.session.disconnectedTimestamp
      ? client.session.disconnectedTimestamp.toLocaleString()
      : 'N/A',
  }))
}
</script>

<style scoped></style>
