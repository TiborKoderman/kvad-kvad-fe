<template>
  <main class="vh-100 d-flex flex-column">
    <div class="card flex-grow-1">
      <div class="card-header">
        <h4 class="card-title">Docker Containers</h4>
      </div>
      <div class="card-body">
        <DataTable
          :columns="columns"
          :data="data"
          :options="options"
          class="table table-bordered"
        >
          <template #action="props">
            <button
              @click="startContainer(props.rowData.Id)"
              class="btn btn-success"
            >
              <i class="bi bi-play color-text-white"></i>
            </button>
            <button
              @click="stopContainer(props.rowData.Id)"
              class="btn btn-danger color-text-white" 
            >
              <i class="bi bi-stop"></i>
            </button>
          </template>
        </DataTable>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import api from '@/api'


const columns = ref([
  { title: 'Name', data: 'Name' },
  {
    title: 'State',
    data: 'State.Status',
    render: (data: string) => {
      if (data === 'running') {
        return '<span class="badge bg-success">Active</span>'
      } else if (data === 'exited' || data === 'stopped') {
        return '<span class="badge bg-danger">Stopped</span>'
      } else {
        return '<span class="badge bg-secondary">' + data + '</span>'
      }
    },
  },
  { title: 'Actions', data: null, render: '#action' },
])

const data = ref([])

const options = ref({
  pageLength: 10,
})

async function stopContainer(id: string) {
  console.log('Stopping container', id)
  api
    .get(`/Docker/container/${id}/stop`)
    .then(() => {
      getContainers()
      console.log('Container stopped')
    })
    .catch((error: any) => {
      console.error(error)
    })
}

async function startContainer(id: string) {
  api
    .get(`/Docker/container/${id}/start`)
    .then(() => {
      getContainers()
      console.log('Container started')
    })
    .catch((error: any) => {
      console.error(error)
    })
}

async function getContainers() {
  api
    .get('/Docker/containers')
    .then((response: { data: any }) => {
      data.value = response.data
    })
    .catch((error: any) => {
      console.error(error)
    })
}

onMounted(() => {
  getContainers()
})
</script>

<style scoped></style>
