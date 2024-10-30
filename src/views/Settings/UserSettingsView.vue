<template>
  <main>
    <div class="card">
      <div class="card-header">
        <h3 class="card-title">Users</h3>
      </div>
      <div class="card-body">
        <DataTable
          :columns="columns"
          :data="data"
          :options="options"
          class="table table-bordered table-hover"
        >
          <template #action="props">
            <i
              class="bi bi-pencil-square pointer-event"
              @click="editUser(props)"
            />
          </template>
        </DataTable>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import DataTable from 'datatables.net-vue3'
import DataTablesCore from 'datatables.net-bs5'
DataTable.use(DataTablesCore)

import api from '@/api'

const columns = ref([
  { title: 'Username', data: 'username' },
  { title: 'Roles', data: 'userRoles' },
  { title: 'Actions', data: null, render: '#action' },
])

const options = ref({
  pageLength: 10
})

const data = ref([])

function editUser(id: string) {
  console.log(id)
}

function getUsers() {
  api.get('/User').then(res => {
    data.value = res.data
  })
}

onMounted(() => {
  getUsers()
})
</script>

<style scoped></style>
